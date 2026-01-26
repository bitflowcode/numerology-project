/**
 * Reduce un número a un solo dígito (excepto números maestros 11, 22, 33)
 * @param {number} num - Número a reducir
 * @param {boolean} keepMasterNumbers - Si es true, conserva los números maestros (11, 22, 33)
 * @returns {number} Número reducido a un solo dígito o número maestro
 * @example
 * reduceToSingleDigit(38) // => 2 (3+8=11, 1+1=2)
 * reduceToSingleDigit(29) // => 11 (2+9=11, se conserva)
 */
export const reduceToSingleDigit = (num, keepMasterNumbers = true) => {
  while (num > 9) {
    if (keepMasterNumbers && (num === 11 || num === 22 || num === 33)) {
      return num;
    }
    num = String(num).split('').reduce((sum, digit) => sum + parseInt(digit), 0);
  }
  return num;
};

/**
 * Convierte letras a números según la numerología pitagórica
 */
const letterToNumber = {
  A: 1, B: 2, C: 3, D: 4, E: 5, F: 6, G: 7, H: 8, I: 9,
  J: 1, K: 2, L: 3, M: 4, N: 5, O: 6, P: 7, Q: 8, R: 9,
  S: 1, T: 2, U: 3, V: 4, W: 5, X: 6, Y: 7, Z: 8
};

/**
 * Vocales para el número del alma
 */
const vowels = ['A', 'E', 'I', 'O', 'U'];

/**
 * Normaliza texto eliminando acentos y caracteres especiales
 * @param {string} text - Texto a normalizar
 * @returns {string} Texto normalizado en mayúsculas sin acentos
 * @example
 * normalizeText("José María") // => "JOSE MARIA"
 * normalizeText("Sofía Ángel") // => "SOFIA ANGEL"
 */
export const normalizeText = (text) => {
  if (!text) return '';

  return text
    .normalize('NFD') // Descompone caracteres con acentos
    .replace(/[\u0300-\u036f]/g, '') // Elimina diacríticos
    .toUpperCase() // Convierte a mayúsculas
    .replace(/[^A-Z]/g, ''); // Elimina caracteres no alfabéticos
};

/**
 * Calcula el número del camino de vida desde la fecha de nacimiento
 * @param {string} birthDate - Fecha en formato YYYY-MM-DD
 * @returns {Object} { numero, esMaestro, detalles }
 * @example
 * calculateLifePath('1990-05-15')
 * // => { numero: 3, esMaestro: false, detalles: "Día: 15→6, Mes: 5→5, Año: 1990→1, Total: 6+5+1=12→3" }
 */
export const calculateLifePath = (birthDate) => {
  if (!birthDate) return null;

  const [year, month, day] = birthDate.split('-').map(Number);

  const dayReduced = reduceToSingleDigit(day);
  const monthReduced = reduceToSingleDigit(month);
  const yearReduced = reduceToSingleDigit(year);

  const total = dayReduced + monthReduced + yearReduced;
  const numero = reduceToSingleDigit(total);
  const esMaestro = numero === 11 || numero === 22 || numero === 33;

  let detalles = `Día: ${day}`;
  if (day !== dayReduced) detalles += `→${dayReduced}`;
  detalles += `, Mes: ${month}`;
  if (month !== monthReduced) detalles += `→${monthReduced}`;
  detalles += `, Año: ${year}`;
  if (year !== yearReduced) detalles += `→${yearReduced}`;
  detalles += `, Total: ${dayReduced}+${monthReduced}+${yearReduced}=${total}`;
  if (total !== numero) detalles += `→${numero}`;

  return { numero, esMaestro, detalles };
};

/**
 * Calcula el número de expresión/destino desde el nombre completo
 * @param {string} fullName - Nombre completo
 * @returns {Object} { numero, esMaestro, detalles }
 * @example
 * calculateExpression('José María')
 * // => { numero: 7, esMaestro: false, detalles: "JOSEMARIA → Total: 34 → 3+4 = 7" }
 */
