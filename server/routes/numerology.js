import express from 'express';
import { getInterpretation, getChatResponse } from '../services/claudeService.js';
import { validateInterpretRequest, validateChatRequest } from '../middleware/validateInput.js';

const router = express.Router();

/**
 * POST /api/numerology/interpret
 * Get numerology interpretation from Claude
 */
router.post('/interpret', validateInterpretRequest, async (req, res, next) => {
  try {
    const { tipo, datos, numero, esMaestro = false } = req.body;

    // Get interpretation from Claude service
    const result = await getInterpretation(tipo, datos, numero, esMaestro);

    // Return successful response
    res.json({
      interpretation: result.interpretation,
      numero,
      esMaestro,
      tipo,
      metadata: result.metadata
    });

  } catch (error) {
    next(error);
  }
});

/**
 * POST /api/numerology/chat
 * Chat with Claude about numerology with conversation history
 */
router.post('/chat', validateChatRequest, async (req, res, next) => {
  try {
    const { mensaje, conversationHistory } = req.body;

    // Get chat response from Claude service
    const result = await getChatResponse(mensaje, conversationHistory);

    // Return successful response
    res.json({
      response: result.response,
      metadata: result.metadata
    });

  } catch (error) {
    next(error);
  }
});

export default router;
