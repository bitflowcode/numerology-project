/**
 * Input Validation Middleware
 * Validates and sanitizes all user input to prevent injection attacks
 */

const VALID_TIPOS = [
  'vida',
  'alma',
  'personalidad',
  'expresion',
  'compatibilidad',
  'año',
  'maestros',
  'chat'
];

const VALID_NUMEROS = [1, 2, 3, 4, 5, 6, 7, 8, 9, 11, 22, 33];

/**
 * Sanitize string input
 */
function sanitizeString(str, maxLength = 100) {
  if (!str || typeof str !== 'string') return '';
  return str.trim().substring(0, maxLength);
}

/**
 * Validate date format (YYYY-MM-DD)
 */
function isValidDate(dateString) {
  if (!dateString || typeof dateString !== 'string') return false;
  const regex = /^\d{4}-\d{2}-\d{2}$/;
  if (!regex.test(dateString)) return false;

  const date = new Date(dateString);
  return date instanceof Date && !isNaN(date);
}

/**
 * Validate interpretation request
 */
export function validateInterpretRequest(req, res, next) {
  const { tipo, numero, datos } = req.body;

  // Validate tipo
  if (!tipo || !VALID_TIPOS.includes(tipo)) {
    return res.status(400).json({
      error: 'Tipo de interpretación inválido. Debe ser: vida, alma, personalidad, expresion, compatibilidad, año, maestros, o chat.'
    });
  }

  // Validate numero
  if (numero === undefined || numero === null || !VALID_NUMEROS.includes(Number(numero))) {
    return res.status(400).json({
      error: 'Número inválido. Debe ser un número del 1 al 9, o un número maestro (11, 22, 33).'
    });
  }

  // Validate datos object
  if (!datos || typeof datos !== 'object') {
    return res.status(400).json({
      error: 'Datos inválidos. Se requiere un objeto con información.'
    });
  }

  // Sanitize datos fields
  const sanitizedDatos = {};

  if (datos.nombre) {
    sanitizedDatos.nombre = sanitizeString(datos.nombre, 100);
    if (sanitizedDatos.nombre.length === 0) {
      return res.status(400).json({
        error: 'Nombre inválido.'
      });
    }
  }

  if (datos.fechaNacimiento) {
    if (!isValidDate(datos.fechaNacimiento)) {
      return res.status(400).json({
        error: 'Fecha de nacimiento inválida. Formato esperado: YYYY-MM-DD.'
      });
    }
    sanitizedDatos.fechaNacimiento = datos.fechaNacimiento;
  }

  if (datos.detalles) {
    sanitizedDatos.detalles = sanitizeString(datos.detalles, 500);
  }

  if (datos.numero1 !== undefined) {
    if (!VALID_NUMEROS.includes(Number(datos.numero1))) {
      return res.status(400).json({
        error: 'Número 1 de compatibilidad inválido.'
      });
    }
    sanitizedDatos.numero1 = Number(datos.numero1);
  }

  if (datos.numero2 !== undefined) {
    if (!VALID_NUMEROS.includes(Number(datos.numero2))) {
      return res.status(400).json({
        error: 'Número 2 de compatibilidad inválido.'
      });
    }
    sanitizedDatos.numero2 = Number(datos.numero2);
  }

  // Validación especial para compatibilidad
  if (tipo === 'compatibilidad') {
    // Validar que existan datos de ambas personas
    const requiredFields = ['nombre1', 'nombre2', 'fecha1', 'fecha2',
                            'vida1', 'vida2', 'alma1', 'alma2',
                            'expresion1', 'expresion2',
                            'compatibilidadVida', 'compatibilidadAlma', 'compatibilidadExpresion'];

    for (const field of requiredFields) {
      if (!datos[field]) {
        return res.status(400).json({
          error: `Campo requerido faltante para compatibilidad: ${field}`
        });
      }
    }

    // Sanitizar nombres
    sanitizedDatos.nombre1 = sanitizeString(datos.nombre1, 100);
    sanitizedDatos.nombre2 = sanitizeString(datos.nombre2, 100);

    // Validar fechas
    if (!isValidDate(datos.fecha1) || !isValidDate(datos.fecha2)) {
      return res.status(400).json({
        error: 'Fechas de nacimiento inválidas.'
      });
    }
    sanitizedDatos.fecha1 = datos.fecha1;
    sanitizedDatos.fecha2 = datos.fecha2;

    // Validar números (1-9, 11, 22, 33)
    const numeros = [datos.vida1, datos.vida2, datos.alma1, datos.alma2,
                     datos.expresion1, datos.expresion2];
    for (const num of numeros) {
      if (!VALID_NUMEROS.includes(Number(num))) {
        return res.status(400).json({
          error: 'Números de numerología inválidos.'
        });
      }
    }

    // Copiar números validados
    sanitizedDatos.vida1 = Number(datos.vida1);
    sanitizedDatos.vida2 = Number(datos.vida2);
    sanitizedDatos.alma1 = Number(datos.alma1);
    sanitizedDatos.alma2 = Number(datos.alma2);
    sanitizedDatos.expresion1 = Number(datos.expresion1);
    sanitizedDatos.expresion2 = Number(datos.expresion2);

    // Validar puntuaciones de compatibilidad (1-10)
    const compatibilidades = [datos.compatibilidadVida, datos.compatibilidadAlma, datos.compatibilidadExpresion];
    for (const comp of compatibilidades) {
      const compNum = Number(comp);
      if (isNaN(compNum) || compNum < 1 || compNum > 10) {
        return res.status(400).json({
          error: 'Puntuaciones de compatibilidad deben estar entre 1 y 10.'
        });
      }
    }

    sanitizedDatos.compatibilidadVida = Number(datos.compatibilidadVida);
    sanitizedDatos.compatibilidadAlma = Number(datos.compatibilidadAlma);
    sanitizedDatos.compatibilidadExpresion = Number(datos.compatibilidadExpresion);
  }

  // Update request with sanitized data
  req.body.datos = sanitizedDatos;
  req.body.numero = Number(numero);

  next();
}

