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
 * Calcula la compatibilidad entre dos números numerológicos
 * @param {number} numero1 - Primer número (1-9, 11, 22, 33)
 * @param {number} numero2 - Segundo número (1-9, 11, 22, 33)
 * @returns {Object} { compatibilidad, nivel, descripcion }
 * @example
 * calculateCompatibility(3, 6)
 * // => { compatibilidad: 9, nivel: "Excelente", descripcion: "..." }
 */
export const calculateCompatibility = (numero1, numero2) => {
  if (!numero1 || !numero2) return null;

  // Matriz de compatibilidad basada en principios numerológicos
  const compatibilityMatrix = {
    1: { 1: 7, 2: 6, 3: 9, 4: 5, 5: 8, 6: 6, 7: 7, 8: 8, 9: 7, 11: 8, 22: 7, 33: 6 },
    2: { 1: 6, 2: 8, 3: 7, 4: 9, 5: 6, 6: 10, 7: 7, 8: 9, 9: 8, 11: 9, 22: 8, 33: 10 },
    3: { 1: 9, 2: 7, 3: 8, 4: 6, 5: 10, 6: 9, 7: 8, 8: 7, 9: 9, 11: 9, 22: 8, 33: 9 },
    4: { 1: 5, 2: 9, 3: 6, 4: 7, 5: 5, 6: 8, 7: 9, 8: 10, 9: 6, 11: 7, 22: 10, 33: 8 },
    5: { 1: 8, 2: 6, 3: 10, 4: 5, 5: 7, 6: 6, 7: 9, 8: 6, 9: 8, 11: 8, 22: 7, 33: 7 },
    6: { 1: 6, 2: 10, 3: 9, 4: 8, 5: 6, 6: 9, 7: 7, 8: 8, 9: 10, 11: 9, 22: 8, 33: 10 },
    7: { 1: 7, 2: 7, 3: 8, 4: 9, 5: 9, 6: 7, 7: 8, 8: 7, 9: 9, 11: 10, 22: 9, 33: 8 },
    8: { 1: 8, 2: 9, 3: 7, 4: 10, 5: 6, 6: 8, 7: 7, 8: 9, 9: 7, 11: 8, 22: 10, 33: 8 },
    9: { 1: 7, 2: 8, 3: 9, 4: 6, 5: 8, 6: 10, 7: 9, 8: 7, 9: 8, 11: 9, 22: 8, 33: 10 },
    11: { 1: 8, 2: 9, 3: 9, 4: 7, 5: 8, 6: 9, 7: 10, 8: 8, 9: 9, 11: 10, 22: 9, 33: 10 },
    22: { 1: 7, 2: 8, 3: 8, 4: 10, 5: 7, 6: 8, 7: 9, 8: 10, 9: 8, 11: 9, 22: 9, 33: 9 },
    33: { 1: 6, 2: 10, 3: 9, 4: 8, 5: 7, 6: 10, 7: 8, 8: 8, 9: 10, 11: 10, 22: 9, 33: 10 }
  };

  const compatibilidad = compatibilityMatrix[numero1]?.[numero2] || 5;

  let nivel;
  let descripcion;

  if (compatibilidad >= 9) {
    nivel = 'Excelente';
    descripcion = 'Estos números se complementan perfectamente. Tienen una conexión natural y armoniosa que facilita la comprensión mutua y el crecimiento conjunto.';
  } else if (compatibilidad >= 7) {
    nivel = 'Alta';
    descripcion = 'Estos números tienen muy buena compatibilidad. Comparten valores y objetivos similares, lo que favorece una relación equilibrada y satisfactoria.';
  } else if (compatibilidad >= 4) {
    nivel = 'Media';
    descripcion = 'Estos números tienen compatibilidad moderada. Pueden funcionar bien juntos con esfuerzo y comprensión mutua, aunque pueden surgir algunos desafíos.';
  } else {
    nivel = 'Baja';
    descripcion = 'Estos números tienen diferencias significativas en su naturaleza. Se requiere trabajo consciente y compromiso para crear armonía en la relación.';
  }

  return { compatibilidad, nivel, descripcion };
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
