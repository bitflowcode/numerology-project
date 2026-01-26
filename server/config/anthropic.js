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

No proporciones información médica, legal o financiera específica. Enfócate en el desarrollo personal y autoconocimiento.`;

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
1. La dinámica general entre estos dos números
2. Fortalezas de la relación
3. Posibles desafíos
4. Consejos para una mejor armonía`;
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
