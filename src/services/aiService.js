import { MAKE_WEBHOOK_URL } from '../config/solana';
import { getRecentMessages, saveMessage } from './supabaseService';

export async function sendMessageToAI(walletAddress, userMessage, systemPrompt) {
  try {
    const recentMessages = await getRecentMessages(walletAddress, 10);
    await saveMessage(walletAddress, 'user', userMessage);

    // Check if webhook URL is configured
    if (!MAKE_WEBHOOK_URL || MAKE_WEBHOOK_URL === 'YOUR_MAKE_WEBHOOK_URL') {
      throw new Error('Make.com webhook URL not configured. Please add VITE_MAKE_WEBHOOK_URL to your .env file.');
    }

    const response = await fetch(MAKE_WEBHOOK_URL, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        wallet_address: walletAddress,
        system_prompt: systemPrompt,
        conversation_history: recentMessages,
        new_message: userMessage,
        timestamp: new Date().toISOString()
      })
    });

    if (!response.ok) {
      throw new Error(`Webhook returned ${response.status}: ${response.statusText}`);
    }

    // Check content type
    const contentType = response.headers.get('content-type');
    let data;

    if (contentType && contentType.includes('application/json')) {
      // Try to parse JSON
      const responseText = await response.text();
      try {
        data = JSON.parse(responseText);
      } catch (parseError) {
        console.error('Failed to parse JSON response');
        console.error('Response text:', responseText.substring(0, 200));
        
        // Try to extract reply using regex as fallback
        const replyMatch = responseText.match(/"reply"\s*:\s*"((?:[^"\\]|\\.)*)"/s);
        if (replyMatch && replyMatch[1]) {
          data = { reply: replyMatch[1].replace(/\\n/g, '\n').replace(/\\"/g, '"') };
        } else {
          throw new Error('Invalid JSON response from webhook.');
        }
      }
    } else {
      // Plain text response
      const textResponse = await response.text();
      data = { reply: textResponse };
    }

    // Check if response has the expected format
    if (!data.response && !data.reply) {
      throw new Error('Webhook response missing "response" or "reply" field. Check your Make.com scenario.');
    }

    // Support both "response" and "reply" field names
    const aiResponse = data.response || data.reply;
    
    await saveMessage(walletAddress, 'assistant', aiResponse);

    return {
      success: true,
      response: aiResponse,
      metadata: data.metadata || {}
    };
  } catch (error) {
    console.error('Error communicating with AI:', error);
    throw error;
  }
}