export const calculateExpression = (fullName) => {
  if (!fullName) return null;

  const cleanName = normalizeText(fullName);
  const total = cleanName.split('').reduce((sum, letter) => {
    return sum + (letterToNumber[letter] || 0);
  }, 0);

  const numero = reduceToSingleDigit(total);
  const esMaestro = numero === 11 || numero === 22 || numero === 33;

  let detalles = `${cleanName} → Total: ${total}`;
  if (total !== numero) {
    detalles += ` → ${String(total).split('').join('+')} = ${numero}`;
  }

  return { numero, esMaestro, detalles };
};

/**
 * Calcula el número del alma (impulso del alma) desde las vocales del nombre
 * @param {string} fullName - Nombre completo
 * @returns {Object} { numero, esMaestro, detalles }
 * @example
 * calculateSoulUrge('Sofía')
 * // => { numero: 6, esMaestro: false, detalles: "Vocales: OIA → Total: 15 → 1+5 = 6" }
 */
export const calculateSoulUrge = (fullName) => {
  if (!fullName) return null;

  const cleanName = normalizeText(fullName);
  const vowelsOnly = cleanName.split('').filter(letter => vowels.includes(letter)).join('');
  const total = cleanName.split('').reduce((sum, letter) => {
    if (vowels.includes(letter)) {
      return sum + (letterToNumber[letter] || 0);
    }
    return sum;
  }, 0);

  const numero = reduceToSingleDigit(total);
  const esMaestro = numero === 11 || numero === 22 || numero === 33;

  let detalles = `Vocales: ${vowelsOnly} → Total: ${total}`;
  if (total !== numero) {
    detalles += ` → ${String(total).split('').join('+')} = ${numero}`;
  }

  return { numero, esMaestro, detalles };
};

/**
 * Calcula el número de personalidad desde las consonantes del nombre
 * @param {string} fullName - Nombre completo
 * @returns {Object} { numero, esMaestro, detalles }
 * @example
 * calculatePersonality('José María')
 * // => { numero: 9, esMaestro: false, detalles: "Consonantes: JSMR → Total: 27 → 2+7 = 9" }
 */
export const calculatePersonality = (fullName) => {
  if (!fullName) return null;

  const cleanName = normalizeText(fullName);
  const consonantsOnly = cleanName.split('').filter(letter => !vowels.includes(letter)).join('');
  const total = cleanName.split('').reduce((sum, letter) => {
    if (!vowels.includes(letter)) {
      return sum + (letterToNumber[letter] || 0);
    }
    return sum;
  }, 0);

  const numero = reduceToSingleDigit(total);
  const esMaestro = numero === 11 || numero === 22 || numero === 33;

  let detalles = `Consonantes: ${consonantsOnly} → Total: ${total}`;
  if (total !== numero) {
    detalles += ` → ${String(total).split('').join('+')} = ${numero}`;
  }

  return { numero, esMaestro, detalles };
};

/**
 * Calcula el número de madurez (Camino de Vida + Expresión)
 * @param {string} birthDate - Fecha de nacimiento en formato YYYY-MM-DD
 * @param {string} fullName - Nombre completo
 * @returns {number} Número de madurez reducido
 * @example
 * calculateMaturity('1990-05-15', 'Ana García')
 * // => 5 (número de madurez)
 */
export const calculateMaturity = (birthDate, fullName) => {
  const lifePath = calculateLifePath(birthDate);
  const expression = calculateExpression(fullName);

  if (!lifePath || !expression) return null;

  return reduceToSingleDigit(lifePath + expression);
};

/**
 * Calcula el número del día de nacimiento
 * @param {string} birthDate - Fecha de nacimiento en formato YYYY-MM-DD
 * @returns {number} Número del día de nacimiento reducido (no conserva números maestros)
 * @example
 * calculateBirthDay('1990-05-15') // => 6 (1+5=6)
 * calculateBirthDay('1990-11-29') // => 2 (2+9=11, 1+1=2)
 */
export const calculateBirthDay = (birthDate) => {
  if (!birthDate) return null;

  const day = parseInt(birthDate.split('-')[2]);
  return reduceToSingleDigit(day, false);
};

/**
 * Calcula el año personal
 * @param {string} birthDate - Fecha de nacimiento en formato YYYY-MM-DD
 * @returns {number} Número del año personal basado en el año actual
 * @example
 * calculatePersonalYear('1990-05-15')
 * // => 7 (calculado con el año actual)
 */
