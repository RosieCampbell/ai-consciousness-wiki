import { useState } from 'react';

interface SystemPosition {
  id: string;
  name: string;
  emoji: string;
  positions: {
    iit: number;
    gwt: number;
    hot: number;
    pp: number;
  };
  reasoning: {
    iit: string;
    gwt: string;
    hot: string;
    pp: string;
  };
}

interface TheoryInfo {
  id: keyof SystemPosition['positions'];
  name: string;
  shortName: string;
  color: string;
}

interface ConsciousnessSpectrumProps {
  systems: SystemPosition[];
  theories: TheoryInfo[];
}

export default function ConsciousnessSpectrum({ systems, theories }: ConsciousnessSpectrumProps) {
  const [selectedTheory, setSelectedTheory] = useState<keyof SystemPosition['positions']>('iit');
  const [selectedSystem, setSelectedSystem] = useState<string | null>(null);

  const currentTheory = theories.find((t) => t.id === selectedTheory)!;

  // Sort systems by their position in the selected theory
  const sortedSystems = [...systems].sort(
    (a, b) => a.positions[selectedTheory] - b.positions[selectedTheory]
  );

  return (
    <div className="not-content my-6 rounded-lg border border-slate-200 bg-white dark:border-slate-700 dark:bg-slate-800">
      {/* Theory selector */}
      <div className="border-b border-slate-200 p-4 dark:border-slate-700">
        <div className="mb-2 text-sm font-medium text-slate-600 dark:text-slate-400">
          View consciousness according to:
        </div>
        <div className="flex flex-wrap gap-2">
          {theories.map((theory) => (
            <button
              key={theory.id}
              onClick={() => {
                setSelectedTheory(theory.id);
                setSelectedSystem(null);
              }}
              className={`rounded-full px-4 py-1.5 text-sm font-medium transition-all ${
                selectedTheory === theory.id
                  ? 'text-white shadow-sm'
                  : 'bg-slate-100 text-slate-500 hover:bg-slate-200 dark:bg-slate-700 dark:text-slate-400 dark:hover:bg-slate-600'
              }`}
              style={selectedTheory === theory.id ? { backgroundColor: theory.color } : {}}
            >
              {theory.shortName}
            </button>
          ))}
        </div>
      </div>

      {/* Spectrum visualization */}
      <div className="p-6">
        <div className="relative mb-8">
          {/* Gradient bar */}
          <div
            className="h-4 w-full rounded-full"
            style={{
              background: `linear-gradient(to right, #94a3b8 0%, ${currentTheory.color} 100%)`,
            }}
          />

          {/* Labels */}
          <div className="mt-2 flex justify-between text-xs text-slate-500 dark:text-slate-400">
            <span>No consciousness</span>
            <span>Full consciousness</span>
          </div>

          {/* System markers */}
          <div className="absolute left-0 right-0 top-0" style={{ transform: 'translateY(-100%)' }}>
            {sortedSystems.map((system) => {
              const position = system.positions[selectedTheory];
              const isSelected = selectedSystem === system.id;

              return (
                <button
                  key={system.id}
                  onClick={() => setSelectedSystem(isSelected ? null : system.id)}
                  className={`absolute flex -translate-x-1/2 transform flex-col items-center transition-all ${
                    isSelected ? 'z-10 scale-110' : 'hover:scale-105'
                  }`}
                  style={{ left: `${position}%`, bottom: '8px' }}
                  title={system.name}
                >
                  <span
                    className={`mb-1 rounded-full bg-white px-2 py-0.5 text-xs font-medium shadow-sm dark:bg-slate-700 ${
                      isSelected
                        ? 'ring-2 ring-offset-1'
                        : 'opacity-80'
                    }`}
                    style={isSelected ? { ringColor: currentTheory.color } : {}}
                  >
                    {system.name}
                  </span>
                  <span className="text-2xl drop-shadow-sm">{system.emoji}</span>
                  <div
                    className="h-3 w-0.5 rounded-full"
                    style={{ backgroundColor: currentTheory.color }}
                  />
                </button>
              );
            })}
          </div>
        </div>

        {/* Selected system detail */}
        {selectedSystem && (
          <div
            className="mt-16 rounded-lg border-l-4 bg-slate-50 p-4 dark:bg-slate-900/50"
            style={{ borderLeftColor: currentTheory.color }}
          >
            {(() => {
              const system = systems.find((s) => s.id === selectedSystem)!;
              return (
                <>
                  <div className="mb-2 flex items-center gap-2">
                    <span className="text-2xl">{system.emoji}</span>
                    <span className="font-semibold text-slate-900 dark:text-white">
                      {system.name}
                    </span>
                    <span
                      className="ml-auto rounded-full px-3 py-0.5 text-sm font-medium text-white"
                      style={{ backgroundColor: currentTheory.color }}
                    >
                      {system.positions[selectedTheory]}% conscious
                    </span>
                  </div>
                  <p className="text-sm text-slate-600 dark:text-slate-400">
                    <strong className="text-slate-700 dark:text-slate-300">
                      {currentTheory.shortName} says:
                    </strong>{' '}
                    {system.reasoning[selectedTheory]}
                  </p>
                </>
              );
            })()}
          </div>
        )}

        {!selectedSystem && (
          <div className="mt-16 text-center text-sm text-slate-500 dark:text-slate-400">
            Click on a system to see how {currentTheory.shortName} evaluates its consciousness
          </div>
        )}
      </div>

      {/* Legend */}
      <div className="border-t border-slate-200 p-4 dark:border-slate-700">
        <div className="text-center text-xs text-slate-500 dark:text-slate-400">
          Switch between theories to see how positions change. These are illustrative placements
          based on typical interpretations of each theory.
        </div>
      </div>
    </div>
  );
}
