export interface Theory {
  id: string;
  name: string;
  shortName: string;
  color: string;
  proponent: string;
  coreClaim: string;
}

export const theories: Record<string, Theory> = {
  iit: {
    id: 'iit',
    name: 'Integrated Information Theory',
    shortName: 'IIT',
    color: '#8B5CF6', // purple
    proponent: 'Giulio Tononi',
    coreClaim: 'Consciousness is identical to integrated information (phi).',
  },
  gwt: {
    id: 'gwt',
    name: 'Global Workspace Theory',
    shortName: 'GWT',
    color: '#3B82F6', // blue
    proponent: 'Bernard Baars',
    coreClaim: 'Consciousness arises from global information broadcast.',
  },
  hot: {
    id: 'hot',
    name: 'Higher-Order Theories',
    shortName: 'HOT',
    color: '#10B981', // green
    proponent: 'David Rosenthal',
    coreClaim: 'Consciousness requires higher-order representations of mental states.',
  },
  pp: {
    id: 'pp',
    name: 'Predictive Processing',
    shortName: 'PP',
    color: '#F59E0B', // orange
    proponent: 'Karl Friston / Andy Clark',
    coreClaim: 'Consciousness emerges from hierarchical prediction error minimization.',
  },
  rpt: {
    id: 'rpt',
    name: 'Recurrent Processing Theory',
    shortName: 'RPT',
    color: '#EC4899', // pink
    proponent: 'Victor Lamme',
    coreClaim: 'Consciousness arises from recurrent (feedback) processing in sensory hierarchies.',
  },
  ast: {
    id: 'ast',
    name: 'Attention Schema Theory',
    shortName: 'AST',
    color: '#14B8A6', // teal
    proponent: 'Michael Graziano',
    coreClaim: 'Consciousness is the brain\'s simplified model of its own attention.',
  },
  orchor: {
    id: 'orchor',
    name: 'Orchestrated Objective Reduction',
    shortName: 'Orch OR',
    color: '#EF4444', // red
    proponent: 'Roger Penrose / Stuart Hameroff',
    coreClaim: 'Consciousness arises from quantum computations in microtubules.',
  },
};

export const theoryList = Object.values(theories);