export const calculatePersonalYear = (birthDate) => {
  if (!birthDate) return null;

  const currentYear = new Date().getFullYear();
  const [, month, day] = birthDate.split('-').map(Number);

  const total = reduceToSingleDigit(day) + reduceToSingleDigit(month) + reduceToSingleDigit(currentYear);
  return reduceToSingleDigit(total);
};

/**
 * Matriz de compatibilidad numerológica (1-10)
 * Basada en numerología pitagórica tradicional
 */
const compatibilityMatrix = {
  // Número 1
  '1-1': 7, '1-2': 8, '1-3': 6, '1-4': 5, '1-5': 9,
  '1-6': 7, '1-7': 6, '1-8': 8, '1-9': 7, '1-11': 8,
  '1-22': 6, '1-33': 7,

  // Número 2
  '2-2': 9, '2-3': 7, '2-4': 8, '2-5': 6, '2-6': 9,
  '2-7': 7, '2-8': 8, '2-9': 8, '2-11': 10, '2-22': 7,
  '2-33': 8,

  // Número 3
  '3-3': 8, '3-4': 5, '3-5': 9, '3-6': 8, '3-7': 6,
  '3-8': 7, '3-9': 9, '3-11': 8, '3-22': 6, '3-33': 9,

  // Número 4
  '4-4': 7, '4-5': 5, '4-6': 8, '4-7': 7, '4-8': 9,
  '4-9': 6, '4-11': 7, '4-22': 9, '4-33': 7,

  // Número 5
  '5-5': 8, '5-6': 6, '5-7': 8, '5-8': 7, '5-9': 8,
  '5-11': 7, '5-22': 6, '5-33': 8,

  // Número 6
  '6-6': 9, '6-7': 7, '6-8': 8, '6-9': 9, '6-11': 8,
  '6-22': 7, '6-33': 10,

  // Número 7
  '7-7': 8, '7-8': 6, '7-9': 8, '7-11': 9, '7-22': 8,
  '7-33': 8,

  // Número 8
  '8-8': 9, '8-9': 7, '8-11': 7, '8-22': 9, '8-33': 7,

  // Número 9
  '9-9': 8, '9-11': 8, '9-22': 7, '9-33': 9,

  // Números Maestros entre sí
  '11-11': 10, '11-22': 9, '11-33': 9,
  '22-22': 9, '22-33': 8,
  '33-33': 10
};

/**
 * Calcula la compatibilidad entre dos números
 * @param {number} numero1 - Primer número (1-9, 11, 22, 33)
 * @param {number} numero2 - Segundo número (1-9, 11, 22, 33)
 * @returns {number} Puntuación de compatibilidad (1-10)
 */
export const calculateCompatibility = (numero1, numero2) => {
  const key = `${Math.min(numero1, numero2)}-${Math.max(numero1, numero2)}`;
  return compatibilityMatrix[key] || 5; // Default 5 si no existe
};

/**
 * Calcula compatibilidad completa entre dos personas
 * @param {Object} persona1 - { nombre, fechaNacimiento }
 * @param {Object} persona2 - { nombre, fechaNacimiento }
 * @returns {Object} Objeto con toda la información de compatibilidad
 */
export const calculateFullCompatibility = (persona1, persona2) => {
  // Calcular números de ambas personas
  const vida1 = calculateLifePath(persona1.fechaNacimiento);
  const alma1 = calculateSoulUrge(persona1.nombre);
  const expresion1 = calculateExpression(persona1.nombre);

  const vida2 = calculateLifePath(persona2.fechaNacimiento);
  const alma2 = calculateSoulUrge(persona2.nombre);
  const expresion2 = calculateExpression(persona2.nombre);

  // Calcular compatibilidades individuales
  const compatibilidadVida = calculateCompatibility(vida1.numero, vida2.numero);
  const compatibilidadAlma = calculateCompatibility(alma1.numero, alma2.numero);
  const compatibilidadExpresion = calculateCompatibility(expresion1.numero, expresion2.numero);

  // Compatibilidad promedio ponderada
  // Vida 40%, Alma 35%, Expresión 25%
  const compatibilidadGeneral = Math.round(
    (compatibilidadVida * 0.4) +
    (compatibilidadAlma * 0.35) +
    (compatibilidadExpresion * 0.25)
  );

  return {
    compatibilidadGeneral,
    persona1: {
      nombre: persona1.nombre,
      vida: vida1.numero,
      alma: alma1.numero,
      expresion: expresion1.numero
    },
    persona2: {
      nombre: persona2.nombre,
      vida: vida2.numero,
      alma: alma2.numero,
      expresion: expresion2.numero
    },
    detalles: {
      vida: compatibilidadVida,
      alma: compatibilidadAlma,
      expresion: compatibilidadExpresion
    }
  };
};

