import React, { useState } from 'react';
import { motion } from 'motion/react';
import { useWallet } from '@solana/wallet-adapter-react';
import { Trophy, Loader2, RotateCcw, Sparkles } from 'lucide-react';
import QuizCard from '../components/QuizCard';
import WalletButton from '../components/WalletButton';
import { generateQuiz, evaluateQuiz, QuizQuestion, EvaluateQuizResponse } from '../services/api';

type QuizState = 'setup' | 'taking' | 'results';

const Quiz: React.FC = () => {
  const { connected } = useWallet();
  const [quizState, setQuizState] = useState<QuizState>('setup');
  const [topic, setTopic] = useState('');
  const [numQuestions, setNumQuestions] = useState(5);
  const [isLoading, setIsLoading] = useState(false);
  const [quiz, setQuiz] = useState<QuizQuestion[]>([]);
  const [userAnswers, setUserAnswers] = useState<string[]>([]);
  const [results, setResults] = useState<EvaluateQuizResponse | null>(null);

  const handleGenerateQuiz = async () => {
    if (!topic.trim()) return;

    setIsLoading(true);
    try {
      const response = await generateQuiz(topic, numQuestions);
      setQuiz(response.questions);
      setUserAnswers(new Array(response.questions.length).fill(''));
      setQuizState('taking');
    } catch (error) {
      alert('Failed to generate quiz. Please make sure the backend server is running.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleSelectAnswer = (questionIndex: number, answer: string) => {
    const newAnswers = [...userAnswers];
    newAnswers[questionIndex] = answer;
    setUserAnswers(newAnswers);
  };

  const handleSubmitQuiz = () => {
    if (userAnswers.some((answer) => !answer)) {
      alert('Please answer all questions before submitting.');
      return;
    }

    // Client-side evaluation
    const results = quiz.map((question, index) => ({
      question: question.question,
      user_answer: userAnswers[index],
      correct_answer: question.correctAnswer,
      is_correct: userAnswers[index] === question.correctAnswer
    }));

    const score = results.filter(r => r.is_correct).length;
    const total = quiz.length;
    const percentage = (score / total) * 100;

    setResults({
      score,
      total,
      percentage,
      results
    });
    setQuizState('results');
  };

  const handleRestart = () => {
    setQuizState('setup');
    setTopic('');
    setQuiz([]);
    setUserAnswers([]);
    setResults(null);
  };

  if (!connected) {
    return (
      <div className="min-h-screen bg-[#0f0f0f] flex items-center justify-center px-6">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="text-center space-y-6 max-w-md"
        >
          <div className="w-20 h-20 mx-auto rounded-full bg-gradient-to-br from-[#9945FF] to-[#14F195] flex items-center justify-center">
            <Trophy className="w-10 h-10 text-white" />
          </div>
          <h2 className="text-3xl font-bold text-white">Connect Your Wallet</h2>
          <p className="text-gray-400">
            Please connect your wallet to take quizzes and earn skill badges.
          </p>
          <WalletButton className="mx-auto" />
        </motion.div>
      </div>
    );
  }

  if (quizState === 'setup') {
    return (
      <div className="min-h-screen bg-[#0f0f0f] pt-32 pb-20 px-6">
        <div className="max-w-2xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center mb-12"
          >
            <div className="w-20 h-20 mx-auto mb-6 rounded-full bg-gradient-to-br from-[#9945FF] to-[#14F195] flex items-center justify-center">
              <Trophy className="w-10 h-10 text-white" />
            </div>
            <h1 className="text-4xl font-bold text-white mb-4">Take a Quiz</h1>
            <p className="text-xl text-gray-400">
              Test your knowledge and earn skill badges
            </p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="p-8 rounded-xl bg-white/5 border border-white/10 space-y-6"
          >
            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-300">Quiz Topic</label>
              <input
                type="text"
                value={topic}
                onChange={(e) => setTopic(e.target.value)}
                placeholder="e.g., Blockchain Fundamentals, Smart Contracts..."
                className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:border-[#14F195]/50 transition-colors"
              />
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-300">Number of Questions</label>
              <select
                value={numQuestions}
                onChange={(e) => setNumQuestions(Number(e.target.value))}
                className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-lg text-white focus:outline-none focus:border-[#14F195]/50 transition-colors"
              >
                <option value={3}>3 Questions</option>
                <option value={5}>5 Questions</option>
                <option value={10}>10 Questions</option>
              </select>
            </div>

            <button
              onClick={handleGenerateQuiz}
              disabled={isLoading || !topic.trim()}
              className="w-full px-6 py-4 bg-[#14F195] hover:bg-[#14F195]/90 text-black font-bold rounded-lg transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
            >
              {isLoading ? (
                <>
                  <Loader2 className="w-5 h-5 animate-spin" />
                  Generating Quiz...
                </>
              ) : (
                <>
                  <Sparkles className="w-5 h-5" />
                  Generate Quiz
                </>
              )}
            </button>
          </motion.div>
        </div>
      </div>
    );
  }

  if (quizState === 'taking') {
    return (
      <div className="min-h-screen bg-[#0f0f0f] pt-32 pb-20 px-6">
        <div className="max-w-3xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-8"
          >
            <h1 className="text-3xl font-bold text-white mb-2">{topic}</h1>
            <p className="text-gray-400">
              Answer all questions and submit to see your results
            </p>
          </motion.div>

          <div className="space-y-6 mb-8">
            {quiz.map((question, index) => (
              <QuizCard
                key={index}
                question={question.question}
                options={question.options}
                selectedAnswer={userAnswers[index]}
                onSelectAnswer={(answer) => handleSelectAnswer(index, answer)}
                questionNumber={index + 1}
              />
            ))}
          </div>

          <motion.button
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            onClick={handleSubmitQuiz}
            disabled={userAnswers.some((answer) => !answer)}
            className="w-full px-6 py-4 bg-[#14F195] hover:bg-[#14F195]/90 text-black font-bold rounded-lg transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
          >
            Submit Quiz
          </motion.button>
        </div>
      </div>
    );
  }

  if (quizState === 'results' && results) {
    return (
      <div className="min-h-screen bg-[#0f0f0f] pt-32 pb-20 px-6">
        <div className="max-w-3xl mx-auto">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="text-center mb-12"
          >
            <div className="w-32 h-32 mx-auto mb-6 rounded-full bg-gradient-to-br from-[#9945FF] to-[#14F195] flex items-center justify-center">
              <Trophy className="w-16 h-16 text-white" />
            </div>
            <h1 className="text-4xl font-bold text-white mb-4">Quiz Complete!</h1>
            <div className="text-6xl font-bold text-[#14F195] mb-2">
              {results.percentage.toFixed(0)}%
            </div>
            <p className="text-xl text-gray-400">
              You got {results.score} out of {results.total} questions correct
            </p>
          </motion.div>

          <div className="space-y-6 mb-8">
            {results.results.map((result, index) => (
              <QuizCard
                key={index}
                question={result.question}
                options={quiz[index].options}
                selectedAnswer={result.user_answer}
                correctAnswer={result.correct_answer}
                showResult={true}
                questionNumber={index + 1}
              />
            ))}
          </div>

          <motion.button
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            onClick={handleRestart}
            className="w-full px-6 py-4 bg-white/10 hover:bg-white/20 text-white font-bold rounded-lg transition-all flex items-center justify-center gap-2"
          >
            <RotateCcw className="w-5 h-5" />
            Take Another Quiz
          </motion.button>
        </div>
      </div>
    );
  }

  return null;
};

export default Quiz;
