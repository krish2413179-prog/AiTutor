import express from 'express';
import { ragPipeline } from './rag.js';
import { generativeModel } from './geminiClient.js';
import { initializeUser, getUserProfile } from './services/userService.js';
import { updateProgress, getUserProgress } from './services/progressService.js';
import { saveQuizResult } from './services/quizService.js';

const router = express.Router();

/**
 * POST /api/ask
 * Answer questions with personalized learning flow
 * - NEW users (no wallet/no progress): Answer freely using AI
 * - EXISTING users (with completed modules): Only answer about completed topics
 */
router.post('/ask', async (req, res) => {
  try {
    const { question, walletAddress } = req.body;

    if (!question || typeof question !== 'string' || question.trim() === '') {
      return res.status(400).json({
        success: false,
        error: 'Question is required and must be a non-empty string'
      });
    }

    // Helper function for new user responses (unrestricted AI)
    const answerAsNewUser = async () => {
      const generalPrompt = `You are a friendly and knowledgeable educational assistant helping someone learn about blockchain and Web3 concepts. 

Answer this question in a clear, conversational way. Be helpful and encouraging. If the question is complex, break it down into simpler parts.

Question: ${question}

Provide a helpful, educational answer:`;

      const result = await generativeModel.generateContent(generalPrompt);
      return result.response.text();
    };

    // NEW USER FLOW: No wallet address provided
    if (!walletAddress || typeof walletAddress !== 'string' || walletAddress.trim() === '') {
      const answer = await answerAsNewUser();
      return res.json({ answer });
    }

    // EXISTING USER FLOW: Check their progress
    try {
      const userProgress = await getUserProgress(walletAddress);
      const completedModules = userProgress.filter(progress => progress.completed === true);
      
      // No completed modules yet? Treat as new user
      if (completedModules.length === 0) {
        const answer = await answerAsNewUser();
        return res.json({ answer });
      }

      // User has completed modules - restrict to completed topics
      const completedTopics = completedModules.map(module => module.topic);

      // Try to find relevant context from completed topics
      const { context } = await ragPipeline(question, 0.5, 3, completedTopics);

      if (!context || context.trim() === '') {
        // No match in completed topics - check if question relates to uncompleted topic
        const allDocsResult = await ragPipeline(question, 0.5, 1, null);
        
        if (allDocsResult.documents && allDocsResult.documents.length > 0) {
          const relatedTopic = allDocsResult.documents[0].metadata?.topic;
          
          if (relatedTopic && !completedTopics.includes(relatedTopic)) {
            return res.json({
              answer: `I'd love to help you with that! However, you'll need to complete the "${relatedTopic}" module first to unlock this topic. Keep learning, you're doing great! 🚀`
            });
          }
        }

        // Can't determine specific module
        return res.json({
          answer: `This topic isn't covered in the modules you've completed yet. Try exploring more modules to unlock new topics! 📚`
        });
      }

      // Answer based on completed topics
      const prompt = `You are a friendly educational assistant helping a student who has completed certain learning modules.

Answer their question based ONLY on the context provided below. Be conversational, encouraging, and clear. If you can't answer from the context, let them know they need to complete more modules.

Context from completed modules:
${context}

Student's question: ${question}

Provide a helpful answer based on what they've learned:`;

      const result = await generativeModel.generateContent(prompt);
      const answer = result.response.text();

      res.json({ answer });

    } catch (progressError) {
      // User doesn't exist or error fetching progress - treat as new user
      console.log('User progress not found, treating as new user:', progressError.message);
      const answer = await answerAsNewUser();
      return res.json({ answer });
    }

  } catch (error) {
    console.error('Error in /api/ask:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to process question'
    });
  }
});

/**
 * POST /api/quiz
 * Generate quiz questions with personalized learning flow
 * - NEW users (no wallet/no progress): Generate quiz on any topic
 * - EXISTING users (with completed modules): Only generate quiz from completed topics
 */
