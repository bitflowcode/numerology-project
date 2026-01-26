import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Sparkles, Heart, User, Target, Users, Calendar, Star, MessageCircle } from 'lucide-react';
import {
  calculateLifePath,
  calculateExpression,
  calculateSoulUrge,
  calculatePersonality,
  calculatePersonalYear,
  detectMasterNumbers,
  lifePathMeanings
} from '../utils/numerologyCalculations';
import { getInterpretation } from '../services/numerologyApi';

const NumerologyCards = () => {
  const navigate = useNavigate();
  const [selectedCard, setSelectedCard] = useState(null);
  // Pre-llenar con fecha actual para mejor UX en móvil
  const today = new Date().toISOString().split('T')[0];
  const [birthDate, setBirthDate] = useState(today);
  const [fullName, setFullName] = useState('');
  const [result, setResult] = useState(null);
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleCardSelect = (card) => {
    // If chat card, navigate to dedicated page
    if (card.id === 'chat') {
      navigate('/chat');
      return;
    }

    setSelectedCard(card);
    // Resetear estados al abrir nuevo modal
    const today = new Date().toISOString().split('T')[0];
    setBirthDate(today);
    setFullName('');
    setResult(null);
    setError('');
  };

  const cards = [
    {
      id: 'vida',
      title: 'Número de Vida',
      subtitle: 'Tu camino y destino',
      description: 'Descubre tu propósito basado en tu fecha de nacimiento',
      icon: Target,
      color: 'from-purple-500 to-pink-500',
      gradient: 'bg-gradient-to-br from-purple-50 to-pink-50',
      iconBg: 'bg-gradient-to-br from-purple-500 to-pink-500',
      input: 'Fecha de nacimiento',
      emoji: '🎯'
    },
    {
      id: 'alma',
      title: 'Número del Alma',
      subtitle: 'Tus deseos profundos',
      description: 'Revela tus motivaciones y sensibilidad interna',
      icon: Heart,
      color: 'from-rose-500 to-red-500',
      gradient: 'bg-gradient-to-br from-rose-50 to-red-50',
      iconBg: 'bg-gradient-to-br from-rose-500 to-red-500',
      input: 'Nombre completo',
      emoji: '❤️'
    },
    {
      id: 'personalidad',
      title: 'Número de Personalidad',
      subtitle: 'Tu imagen externa',
      description: 'Cómo te perciben los demás',
      icon: User,
      color: 'from-blue-500 to-cyan-500',
      gradient: 'bg-gradient-to-br from-blue-50 to-cyan-50',
      iconBg: 'bg-gradient-to-br from-blue-500 to-cyan-500',
      input: 'Nombre completo',
      emoji: '👤'
    },
    {
      id: 'expresion',
      title: 'Número de Expresión',
      subtitle: 'Tu potencial completo',
      description: 'Tu destino y talentos naturales',
      icon: Sparkles,
      color: 'from-amber-500 to-orange-500',
      gradient: 'bg-gradient-to-br from-amber-50 to-orange-50',
      iconBg: 'bg-gradient-to-br from-amber-500 to-orange-500',
      input: 'Nombre completo',
      emoji: '✨'
    },
    {
      id: 'compatibilidad',
      title: 'Compatibilidad',
      subtitle: 'Conexión entre dos personas',
      description: 'Analiza la armonía numerológica',
      icon: Users,
      color: 'from-green-500 to-emerald-500',
      gradient: 'bg-gradient-to-br from-green-50 to-emerald-50',
      iconBg: 'bg-gradient-to-br from-green-500 to-emerald-500',
      input: 'Dos nombres o fechas',
      emoji: '👥'
    },
    {
      id: 'año',
      title: 'Año Personal',
      subtitle: 'Tu energía este año',
      description: 'Predicciones para el año en curso',
      icon: Calendar,
      color: 'from-indigo-500 to-purple-500',
      gradient: 'bg-gradient-to-br from-indigo-50 to-purple-50',
      iconBg: 'bg-gradient-to-br from-indigo-500 to-purple-500',
      input: 'Fecha de nacimiento',
      emoji: '📅'
    },
    {
      id: 'maestros',
      title: 'Números Maestros',
      subtitle: '11, 22, 33',
      description: 'Descubre si tienes números especiales',
      icon: Star,
      color: 'from-yellow-500 to-amber-500',
      gradient: 'bg-gradient-to-br from-yellow-50 to-amber-50',
      iconBg: 'bg-gradient-to-br from-yellow-500 to-amber-500',
      input: 'Nombre y fecha',
      emoji: '⭐'
    },
    {
      id: 'chat',
      title: 'Chat con IA',
      subtitle: 'Conversación libre',
      description: 'Pregunta lo que quieras sobre numerología',
      icon: MessageCircle,
      color: 'from-teal-500 to-cyan-500',
      gradient: 'bg-gradient-to-br from-teal-50 to-cyan-50',
      iconBg: 'bg-gradient-to-br from-teal-500 to-cyan-500',
      input: 'Chat conversacional',
      emoji: '💬'
    }
  ];

  // Función para convertir markdown simple a HTML
  const renderMarkdown = (text) => {
    if (!text) return '';

    // Helper para limpiar asteriscos de bold en cualquier texto
    const cleanBold = (str) => str.replace(/\*\*(.+?)\*\*/g, '$1');

    // Split por líneas para procesar
    const lines = text.split('\n');
    let html = '';
    let inList = false;

    lines.forEach((line) => {
      // Encabezados H3 (###)
      if (line.startsWith('### ')) {
        if (inList) { html += '</ul>'; inList = false; }
        const content = cleanBold(line.slice(4));
        html += `<h3 class="text-lg font-bold text-gray-800 mt-4 mb-2">${content}</h3>`;
      }
      // Encabezados H2 (##)
      else if (line.startsWith('## ')) {
        if (inList) { html += '</ul>'; inList = false; }
        const content = cleanBold(line.slice(3));
        html += `<h2 class="text-xl font-bold text-gray-800 mt-5 mb-2">${content}</h2>`;
      }
      // Encabezados H1 (#)
      else if (line.startsWith('# ')) {
        if (inList) { html += '</ul>'; inList = false; }
        const content = cleanBold(line.slice(2));
        html += `<h1 class="text-2xl font-bold text-gray-800 mt-5 mb-3">${content}</h1>`;
      }
      // Separadores (---)
      else if (line.trim() === '---') {
        if (inList) { html += '</ul>'; inList = false; }
        html += '<hr class="my-3 border-gray-300" />';
      }
      // Listas con viñetas (- texto)
      else if (line.startsWith('- ')) {
        if (!inList) {
          html += '<ul class="list-disc list-inside mb-3 text-gray-700 ml-4">';
          inList = true;
        }
        const content = line.slice(2).replace(/\*\*(.+?)\*\*/g, '<strong class="font-bold">$1</strong>');
        html += `<li class="mb-1">${content}</li>`;
      }
      // Líneas vacías
      else if (line.trim() === '') {
        if (inList) { html += '</ul>'; inList = false; }
        html += '<br/>';
      }
      // Texto normal
      else {
        if (inList) { html += '</ul>'; inList = false; }
        const content = line.replace(/\*\*(.+?)\*\*/g, '<strong class="font-bold">$1</strong>');
        html += `<p class="mb-2 text-gray-700">${content}</p>`;
      }
    });

    // Cerrar lista si quedó abierta
    if (inList) html += '</ul>';

    return `<div class="text-left leading-relaxed">${html}</div>`;
  };

  const handleCalculate = async () => {
    try {
      // 1. Reset estados
      setError(null);
      setResult(null);
      setIsLoading(true);

      console.log('🔢 Iniciando cálculo para:', selectedCard.id);

      // 2. Validación de inputs
      if (selectedCard.id === 'vida' || selectedCard.id === 'año') {
        if (!birthDate) {
          setError('Por favor ingresa tu fecha de nacimiento');
          setIsLoading(false);
          return;
        }
      }

      if (selectedCard.id === 'alma' || selectedCard.id === 'personalidad' || selectedCard.id === 'expresion') {
        if (!fullName || fullName.trim().length < 2) {
          setError('Por favor ingresa tu nombre completo (mínimo 2 caracteres)');
          setIsLoading(false);
          return;
        }
      }

      if (selectedCard.id === 'maestros') {
        if (!birthDate || !fullName || fullName.trim().length < 2) {
          setError('Por favor ingresa tu nombre completo y fecha de nacimiento');
          setIsLoading(false);
          return;
        }
      }

      // 3. Cálculo local del número (mantener funciones existentes)
      let calculatedResult;

      switch (selectedCard.id) {
        case 'vida':
          calculatedResult = calculateLifePath(birthDate);
          console.log('✅ Número de Vida calculado:', calculatedResult);
          break;

        case 'alma':
          calculatedResult = calculateSoulUrge(fullName);
          console.log('✅ Número del Alma calculado:', calculatedResult);
          break;

        case 'personalidad':
          calculatedResult = calculatePersonality(fullName);
          console.log('✅ Número de Personalidad calculado:', calculatedResult);
          break;

        case 'expresion':
          calculatedResult = calculateExpression(fullName);
          console.log('✅ Número de Expresión calculado:', calculatedResult);
          break;

        case 'año':
          calculatedResult = calculatePersonalYear(birthDate);
          console.log('✅ Número de Año Personal calculado:', calculatedResult);
          break;

        case 'maestros':
          calculatedResult = detectMasterNumbers(birthDate, fullName);
          console.log('✅ Números Maestros detectados:', calculatedResult);
          break;

        case 'compatibilidad':
          setError('Funcionalidad de compatibilidad en desarrollo');
          setIsLoading(false);
          return;

        default:
          setError('Tipo de cálculo no reconocido');
          setIsLoading(false);
          return;
      }

      // 4. Si es números maestros (array), manejar diferente
      if (selectedCard.id === 'maestros') {
        setResult(calculatedResult); // Array de maestros
        setIsLoading(false);
        return;
      }

      // 5. Extraer número y esMaestro
      const numero = calculatedResult.numero || calculatedResult;
      const esMaestro = calculatedResult.esMaestro || false;

      console.log('📡 Llamando a API con:', {
        tipo: selectedCard.id,
        numero,
        esMaestro,
        nombre: fullName || 'Usuario',
        fecha: birthDate || ''
      });

      // 6. LLAMAR A LA API (¡CRÍTICO!)
      const apiResponse = await getInterpretation(
        selectedCard.id,
        {
          nombre: fullName || 'Usuario',
          fechaNacimiento: birthDate || '',
          detalles: calculatedResult.detalles || `Número calculado: ${numero}`
        },
        numero,
        esMaestro
      );

      console.log('✅ Respuesta de API recibida:', apiResponse);

      // 7. Guardar resultado con interpretación de Claude
      setResult({
        numero: numero,
        esMaestro: esMaestro,
        titulo: calculatedResult.titulo || lifePathMeanings[numero]?.titulo || `Número ${numero}`,
        descripcion: apiResponse.interpretation, // ← Interpretación de Claude
        detalles: calculatedResult.detalles || `Número calculado: ${numero}`,
        metadata: apiResponse.metadata // Token usage, etc.
      });

    } catch (error) {
      console.error('❌ Error en handleCalculate:', error);
      setError(error.message || 'Hubo un error al procesar tu consulta. Verifica que el servidor esté corriendo en puerto 3001.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-purple-100 via-white to-purple-50 overflow-x-hidden">
      {/* Header mejorado con personaje zen */}
      <div className="relative bg-gradient-to-br from-purple-400 via-purple-300 to-pink-300 pt-16 pb-32 px-6 overflow-hidden">
        {/* Elementos decorativos de fondo */}
        <div className="absolute top-10 left-10 w-32 h-32 bg-white/10 rounded-full blur-2xl"></div>
        <div className="absolute bottom-20 right-10 w-40 h-40 bg-pink-300/20 rounded-full blur-3xl"></div>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-64 h-64 bg-purple-500/10 rounded-full blur-3xl"></div>

        {/* Personaje zen flotante - simulado con emoji y efectos */}
        <div className="relative z-10 text-center mb-6">
          <div className="inline-block animate-float">
            <div className="relative">
              {/* Aura/Glow detrás del personaje */}
              <div className="absolute inset-0 bg-gradient-to-br from-yellow-200/40 to-purple-300/40 rounded-full blur-3xl scale-150"></div>

              {/* Personaje (usaremos emoji hasta que se agregue imagen real) */}
              <div className="relative text-8xl mb-4 drop-shadow-2xl">
                🧘
              </div>
            </div>
          </div>

          {/* Elementos místicos flotantes */}
          <div className="absolute top-20 left-1/4 animate-bounce-slow">
            <span className="text-4xl opacity-70">✨</span>
          </div>
          <div className="absolute top-32 right-1/4 animate-bounce-slow delay-100">
            <span className="text-4xl opacity-70">🌙</span>
          </div>
          <div className="absolute top-40 left-1/3 animate-bounce-slow delay-200">
            <span className="text-3xl opacity-60">⭐</span>
          </div>
        </div>

        {/* Título principal */}
        <div className="relative z-10 text-center">
          <div className="flex items-center justify-center mb-3">
            <span className="text-5xl mr-3">🔮</span>
            <h1 className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent drop-shadow-lg">
              Numerología Personal
            </h1>
            <span className="text-5xl ml-3 opacity-0">🔮</span>
          </div>
          <p className="text-white/90 text-lg md:text-xl font-medium mt-2 drop-shadow">
            Descubre los números que guían tu vida
          </p>
        </div>

        {/* Onda decorativa en la parte inferior */}
        <div className="absolute bottom-0 left-0 right-0">
          <svg viewBox="0 0 1440 120" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full">
            <path d="M0 120L60 110C120 100 240 80 360 70C480 60 600 60 720 65C840 70 960 80 1080 80C1200 80 1320 70 1380 65L1440 60V120H1380C1320 120 1200 120 1080 120C960 120 840 120 720 120C600 120 480 120 360 120C240 120 120 120 60 120H0Z" fill="white"/>
          </svg>
        </div>
      </div>

      {/* Cards Container */}
      <div className="max-w-7xl mx-auto px-6 -mt-20 relative z-20">
        {/* Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-5">
          {cards.map((card) => {
            const IconComponent = card.icon;
            return (
              <div
                key={card.id}
                onClick={() => handleCardSelect(card)}
                className="group cursor-pointer transform transition-all duration-300 hover:scale-105 hover:shadow-2xl"
              >
                <div className={`${card.gradient} rounded-3xl p-6 border-2 border-white shadow-xl backdrop-blur-sm`}>
                  <div className="flex items-start gap-4">
                    {/* Icon con efecto mejorado */}
                    <div className={`${card.iconBg} w-16 h-16 rounded-2xl flex items-center justify-center shadow-lg group-hover:rotate-6 group-hover:scale-110 transition-all duration-300 flex-shrink-0`}>
                      <IconComponent className="w-8 h-8 text-white" strokeWidth={2.5} />
                    </div>

                    {/* Content */}
                    <div className="flex-1 min-w-0">
                      <h3 className="text-xl font-bold text-gray-800 mb-1 group-hover:text-purple-700 transition-colors">
                        {card.title}
                      </h3>
                      <p className="text-sm font-semibold text-gray-600 mb-2">
                        {card.subtitle}
                      </p>
                      <p className="text-sm text-gray-600 leading-relaxed">
                        {card.description}
                      </p>

                      {/* Input hint mejorado */}
                      <div className="flex items-center gap-2 mt-4 pt-3 border-t border-gray-200/50">
                        <span className="text-lg">{card.emoji}</span>
                        <span className="text-xs text-gray-500 font-medium">
                          {card.input}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* Footer decorativo */}
        <div className="text-center mt-12 mb-8 text-gray-500 text-sm">
          <p className="flex items-center justify-center gap-2">
            <span>✨</span>
            <span>Powered by IA</span>
            <span>✨</span>
          </p>
        </div>
      </div>

      {/* Modal/Detail View - mejorado */}
      {selectedCard && (
        <div
          className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4 z-50 animate-fadeIn"
          onClick={() => {
            setSelectedCard(null);
            const today = new Date().toISOString().split('T')[0];
            setBirthDate(today);
            setFullName('');
            setResult(null);
            setError('');
          }}
        >
          <div
            className="bg-white rounded-3xl p-6 sm:p-8 max-w-2xl w-full max-h-[90vh] overflow-y-auto shadow-2xl transform transition-all animate-slideUp"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-start justify-between mb-4 sm:mb-6">
              <div className="flex items-center gap-3 sm:gap-4">
                <div className={`${selectedCard.iconBg} w-16 h-16 sm:w-20 sm:h-20 rounded-2xl flex items-center justify-center shadow-lg flex-shrink-0`}>
                  <selectedCard.icon className="w-8 h-8 sm:w-10 sm:h-10 text-white" strokeWidth={2.5} />
                </div>
                <div className="min-w-0">
                  <h2 className="text-2xl sm:text-3xl font-bold text-gray-800 leading-tight">
                    {selectedCard.title}
                  </h2>
                  <p className="text-sm sm:text-base text-gray-600 font-medium">{selectedCard.subtitle}</p>
                </div>
              </div>
              <button
                onClick={() => {
                  setSelectedCard(null);
                  const today = new Date().toISOString().split('T')[0];
                  setBirthDate(today);
                  setFullName('');
                  setResult(null);
                  setError('');
                }}
                className="text-gray-400 hover:text-gray-600 text-3xl font-bold leading-none hover:rotate-90 transition-all duration-300"
              >
                ×
              </button>
            </div>

            <p className="text-gray-700 mb-4 sm:mb-6 text-base sm:text-lg leading-relaxed">
              {selectedCard.description}
            </p>

            {/* Sample Form */}
            <div className="space-y-4 mb-6">
              {selectedCard.id === 'maestros' ? (
                <>
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2 flex items-center gap-2">
                      <span>📅</span> Añade tu fecha de nacimiento
                    </label>
                    <input
                      type="date"
                      value={birthDate}
                      onChange={(e) => setBirthDate(e.target.value)}
                      className="w-full px-3 sm:px-4 py-3 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all text-sm sm:text-base"
                      style={{
                        boxSizing: 'border-box',
                        maxWidth: '100%',
                        minWidth: 0
                      }}
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2 flex items-center gap-2">
                      <span>✍️</span> Nombre completo
                    </label>
                    <input
                      type="text"
                      placeholder="Ej: María García"
                      value={fullName}
                      onChange={(e) => setFullName(e.target.value)}
                      className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all"
                    />
                  </div>
                </>
              ) : selectedCard.id === 'vida' || selectedCard.id === 'año' ? (
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2 flex items-center gap-2">
                    <span>📅</span> Añade tu fecha de nacimiento
                  </label>
                  <input
                    type="date"
                    value={birthDate}
                    onChange={(e) => setBirthDate(e.target.value)}
                    className="w-full px-3 sm:px-4 py-3 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all text-sm sm:text-base"
                    style={{
                      boxSizing: 'border-box',
                      maxWidth: '100%',
                      minWidth: 0
                    }}
                  />
                </div>
              ) : (
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2 flex items-center gap-2">
                    <span>✍️</span> Nombre completo
                  </label>
                  <input
                    type="text"
                    placeholder="Ej: María García"
                    value={fullName}
                    onChange={(e) => setFullName(e.target.value)}
                    className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all"
                  />
                </div>
              )}
            </div>

            {/* Action Button */}
            <button
              onClick={handleCalculate}
              disabled={isLoading}
              className={`w-full py-3 sm:py-4 rounded-xl font-bold text-white transition-all duration-300 text-base sm:text-lg flex items-center justify-center gap-2 ${
                isLoading
                  ? 'bg-gray-400 cursor-not-allowed'
                  : `bg-gradient-to-r ${selectedCard.color} hover:shadow-2xl transform hover:scale-105`
              }`}
            >
              {isLoading ? (
                <>
                  <svg className="animate-spin h-5 w-5" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Consultando...
                </>
              ) : (
                <>
                  <Sparkles className="w-5 h-5" />
                  Calcular {selectedCard.title}
                </>
              )}
            </button>

            {/* Mensaje de error */}
            {error && (
              <div className="mt-3 sm:mt-4 p-3 sm:p-4 bg-red-50 border-2 border-red-200 rounded-xl animate-fadeIn">
                <p className="text-red-600 text-center font-medium flex items-center justify-center gap-2 text-sm sm:text-base">
                  <span>⚠️</span>
                  <span>{error}</span>
                </p>
              </div>
            )}

            {/* Resultados */}
            {result && selectedCard.id !== 'maestros' && (
              <div className="mt-6 p-6 bg-gradient-to-br from-purple-50 to-pink-50 rounded-2xl border-2 border-purple-100 animate-fadeIn">
                {/* Número grande centrado */}
                <div className="text-center mb-4">
                  <div className={`text-8xl font-bold bg-gradient-to-r ${selectedCard.color} bg-clip-text text-transparent mb-2`}>
                    {result.numero}
                  </div>

                  {/* Badge de número maestro */}
                  {result.esMaestro && (
                    <div className="inline-block px-4 py-2 bg-gradient-to-r from-yellow-400 to-amber-500 text-white rounded-full text-sm font-bold shadow-lg mb-3">
                      ✨ Número Maestro
                    </div>
                  )}
                </div>

                {/* Descripción - Ahora viene de Claude con markdown renderizado */}
                <div
                  className="mb-4"
                  dangerouslySetInnerHTML={{ __html: renderMarkdown(result.descripcion) }}
                />

                {/* Detalles del cálculo */}
                {result.detalles && (
                  <div className="mt-4 p-3 bg-purple-50 rounded-lg">
                    <p className="text-sm text-purple-800">
                      <strong>Cálculo:</strong> {result.detalles}
                    </p>
                  </div>
                )}

                {/* Metadata de Claude (opcional, para debugging) */}
                {result.metadata && (
                  <div className="mt-2 text-xs text-gray-500 text-center">
                    Generado por Claude • {result.metadata.usage?.output_tokens || 0} tokens
                  </div>
                )}
              </div>
            )}

            {/* Resultados para números maestros (array) */}
            {result && selectedCard.id === 'maestros' && (
              <div className="mt-6 animate-fadeIn">
                {result.length > 0 ? (
                  <div className="space-y-3">
                    <h3 className="text-xl font-bold text-gray-800 text-center mb-4">
                      ✨ Números Maestros Encontrados
                    </h3>
                    {result.map((item, index) => (
                      <div
                        key={index}
                        className="p-4 bg-gradient-to-r from-yellow-50 to-amber-50 rounded-xl border-2 border-yellow-200"
                      >
                        <div className="flex items-center justify-between">
                          <span className="font-semibold text-gray-700">{item.tipo}</span>
                          <span className={`text-4xl font-bold bg-gradient-to-r ${selectedCard.color} bg-clip-text text-transparent`}>
                            {item.numero}
                          </span>
                        </div>
                        {lifePathMeanings[item.numero] && (
                          <p className="text-sm text-gray-600 mt-2">
                            {lifePathMeanings[item.numero].title} - {lifePathMeanings[item.numero].description}
                          </p>
                        )}
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="p-6 bg-gray-50 rounded-xl text-center">
                    <p className="text-gray-600">
                      No se encontraron números maestros en tu perfil numerológico.
                    </p>
                  </div>
                )}
              </div>
            )}

            <p className="text-center text-xs sm:text-sm text-gray-500 mt-4 flex items-center justify-center gap-2">
              <span>🤖</span>
              <span className="hidden sm:inline">La IA analizará tu información y te dará una explicación personalizada</span>
              <span className="sm:hidden">Análisis personalizado con IA</span>
            </p>
          </div>
        </div>
      )}

      <style>{`
        @keyframes float {
          0%, 100% {
            transform: translateY(0px);
          }
          50% {
            transform: translateY(-20px);
          }
        }

        @keyframes bounce-slow {
          0%, 100% {
            transform: translateY(0px);
          }
          50% {
            transform: translateY(-15px);
          }
        }

        @keyframes fadeIn {
          from {
            opacity: 0;
          }
          to {
            opacity: 1;
          }
        }

        @keyframes slideUp {
          from {
            transform: translateY(50px);
            opacity: 0;
          }
          to {
            transform: translateY(0);
            opacity: 1;
          }
        }

        .animate-float {
          animation: float 4s ease-in-out infinite;
        }

        .animate-bounce-slow {
          animation: bounce-slow 3s ease-in-out infinite;
        }

        .delay-100 {
          animation-delay: 0.5s;
        }

        .delay-200 {
          animation-delay: 1s;
        }

        .animate-fadeIn {
          animation: fadeIn 0.3s ease-out;
        }

        .animate-slideUp {
          animation: slideUp 0.3s ease-out;
        }
      `}</style>
    </div>
  );
};

export default NumerologyCards;
