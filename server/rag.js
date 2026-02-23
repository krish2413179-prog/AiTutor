import { embeddingModel } from './geminiClient.js';
import { supabase } from './supabaseClient.js';

/**
 * Generate embedding for a given text using Gemini embedding-001
 * @param {string} text - The text to embed
 * @returns {Promise<number[]>} - The embedding vector
 */
export async function generateEmbedding(text) {
  try {
    console.log('Generating embedding for text length:', text?.length);
    const result = await embeddingModel.embedContent(text);
    console.log('Embedding generated successfully, dimension:', result.embedding.values.length);
    return result.embedding.values;
  } catch (error) {
    console.error('Error generating embedding - Full error:', error);
    console.error('Error message:', error.message);
    console.error('Error status:', error.status);
    console.error('Error details:', error.details);
    throw new Error(`Failed to generate embedding: ${error.message}`);
  }
}

/**
 * Retrieve relevant documents from Supabase using vector similarity search
 * @param {number[]} queryEmbedding - The query embedding vector
 * @param {number} matchThreshold - Similarity threshold (0-1)
 * @param {number} matchCount - Number of documents to retrieve
 * @param {string[]} allowedTopics - Optional array of topics to filter by
 * @returns {Promise<Array>} - Array of matching documents
 */
export async function retrieveDocuments(queryEmbedding, matchThreshold = 0.5, matchCount = 3, allowedTopics = null) {
  try {
    const { data, error } = await supabase.rpc('match_documents', {
      query_embedding: queryEmbedding,
      match_threshold: matchThreshold,
      match_count: matchCount
    });

    if (error) {
      console.error('Supabase RPC error:', error);
      throw new Error('Failed to retrieve documents from database');
    }

    let documents = data || [];

    // Filter by allowed topics if specified
    if (allowedTopics && allowedTopics.length > 0) {
      documents = documents.filter(doc => {
        const docTopic = doc.metadata?.topic;
        return docTopic && allowedTopics.includes(docTopic);
      });
    }

    return documents;
  } catch (error) {
    console.error('Error retrieving documents:', error);
    throw error;
  }
}

/**
 * Build context string from retrieved documents
 * @param {Array} documents - Array of document objects
 * @returns {string} - Combined context string
 */
export function buildContext(documents) {
  if (!documents || documents.length === 0) {
    return '';
  }

  return documents
    .map((doc, index) => `[Document ${index + 1}]\n${doc.content}`)
    .join('\n\n');
}

/**
 * Main RAG pipeline: generate embedding, retrieve documents, build context
 * @param {string} query - User query text
 * @param {number} matchThreshold - Similarity threshold
 * @param {number} matchCount - Number of documents to retrieve
 * @param {string[]} allowedTopics - Optional array of topics to filter by
 * @returns {Promise<{context: string, documents: Array}>}
 */
export async function ragPipeline(query, matchThreshold = 0.5, matchCount = 3, allowedTopics = null) {
  try {
    const embedding = await generateEmbedding(query);
    const documents = await retrieveDocuments(embedding, matchThreshold, matchCount, allowedTopics);
    const context = buildContext(documents);

    return { context, documents };
  } catch (error) {
    console.error('RAG pipeline error:', error);
    throw error;
  }
}