router.post('/quiz', async (req, res) => {
  try {
    const { topic, num_questions, walletAddress } = req.body;

    if (!topic || typeof topic !== 'string' || topic.trim() === '') {
      return res.status(400).json({
        success: false,
        error: 'Topic is required and must be a non-empty string'
      });
    }

    // Validate and set num_questions (default to 5, range 1-10)
    let numQuestions = 5;
    if (num_questions !== undefined) {
      if (typeof num_questions !== 'number' || !Number.isInteger(num_questions)) {
        return res.status(400).json({
          success: false,
          error: 'num_questions must be a positive integer'
        });
      }
      if (num_questions < 1 || num_questions > 10) {
        return res.status(400).json({
          success: false,
          error: 'num_questions must be between 1 and 10'
        });
      }
      numQuestions = num_questions;
    }

    // Helper function to generate quiz from context
    const generateQuiz = async (context) => {
      const prompt = `You are an educational quiz generator. Based STRICTLY on the provided context, generate exactly ${numQuestions} conceptual multiple-choice questions.

Context:
${context}

Requirements:
- Generate exactly ${numQuestions} questions (no more, no less)
- Each question must have 4 options (A, B, C, D)
- Mark the correct answer
- Questions must be based ONLY on the provided context
- Return ONLY valid JSON, no additional text

Return format:
{
  "questions": [
    {
      "question": "Question text here?",
      "options": ["A) Option 1", "B) Option 2", "C) Option 3", "D) Option 4"],
      "correctAnswer": "A"
    }
  ]
}

Generate the quiz:`;

      const result = await generativeModel.generateContent(prompt);
      let responseText = result.response.text();

      // Clean up response to extract JSON
      responseText = responseText.replace(/```json\n?/g, '').replace(/```\n?/g, '').trim();

      const quizData = JSON.parse(responseText);
      return quizData.questions || [];
    };

    // NEW USER FLOW: No wallet address provided
    if (!walletAddress || typeof walletAddress !== 'string' || walletAddress.trim() === '') {
      const { context } = await ragPipeline(topic);

      // If we have context from database, use it
      if (context && context.trim() !== '') {
        const questions = await generateQuiz(context);
        return res.json({
          success: true,
          data: { questions }
        });
      }

      // No context in database? Generate quiz using AI's general knowledge
      const generalPrompt = `You are an educational quiz generator. Generate exactly ${numQuestions} conceptual multiple-choice questions about "${topic}".

Requirements:
- Generate exactly ${numQuestions} questions (no more, no less)
- Each question must have 4 options (A, B, C, D)
- Mark the correct answer
- Questions should test understanding of ${topic}
- Return ONLY valid JSON, no additional text

Return format:
{
  "questions": [
    {
      "question": "Question text here?",
      "options": ["A) Option 1", "B) Option 2", "C) Option 3", "D) Option 4"],
      "correctAnswer": "A"
    }
  ]
}

Generate the quiz:`;

      const result = await generativeModel.generateContent(generalPrompt);
      let responseText = result.response.text();
      responseText = responseText.replace(/```json\n?/g, '').replace(/```\n?/g, '').trim();
      const quizData = JSON.parse(responseText);
      
      return res.json({
        success: true,
        data: {
          questions: quizData.questions || []
        }
      });
    }

    // EXISTING USER FLOW: Check their progress
    try {
      const userProgress = await getUserProgress(walletAddress);
      const completedModules = userProgress.filter(progress => progress.completed === true);
      
      // No completed modules yet? Generate quiz freely
      if (completedModules.length === 0) {
        const { context } = await ragPipeline(topic);

        // If we have context from database, use it
        if (context && context.trim() !== '') {
          const questions = await generateQuiz(context);
          return res.json({
            success: true,
            data: { questions }
          });
        }

        // No context in database? Generate quiz using AI's general knowledge
        const generalPrompt = `You are an educational quiz generator. Generate exactly ${numQuestions} conceptual multiple-choice questions about "${topic}".

Requirements:
- Generate exactly ${numQuestions} questions (no more, no less)
- Each question must have 4 options (A, B, C, D)
- Mark the correct answer
- Questions should test understanding of ${topic}
- Return ONLY valid JSON, no additional text

Return format:
{
  "questions": [
    {
      "question": "Question text here?",
      "options": ["A) Option 1", "B) Option 2", "C) Option 3", "D) Option 4"],
      "correctAnswer": "A"
    }
  ]
}

Generate the quiz:`;

        const result = await generativeModel.generateContent(generalPrompt);
        let responseText = result.response.text();
        responseText = responseText.replace(/```json\n?/g, '').replace(/```\n?/g, '').trim();
        const quizData = JSON.parse(responseText);
        
        return res.json({
          success: true,
          data: {
            questions: quizData.questions || []
          }
        });
      }

      // User has completed modules - restrict to completed topics
      const completedTopics = completedModules.map(module => module.topic);

      // Try to find relevant context from completed topics
      const { context } = await ragPipeline(topic, 0.5, 3, completedTopics);

      if (!context || context.trim() === '') {
        // No match in completed topics - check if topic exists in uncompleted modules
        const allDocsResult = await ragPipeline(topic, 0.5, 1, null);
        
        if (allDocsResult.context && allDocsResult.context.trim() !== '') {
          // Topic exists but not completed
          return res.status(403).json({
            success: false,
            error: `You need to complete the ${topic} module first to take this quiz.`
          });
        }

        // Topic doesn't exist at all
        return res.json({
          success: true,
          data: {
            questions: []
          }
        });
      }

      // Generate quiz based on completed topics
      const questions = await generateQuiz(context);
      res.json({
        success: true,
        data: {
          questions
        }
      });

    } catch (progressError) {
      // User doesn't exist or error fetching progress - treat as new user
      console.log('User progress not found, treating as new user:', progressError.message);
      
      const { context } = await ragPipeline(topic);

      // If we have context from database, use it
      if (context && context.trim() !== '') {
        const questions = await generateQuiz(context);
        return res.json({
          success: true,
          data: { questions }
        });
      }

      // No context in database? Generate quiz using AI's general knowledge
      const generalPrompt = `You are an educational quiz generator. Generate exactly ${numQuestions} conceptual multiple-choice questions about "${topic}".

Requirements:
- Generate exactly ${numQuestions} questions (no more, no less)
- Each question must have 4 options (A, B, C, D)
- Mark the correct answer
- Questions should test understanding of ${topic}
- Return ONLY valid JSON, no additional text

Return format:
{
  "questions": [
    {
      "question": "Question text here?",
      "options": ["A) Option 1", "B) Option 2", "C) Option 3", "D) Option 4"],
      "correctAnswer": "A"
    }
  ]
}

Generate the quiz:`;

      const result = await generativeModel.generateContent(generalPrompt);
      let responseText = result.response.text();
      responseText = responseText.replace(/```json\n?/g, '').replace(/```\n?/g, '').trim();
      const quizData = JSON.parse(responseText);
      
      return res.json({
        success: true,
        data: {
          questions: quizData.questions || []
        }
      });
    }

  } catch (error) {
    console.error('Error in /api/quiz:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to generate quiz'
    });
  }
});