/**
 * Validate chat request with conversation history
 */
export function validateChatRequest(req, res, next) {
  const { mensaje, conversationHistory } = req.body;

  // Validate mensaje
  if (!mensaje || typeof mensaje !== 'string') {
    return res.status(400).json({
      error: 'Mensaje inválido. Se requiere un mensaje de texto.'
    });
  }

  const sanitizedMensaje = sanitizeString(mensaje, 1000);
  if (sanitizedMensaje.length === 0) {
    return res.status(400).json({
      error: 'Mensaje vacío.'
    });
  }

  if (sanitizedMensaje.length > 1000) {
    return res.status(400).json({
      error: 'Mensaje demasiado largo. Máximo 1000 caracteres.'
    });
  }

  // Validate conversationHistory (optional array)
  let sanitizedHistory = [];
  if (conversationHistory) {
    if (!Array.isArray(conversationHistory)) {
      return res.status(400).json({
        error: 'Historial de conversación debe ser un array.'
      });
    }

    // Limit to last 10 messages for token management
    const recentHistory = conversationHistory.slice(-10);

    // Validate and sanitize each message
    sanitizedHistory = recentHistory
      .filter(msg => {
        // Must have role and content
        if (!msg || typeof msg !== 'object') return false;
        if (!msg.role || !msg.content) return false;
        if (msg.role !== 'user' && msg.role !== 'assistant') return false;
        if (typeof msg.content !== 'string') return false;
        return true;
      })
      .map(msg => ({
        role: msg.role,
        content: sanitizeString(msg.content, 2000),
        timestamp: msg.timestamp || Date.now()
      }));
  }

  // Update request with sanitized data
  req.body.mensaje = sanitizedMensaje;
  req.body.conversationHistory = sanitizedHistory;

  next();
}
