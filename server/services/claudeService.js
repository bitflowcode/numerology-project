import anthropic, {
  MODEL_CONFIG,
  SYSTEM_PROMPT,
  buildInterpretationPrompt,
  buildChatPrompt
} from '../config/anthropic.js';

/**
 * Claude Service
 * Handles all interactions with the Claude API
 */

/**
 * Get numerology interpretation from Claude
 * @param {string} tipo - Type of interpretation
 * @param {object} datos - User data
 * @param {number} numero - Numerology number
 * @param {boolean} esMaestro - Is master number
 * @returns {Promise<object>} Interpretation response
 */
export async function getInterpretation(tipo, datos, numero, esMaestro = false) {
  try {
    // Build the prompt
    const prompt = buildInterpretationPrompt(tipo, datos, numero, esMaestro);

    // Call Claude API
    const response = await anthropic.messages.create({
      model: MODEL_CONFIG.model,
      max_tokens: MODEL_CONFIG.max_tokens,
      temperature: MODEL_CONFIG.temperature,
      system: SYSTEM_PROMPT,
      messages: [
        {
          role: 'user',
          content: prompt
        }
      ]
    });

    // Extract interpretation from response
    const interpretation = response.content[0].text;

    // Return structured response
    return {
      success: true,
      interpretation,
      metadata: {
        model: response.model,
        usage: {
          input_tokens: response.usage.input_tokens,
          output_tokens: response.usage.output_tokens
        }
      }
    };

  } catch (error) {
    console.error('Claude API Error:', {
      message: error.message,
      type: error.constructor.name,
      status: error.status
    });

    // Handle specific error types
    if (error.status === 401) {
      throw new Error('Error de autenticación con la API de Claude. Verifica tu clave API.');
    }

    if (error.status === 429) {
      throw new Error('Límite de solicitudes excedido. Por favor intenta de nuevo más tarde.');
    }

    if (error.status === 500 || error.status === 529) {
      throw new Error('El servicio de Claude está temporalmente no disponible. Por favor intenta de nuevo.');
    }

    // Generic error
    throw new Error('Error al obtener la interpretación. Por favor intenta de nuevo.');
  }
}

/**
 * Get chat response from Claude with conversation history
 * @param {string} mensaje - User message
 * @param {array} conversationHistory - Array of previous messages
 * @returns {Promise<object>} Chat response
 */
export async function getChatResponse(mensaje, conversationHistory = []) {
  try {
    // Build messages array for Claude API
    const messages = [];

    // Add last 10 messages from history (limit for token management)
    const recentHistory = conversationHistory.slice(-10);
    recentHistory.forEach(msg => {
      messages.push({
        role: msg.role === 'user' ? 'user' : 'assistant',
        content: msg.content
      });
    });

    // Add current message
    messages.push({
      role: 'user',
      content: mensaje
    });

    // Call Claude API with full conversation history
    const response = await anthropic.messages.create({
      model: MODEL_CONFIG.model,
      max_tokens: MODEL_CONFIG.max_tokens,
      temperature: MODEL_CONFIG.temperature,
      system: SYSTEM_PROMPT,
      messages: messages
    });

    // Extract response from Claude
    const responseText = response.content[0].text;

    // Return structured response
    return {
      success: true,
      response: responseText,
      metadata: {
        model: response.model,
        usage: {
          input_tokens: response.usage.input_tokens,
          output_tokens: response.usage.output_tokens
        }
      }
    };

  } catch (error) {
    console.error('Claude API Error:', {
      message: error.message,
      type: error.constructor.name,
      status: error.status
    });

    // Handle specific error types
    if (error.status === 401) {
      throw new Error('Error de autenticación con la API de Claude. Verifica tu clave API.');
    }

    if (error.status === 429) {
      throw new Error('Límite de solicitudes excedido. Por favor intenta de nuevo más tarde.');
    }

    if (error.status === 500 || error.status === 529) {
      throw new Error('El servicio de Claude está temporalmente no disponible. Por favor intenta de nuevo.');
    }

    // Generic error
    throw new Error('Error al obtener respuesta del chat. Por favor intenta de nuevo.');
  }
}