/**
 * POST /api/evaluate
 * Evaluate student answer based on retrieved context
 */
router.post('/evaluate', async (req, res) => {
  try {
    const { question, studentAnswer } = req.body;

    if (!question || typeof question !== 'string' || question.trim() === '') {
      return res.status(400).json({
        success: false,
        error: 'Question is required and must be a non-empty string'
      });
    }

    if (!studentAnswer || typeof studentAnswer !== 'string' || studentAnswer.trim() === '') {
      return res.status(400).json({
        success: false,
        error: 'Student answer is required and must be a non-empty string'
      });
    }

    const { context } = await ragPipeline(question);

    if (!context || context.trim() === '') {
      return res.json({
        success: true,
        data: {
          score: 0,
          passed: false,
          feedback: 'This question is not covered in this module.'
        }
      });
    }

    const prompt = `You are an educational evaluator. Evaluate the student's answer STRICTLY based on the provided context.

Context:
${context}

Question: ${question}

Student Answer: ${studentAnswer}

Evaluation Criteria:
- Score from 0-100 based on accuracy and completeness
- Pass threshold: 60
- Provide constructive feedback
- Base evaluation ONLY on the provided context

Return ONLY valid JSON, no additional text:
{
  "score": <number 0-100>,
  "passed": <boolean>,
  "feedback": "<string>"
}

Evaluate:`;

    const result = await generativeModel.generateContent(prompt);
    let responseText = result.response.text();

    // Clean up response to extract JSON
    responseText = responseText.replace(/```json\n?/g, '').replace(/```\n?/g, '').trim();

    const evaluation = JSON.parse(responseText);

    res.json({
      success: true,
      data: {
        score: evaluation.score,
        passed: evaluation.passed,
        feedback: evaluation.feedback
      }
    });
  } catch (error) {
    console.error('Error in /api/evaluate:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to evaluate answer'
    });
  }
});

