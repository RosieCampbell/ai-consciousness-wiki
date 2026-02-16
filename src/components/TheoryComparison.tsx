import { useState } from 'react';

interface TheoryInfo {
  id: string;
  name: string;
  shortName: string;
  color: string;
}

interface TheoryPosition {
  stance: 'yes' | 'no' | 'partial' | 'unclear';
  detail: string;
}

interface ComparisonDimension {
  id: string;
  name: string;
  question: string;
  theories: Record<string, TheoryPosition>;
}

interface TheoryComparisonProps {
  theories: TheoryInfo[];
  dimensions: ComparisonDimension[];
}

const stanceLabels: Record<string, { label: string; color: string }> = {
  yes: { label: 'Yes', color: 'bg-green-100 text-green-800 dark:bg-green-900/40 dark:text-green-300' },
  no: { label: 'No', color: 'bg-red-100 text-red-800 dark:bg-red-900/40 dark:text-red-300' },
  partial: { label: 'Partially', color: 'bg-amber-100 text-amber-800 dark:bg-amber-900/40 dark:text-amber-300' },
  unclear: { label: 'Unclear', color: 'bg-slate-100 text-slate-800 dark:bg-slate-700 dark:text-slate-300' },
};

export default function TheoryComparison({ theories, dimensions }: TheoryComparisonProps) {
  const [activeTheories, setActiveTheories] = useState<Set<string>>(
    new Set(theories.map((t) => t.id))
  );
  const [expandedDimension, setExpandedDimension] = useState<string | null>(null);

  const toggleTheory = (id: string) => {
    setActiveTheories((prev) => {
      const next = new Set(prev);
      if (next.has(id)) {
        if (next.size > 1) next.delete(id);
      } else {
        next.add(id);
      }
      return next;
    });
  };

  const toggleDimension = (id: string) => {
    setExpandedDimension((prev) => (prev === id ? null : id));
  };

  const visibleTheories = theories.filter((t) => activeTheories.has(t.id));

  return (
    <div className="not-content my-6 rounded-lg border border-slate-200 bg-white dark:border-slate-700 dark:bg-slate-800">
      {/* Theory toggles */}
      <div className="border-b border-slate-200 p-4 dark:border-slate-700">
        <div className="mb-2 text-sm font-medium text-slate-600 dark:text-slate-400">
          Select theories to compare:
        </div>
        <div className="flex flex-wrap gap-2">
          {theories.map((theory) => {
            const isActive = activeTheories.has(theory.id);
            return (
              <button
                key={theory.id}
                onClick={() => toggleTheory(theory.id)}
                className={`rounded-full px-4 py-1.5 text-sm font-medium transition-all ${
                  isActive
                    ? 'text-white shadow-sm'
                    : 'bg-slate-100 text-slate-500 hover:bg-slate-200 dark:bg-slate-700 dark:text-slate-400 dark:hover:bg-slate-600'
                }`}
                style={isActive ? { backgroundColor: theory.color } : {}}
              >
                {theory.shortName}
              </button>
            );
          })}
        </div>
      </div>

      {/* Comparison table */}
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="border-b border-slate-200 dark:border-slate-700">
              <th className="p-4 text-left text-sm font-semibold text-slate-900 dark:text-white">
                Dimension
              </th>
              {visibleTheories.map((theory) => (
                <th
                  key={theory.id}
                  className="p-4 text-center text-sm font-semibold"
                  style={{ color: theory.color }}
                >
                  {theory.shortName}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {dimensions.map((dimension) => {
              const isExpanded = expandedDimension === dimension.id;
              return (
                <>
                  <tr
                    key={dimension.id}
                    className="cursor-pointer border-b border-slate-100 transition-colors hover:bg-slate-50 dark:border-slate-700/50 dark:hover:bg-slate-700/30"
                    onClick={() => toggleDimension(dimension.id)}
                  >
                    <td className="p-4">
                      <div className="flex items-center gap-2">
                        <span
                          className={`text-slate-400 transition-transform ${
                            isExpanded ? 'rotate-90' : ''
                          }`}
                        >
                          &#9656;
                        </span>
                        <div>
                          <div className="font-medium text-slate-900 dark:text-white">
                            {dimension.name}
                          </div>
                          <div className="text-sm text-slate-500 dark:text-slate-400">
                            {dimension.question}
                          </div>
                        </div>
                      </div>
                    </td>
                    {visibleTheories.map((theory) => {
                      const position = dimension.theories[theory.id];
                      const stanceInfo = stanceLabels[position?.stance || 'unclear'];
                      return (
                        <td key={theory.id} className="p-4 text-center">
                          <span
                            className={`inline-block rounded-full px-3 py-1 text-xs font-medium ${stanceInfo.color}`}
                          >
                            {stanceInfo.label}
                          </span>
                        </td>
                      );
                    })}
                  </tr>
                  {isExpanded && (
                    <tr
                      key={`${dimension.id}-details`}
                      className="border-b border-slate-200 bg-slate-50 dark:border-slate-700 dark:bg-slate-900/50"
                    >
                      <td colSpan={visibleTheories.length + 1} className="p-4">
                        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
                          {visibleTheories.map((theory) => {
                            const position = dimension.theories[theory.id];
                            return (
                              <div
                                key={theory.id}
                                className="rounded-lg border-l-4 bg-white p-3 dark:bg-slate-800"
                                style={{ borderLeftColor: theory.color }}
                              >
                                <div
                                  className="mb-1 text-sm font-semibold"
                                  style={{ color: theory.color }}
                                >
                                  {theory.shortName}
                                </div>
                                <div className="text-sm text-slate-600 dark:text-slate-400">
                                  {position?.detail || 'No details available.'}
                                </div>
                              </div>
                            );
                          })}
                        </div>
                      </td>
                    </tr>
                  )}
                </>
              );
            })}
          </tbody>
        </table>
      </div>

      {/* Instructions */}
      <div className="border-t border-slate-200 p-3 text-center text-sm text-slate-500 dark:border-slate-700 dark:text-slate-400">
        Click any row to see detailed explanations for each theory
      </div>
    </div>
  );
}
