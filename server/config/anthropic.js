import Anthropic from '@anthropic-ai/sdk';

/**
 * Claude API Configuration
 * Initializes Anthropic client and defines prompts for numerology interpretations
 */

// Initialize Anthropic client
const anthropic = new Anthropic({
  apiKey: process.env.ANTHROPIC_API_KEY,
});

// Model configuration
export const MODEL_CONFIG = {
  model: 'claude-sonnet-4-5-20250929',
  max_tokens: 1024,
  temperature: 0.7,
};

// System prompt that constrains AI behavior
export const SYSTEM_PROMPT = `Eres un experto numerólogo con profundo conocimiento en numerología pitagórica.
Tu rol es proporcionar interpretaciones detalladas, personalizadas y significativas de los números en español.

IMPORTANTE: SOLO respondes preguntas relacionadas con numerología. Si te hacen una pregunta sobre cualquier otro tema (política, ciencia, entretenimiento, tecnología, etc.), responde amablemente:

"Lo siento, soy un asistente especializado exclusivamente en numerología. Solo puedo ayudarte con consultas relacionadas con números de vida, compatibilidad, interpretaciones numerológicas y tu desarrollo personal a través de los números. ¿Tienes alguna pregunta sobre numerología?"

Características de tus respuestas:
- SIEMPRE responde en español
- Sé empático, cálido y profesional
- Proporciona interpretaciones profundas pero accesibles
- Usa ejemplos concretos cuando sea apropiado
- Mantén un tono positivo pero honesto
- Estructura tus respuestas de manera clara y organizada
- Para números maestros (11, 22, 33), enfatiza su significado especial

Tipos de números que interpretas:
- Número de Vida: El propósito de vida y camino principal
- Número de Alma: Los deseos internos y motivaciones profundas
- Número de Personalidad: Cómo te perciben los demás
- Número de Expresión: Talentos naturales y habilidades
- Número de Compatibilidad: Dinámica entre dos personas
- Número de Año Personal: Energía y temas del año actual
- Números Maestros: Potencial espiritual elevado

No proporciones información médica, legal o financiera específica. Enfócate en el desarrollo personal y autoconocimiento a través de la numerología.`;

/**
 * Build prompt for numerology interpretation
 */
export function buildInterpretationPrompt(tipo, datos, numero, esMaestro) {
  const tipoDescripciones = {
    vida: 'Número de Vida',
    alma: 'Número del Alma',
    personalidad: 'Número de Personalidad',
    expresion: 'Número de Expresión',
    compatibilidad: 'Compatibilidad Numerológica',
    año: 'Número de Año Personal',
    maestros: 'Número Maestro'
  };

  const tipoNombre = tipoDescripciones[tipo] || tipo;
  let prompt = `Proporciona una interpretación detallada y personalizada para:\n\n`;
  prompt += `Tipo: ${tipoNombre}\n`;
  prompt += `Número: ${numero}${esMaestro ? ' (Número Maestro)' : ''}\n\n`;

  if (datos.nombre) {
    prompt += `Nombre: ${datos.nombre}\n`;
  }
  if (datos.fechaNacimiento) {
    prompt += `Fecha de Nacimiento: ${datos.fechaNacimiento}\n`;
  }
  if (datos.detalles) {
    prompt += `Cálculo: ${datos.detalles}\n`;
  }
  if (datos.numero1 && datos.numero2) {
    prompt += `Números a comparar: ${datos.numero1} y ${datos.numero2}\n`;
  }

  prompt += `\nProporciona una interpretación profunda y significativa que incluya:`;

  if (tipo === 'maestros') {
    prompt += `
1. El significado espiritual especial de este número maestro
2. Los desafíos únicos que presenta
3. El potencial elevado que ofrece
4. Consejos prácticos para trabajar con esta energía
5. Cómo equilibrar la vibración maestra con la vida cotidiana`;
  } else if (tipo === 'compatibilidad') {
    prompt += `

Analiza la compatibilidad entre:
- ${datos.nombre1} (Vida: ${datos.vida1}, Alma: ${datos.alma1}, Expresión: ${datos.expresion1})
- ${datos.nombre2} (Vida: ${datos.vida2}, Alma: ${datos.alma2}, Expresión: ${datos.expresion2})

Nivel de compatibilidad general: ${numero}/10

Compatibilidad por aspectos:
- Camino de Vida: ${datos.compatibilidadVida}/10
- Conexión del Alma: ${datos.compatibilidadAlma}/10
- Expresión: ${datos.compatibilidadExpresion}/10

Proporciona un análisis empático y constructivo que incluya:
1. Fortalezas de la relación (qué los une)
2. Áreas de crecimiento (desafíos potenciales)
3. Consejos prácticos para cultivar armonía
4. Aspectos únicos de esta combinación numerológica

IMPORTANTE:
- Menciona ambos nombres naturalmente en el análisis
- Mantén un tono positivo y constructivo
- Máximo 350 palabras
- Enfócate en el crecimiento mutuo y la comprensión`;
  } else if (tipo === 'año') {
    prompt += `
1. La energía general de este año personal
2. Áreas de enfoque principales
3. Oportunidades que se presentan
4. Desafíos a considerar
5. Consejos prácticos para aprovechar el año`;
  } else {
    prompt += `
1. Características principales de este número
2. Fortalezas y talentos asociados
3. Desafíos o áreas de crecimiento
4. Consejos prácticos para desarrollo personal`;
  }

  return prompt;
}

/**
 * Build prompt for chat interaction with conversation history
 */
export function buildChatPrompt(mensaje, conversationHistory = []) {
  // No longer needed - we'll use Claude's Messages API with full history
  // This function is kept for compatibility but won't be used
  return mensaje;
}

export default anthropic;