/**
 * Calcula los números kármicos (basado en letras faltantes en el nombre)
 * @param {string} fullName - Nombre completo
 * @returns {Array<number>} Array de números del 1-9 que no están representados en el nombre
 * @example
 * calculateKarmicDebt('Ana García')
 * // => [2, 5, 7, 8, 9] (números no presentes en el nombre)
 */
export const calculateKarmicDebt = (fullName) => {
  if (!fullName) return [];

  const cleanName = normalizeText(fullName);
  const presentNumbers = new Set();

  cleanName.split('').forEach(letter => {
    if (letterToNumber[letter]) {
      presentNumbers.add(letterToNumber[letter]);
    }
  });

  const missingNumbers = [];
  for (let i = 1; i <= 9; i++) {
    if (!presentNumbers.has(i)) {
      missingNumbers.push(i);
    }
  }

  return missingNumbers;
};

/**
 * Detecta todos los números maestros (11, 22, 33) en los cálculos principales
 * @param {string} birthDate - Fecha de nacimiento en formato YYYY-MM-DD
 * @param {string} fullName - Nombre completo
 * @returns {Array} Array de objetos { tipo, numero } con los números maestros encontrados
 * @example
 * detectMasterNumbers('1990-11-29', 'José María')
 * // => [{ tipo: "Camino de Vida", numero: 11 }]
 */
export const detectMasterNumbers = (birthDate, fullName) => {
  const masterNumbers = [];

  if (birthDate) {
    const lifePath = calculateLifePath(birthDate);
    if (lifePath && lifePath.esMaestro) {
      masterNumbers.push({ tipo: 'Camino de Vida', numero: lifePath.numero });
    }
  }

  if (fullName) {
    const expression = calculateExpression(fullName);
    if (expression && expression.esMaestro) {
      masterNumbers.push({ tipo: 'Expresión', numero: expression.numero });
    }

    const soulUrge = calculateSoulUrge(fullName);
    if (soulUrge && soulUrge.esMaestro) {
      masterNumbers.push({ tipo: 'Alma', numero: soulUrge.numero });
    }

    const personality = calculatePersonality(fullName);
    if (personality && personality.esMaestro) {
      masterNumbers.push({ tipo: 'Personalidad', numero: personality.numero });
    }
  }

  return masterNumbers;
};

/**
 * Significados de los números del camino de vida
 */
export const lifePathMeanings = {
  1: { title: 'El Líder', description: 'Independencia, originalidad, ambición y determinación.' },
  2: { title: 'El Diplomático', description: 'Cooperación, equilibrio, sensibilidad y armonía.' },
  3: { title: 'El Creativo', description: 'Expresión, creatividad, comunicación y optimismo.' },
  4: { title: 'El Constructor', description: 'Estabilidad, trabajo duro, practicidad y orden.' },
  5: { title: 'El Aventurero', description: 'Libertad, cambio, versatilidad y curiosidad.' },
  6: { title: 'El Cuidador', description: 'Responsabilidad, amor, familia y servicio.' },
  7: { title: 'El Buscador', description: 'Sabiduría, introspección, espiritualidad y análisis.' },
  8: { title: 'El Poderoso', description: 'Éxito, autoridad, abundancia y logros materiales.' },
  9: { title: 'El Humanitario', description: 'Compasión, altruismo, sabiduría universal y finalización.' },
  11: { title: 'El Iluminado', description: 'Intuición elevada, inspiración espiritual y visión.' },
  22: { title: 'El Constructor Maestro', description: 'Poder para manifestar grandes sueños en realidad.' },
  33: { title: 'El Maestro Sanador', description: 'Amor incondicional, servicio elevado y guía espiritual.' }
};
