/**
 * Numerology API Service
 * Handles communication with the backend API
 */

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3001/api';

/**
 * Get numerology interpretation from backend
 * @param {string} tipo - Type of interpretation
 * @param {object} datos - User data
 * @param {number} numero - Numerology number
 * @param {boolean} esMaestro - Is master number
 * @returns {Promise<object>} Interpretation response
 */
export async function getInterpretation(tipo, datos, numero, esMaestro = false) {
  try {
    const response = await fetch(`${API_URL}/numerology/interpret`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        tipo,
        datos,
        numero,
        esMaestro
      })
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.error || 'Error al obtener la interpretación');
    }

    return await response.json();
  } catch (error) {
    console.error('API Error:', error);
    throw error;
  }
}

/**
 * Send chat message to backend with conversation history
 * @param {string} mensaje - User message
 * @param {array} conversationHistory - Array of previous messages
 * @returns {Promise<object>} Chat response
 */
export async function sendChatMessage(mensaje, conversationHistory = []) {
  try {
    const response = await fetch(`${API_URL}/numerology/chat`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        mensaje,
        conversationHistory
      })
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.error || 'Error al enviar el mensaje');
    }

    return await response.json();
  } catch (error) {
    console.error('API Error:', error);
    throw error;
  }
}

/**
 * Check backend health
 * @returns {Promise<object>} Health status
 */
export async function checkHealth() {
  try {
    const response = await fetch(`${API_URL}/health`);

    if (!response.ok) {
      throw new Error('Backend no está disponible');
    }

    return await response.json();
  } catch (error) {
    console.error('Health Check Error:', error);
    throw error;
  }
}