/**
 * POST /api/user/init
 * Initialize or update user profile on wallet connection
 */
router.post('/user/init', async (req, res) => {
  try {
    const { walletAddress } = req.body;

    if (!walletAddress || typeof walletAddress !== 'string' || walletAddress.trim() === '') {
      return res.status(400).json({
        success: false,
        error: 'Wallet address is required and must be a non-empty string'
      });
    }

    const user = await initializeUser(walletAddress);

    res.json({
      success: true,
      data: user
    });
  } catch (error) {
    console.error('Error in /api/user/init:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to initialize user'
    });
  }
});

/**
 * GET /api/user/:walletAddress
 * Retrieve user profile with statistics
 */
router.get('/user/:walletAddress', async (req, res) => {
  try {
    const { walletAddress } = req.params;

    const profile = await getUserProfile(walletAddress);

    res.json({
      success: true,
      data: profile
    });
  } catch (error) {
    console.error('Error in /api/user/:walletAddress:', error);
    
    if (error.code === 'PGRST116') {
      return res.status(404).json({
        success: false,
        error: 'User not found'
      });
    }

    res.status(500).json({
      success: false,
      error: 'Failed to retrieve user profile'
    });
  }
});

/**
 * POST /api/progress/update
 * Update learning progress for a topic
 */
router.post('/progress/update', async (req, res) => {
  try {
    const { walletAddress, topic, progressPercentage } = req.body;

    if (!walletAddress || typeof walletAddress !== 'string' || walletAddress.trim() === '') {
      return res.status(400).json({
        success: false,
        error: 'Wallet address is required and must be a non-empty string'
      });
    }

    if (!topic || typeof topic !== 'string' || topic.trim() === '') {
      return res.status(400).json({
        success: false,
        error: 'Topic is required and must be a non-empty string'
      });
    }

    if (typeof progressPercentage !== 'number') {
      return res.status(400).json({
        success: false,
        error: 'Progress percentage is required and must be a number'
      });
    }

    const progress = await updateProgress(walletAddress, topic, progressPercentage);

    res.json({
      success: true,
      data: progress
    });
  } catch (error) {
    console.error('Error in /api/progress/update:', error);
    res.status(500).json({
      success: false,
      error: error.message || 'Failed to update progress'
    });
  }
});

/**
 * GET /api/progress/:walletAddress
 * Retrieve all progress records for a user
 */
router.get('/progress/:walletAddress', async (req, res) => {
  try {
    const { walletAddress } = req.params;

    const progress = await getUserProgress(walletAddress);

    res.json({
      success: true,
      data: progress
    });
  } catch (error) {
    console.error('Error in /api/progress/:walletAddress:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to retrieve progress'
    });
  }
});

/**
 * POST /api/quiz/save
 * Save quiz result, award XP, and update level
 */
router.post('/quiz/save', async (req, res) => {
  try {
    const { walletAddress, topic, score, totalQuestions } = req.body;

    if (!walletAddress || typeof walletAddress !== 'string' || walletAddress.trim() === '') {
      return res.status(400).json({
        success: false,
        error: 'Wallet address is required and must be a non-empty string'
      });
    }

    if (!topic || typeof topic !== 'string' || topic.trim() === '') {
      return res.status(400).json({
        success: false,
        error: 'Topic is required and must be a non-empty string'
      });
    }

    if (typeof score !== 'number' || typeof totalQuestions !== 'number') {
      return res.status(400).json({
        success: false,
        error: 'Score and total questions must be numbers'
      });
    }

    const result = await saveQuizResult(walletAddress, topic, score, totalQuestions);

    res.json({
      success: true,
      data: result
    });
  } catch (error) {
    console.error('Error in /api/quiz/save:', error);
    res.status(500).json({
      success: false,
      error: error.message || 'Failed to save quiz result'
    });
  }
});

export default router;
