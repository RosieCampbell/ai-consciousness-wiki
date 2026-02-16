import { useState, useMemo } from 'react';

interface PhiExplorerProps {
  initialNodes?: number;
  initialConnectivity?: number;
}

// Generate node positions in a circle
function generateNodePositions(count: number, centerX: number, centerY: number, radius: number) {
  const positions: { x: number; y: number }[] = [];
  for (let i = 0; i < count; i++) {
    const angle = (i * 2 * Math.PI) / count - Math.PI / 2;
    positions.push({
      x: centerX + radius * Math.cos(angle),
      y: centerY + radius * Math.sin(angle),
    });
  }
  return positions;
}

// Generate connections based on connectivity level
function generateConnections(nodeCount: number, connectivity: number) {
  const connections: { from: number; to: number }[] = [];
  const maxConnections = (nodeCount * (nodeCount - 1)) / 2;
  const targetConnections = Math.round(maxConnections * (connectivity / 100));

  // Generate all possible connections
  const allPossible: { from: number; to: number }[] = [];
  for (let i = 0; i < nodeCount; i++) {
    for (let j = i + 1; j < nodeCount; j++) {
      allPossible.push({ from: i, to: j });
    }
  }

  // Shuffle and take the target number
  const shuffled = allPossible.sort(() => Math.random() - 0.5);
  return shuffled.slice(0, targetConnections);
}

// Simplified phi calculation for pedagogical purposes
function calculatePhi(nodeCount: number, connections: { from: number; to: number }[]): number {
  if (nodeCount < 2) return 0;

  const maxConnections = (nodeCount * (nodeCount - 1)) / 2;
  const density = connections.length / maxConnections;

  // Phi is low with no integration (disconnected) or full connectivity (no differentiation)
  // Peak at moderate connectivity
  const integrationFactor = density;
  const differentiationFactor = 1 - Math.abs(density - 0.5) * 2;

  // Simple model: phi increases with nodes and peaks at moderate connectivity
  const basePhi = nodeCount * integrationFactor * differentiationFactor;

  return Math.round(basePhi * 100) / 100;
}

