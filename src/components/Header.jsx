import { Sparkles } from 'lucide-react';

const Header = () => {
  return (
    <header className="relative py-12 px-4 text-center overflow-hidden">
      {/* Background gradient */}
      <div className="absolute inset-0 bg-gradient-to-b from-purple-900/50 via-indigo-900/30 to-transparent" />

      {/* Floating particles */}
      <div className="absolute inset-0 overflow-hidden">
        {[...Array(20)].map((_, i) => (
          <div
            key={i}
            className="absolute w-1 h-1 bg-purple-400/30 rounded-full animate-pulse"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
              animationDelay: `${Math.random() * 2}s`,
              animationDuration: `${2 + Math.random() * 3}s`
            }}
          />
        ))}
      </div>

      <div className="relative z-10 max-w-4xl mx-auto">
        {/* Zen character */}
        <div className="mb-6 flex justify-center">
          <div className="relative animate-float">
            {/* Glow effect */}
            <div className="absolute inset-0 bg-purple-500/30 rounded-full blur-xl scale-150" />

            {/* Character circle */}
            <div className="relative w-24 h-24 bg-gradient-to-br from-purple-600 to-indigo-700 rounded-full flex items-center justify-center shadow-2xl shadow-purple-500/50">
              <span className="text-4xl">🧘</span>
            </div>

            {/* Orbiting sparkle */}
            <div className="absolute -top-2 -right-2">
              <Sparkles className="w-6 h-6 text-yellow-400 animate-pulse" />
            </div>
          </div>
        </div>

        {/* Title */}
        <h1 className="text-4xl md:text-5xl font-bold mb-4 bg-gradient-to-r from-purple-400 via-pink-400 to-indigo-400 bg-clip-text text-transparent">
          Numerología Mística
        </h1>

        {/* Subtitle */}
        <p className="text-lg md:text-xl text-purple-200/80 max-w-2xl mx-auto">
          Descubre los secretos que los números revelan sobre tu destino,
          personalidad y camino de vida
        </p>

        {/* Decorative line */}
        <div className="mt-8 flex items-center justify-center gap-4">
          <div className="h-px w-16 bg-gradient-to-r from-transparent to-purple-500" />
          <Sparkles className="w-5 h-5 text-purple-400" />
          <div className="h-px w-16 bg-gradient-to-l from-transparent to-purple-500" />
        </div>
      </div>
    </header>
  );
};

export default Header;