export default function PhiExplorer({
  initialNodes = 4,
  initialConnectivity = 50,
}: PhiExplorerProps) {
  const [nodeCount, setNodeCount] = useState(initialNodes);
  const [connectivity, setConnectivity] = useState(initialConnectivity);
  const [seed, setSeed] = useState(0);

  const svgSize = 300;
  const center = svgSize / 2;
  const radius = svgSize / 2 - 40;

  const nodes = useMemo(
    () => generateNodePositions(nodeCount, center, center, radius),
    [nodeCount, center, radius]
  );

  const connections = useMemo(
    () => generateConnections(nodeCount, connectivity),
    [nodeCount, connectivity, seed]
  );

  const phi = useMemo(
    () => calculatePhi(nodeCount, connections),
    [nodeCount, connections]
  );

  const phiLevel =
    phi < 1 ? 'Very Low' : phi < 2 ? 'Low' : phi < 3 ? 'Moderate' : phi < 4 ? 'High' : 'Very High';

  const phiColor =
    phi < 1
      ? '#94a3b8'
      : phi < 2
        ? '#f59e0b'
        : phi < 3
          ? '#eab308'
          : phi < 4
            ? '#22c55e'
            : '#8b5cf6';

  return (
    <div className="not-content my-6 rounded-lg border border-slate-200 bg-white p-6 dark:border-slate-700 dark:bg-slate-800">
      <h3 className="mb-4 text-lg font-semibold text-slate-900 dark:text-white">
        Phi Explorer: Understanding Integrated Information
      </h3>

      <div className="grid gap-6 md:grid-cols-2">
        {/* SVG Network Visualization */}
        <div className="flex items-center justify-center rounded-lg bg-slate-50 p-4 dark:bg-slate-900/50">
          <svg width={svgSize} height={svgSize} className="overflow-visible">
            {/* Connections */}
            {connections.map((conn, i) => (
              <line
                key={`conn-${i}`}
                x1={nodes[conn.from].x}
                y1={nodes[conn.from].y}
                x2={nodes[conn.to].x}
                y2={nodes[conn.to].y}
                stroke="#8b5cf6"
                strokeWidth={2}
                strokeOpacity={0.6}
                className="transition-all duration-300"
              />
            ))}

            {/* Nodes */}
            {nodes.map((node, i) => (
              <g key={`node-${i}`} className="transition-all duration-300">
                <circle
                  cx={node.x}
                  cy={node.y}
                  r={20}
                  fill="#8b5cf6"
                  stroke="#6d28d9"
                  strokeWidth={2}
                />
                <text
                  x={node.x}
                  y={node.y}
                  textAnchor="middle"
                  dominantBaseline="central"
                  fill="white"
                  fontSize={12}
                  fontWeight="bold"
                >
                  {i + 1}
                </text>
              </g>
            ))}
          </svg>
        </div>

        {/* Controls and Phi Display */}
        <div className="space-y-6">
          {/* Phi Gauge */}
          <div className="rounded-lg bg-slate-50 p-4 text-center dark:bg-slate-900/50">
            <div className="mb-1 text-sm text-slate-600 dark:text-slate-400">
              Integrated Information (Phi)
            </div>
            <div className="text-4xl font-bold" style={{ color: phiColor }}>
              {phi.toFixed(2)}
            </div>
            <div className="text-sm font-medium" style={{ color: phiColor }}>
              {phiLevel}
            </div>
          </div>

          {/* Sliders */}
          <div className="space-y-4">
            <div>
              <label className="mb-2 flex justify-between text-sm font-medium text-slate-700 dark:text-slate-300">
                <span>Number of Components</span>
                <span className="text-purple-600 dark:text-purple-400">{nodeCount}</span>
              </label>
              <input
                type="range"
                min={2}
                max={8}
                value={nodeCount}
                onChange={(e) => setNodeCount(parseInt(e.target.value))}
                className="h-2 w-full cursor-pointer appearance-none rounded-lg bg-slate-200 accent-purple-600 dark:bg-slate-700"
              />
              <div className="mt-1 flex justify-between text-xs text-slate-500">
                <span>2</span>
                <span>8</span>
              </div>
            </div>

            <div>
              <label className="mb-2 flex justify-between text-sm font-medium text-slate-700 dark:text-slate-300">
                <span>Connection Density</span>
                <span className="text-purple-600 dark:text-purple-400">{connectivity}%</span>
              </label>
              <input
                type="range"
                min={0}
                max={100}
                value={connectivity}
                onChange={(e) => setConnectivity(parseInt(e.target.value))}
                className="h-2 w-full cursor-pointer appearance-none rounded-lg bg-slate-200 accent-purple-600 dark:bg-slate-700"
              />
              <div className="mt-1 flex justify-between text-xs text-slate-500">
                <span>Disconnected</span>
                <span>Fully Connected</span>
              </div>
            </div>

            <button
              onClick={() => setSeed((s) => s + 1)}
              className="w-full rounded-lg border border-slate-300 px-4 py-2 text-sm font-medium text-slate-700 transition-colors hover:bg-slate-100 dark:border-slate-600 dark:text-slate-300 dark:hover:bg-slate-700"
            >
              Randomize Connections
            </button>
          </div>
        </div>
      </div>

      {/* Explanation */}
      <div className="mt-6 rounded-lg bg-purple-50 p-4 dark:bg-purple-900/20">
        <h4 className="mb-2 font-medium text-purple-900 dark:text-purple-200">
          What does this show?
        </h4>
        <p className="text-sm text-purple-800 dark:text-purple-300">
          In IIT, consciousness corresponds to integrated information (phi). A system has high phi
          when its parts are both <strong>differentiated</strong> (each part contributes unique
          information) and <strong>integrated</strong> (the parts work together as a unified whole).
          Notice how phi peaks at moderate connectivity: too few connections means no integration,
          while too many connections means no differentiation.
        </p>
      </div>
    </div>
  );
}
