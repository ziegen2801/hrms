import type { Node, Edge } from '@xyflow/react';
import type { ArchNodeData, LayerNodeData } from '../types';

const TECH_W = 280; // slightly wider to fit the lists
const TECH_H = 220;
const TECH_GAP_X = 60;
const TECH_GAP_Y = 120;
const START_X = 100;
const START_Y = 100;

const COLORS = {
  execution: '#3B82F6',
  events: '#8B5CF6',
  platform: '#10B981',
  ai: '#F43F5E'
};

const BACKEND_FLOWS = [
  {
    id: 'grp-exec', label: 'Application Execution Flow', color: COLORS.execution,
    nodes: [
      { id: 'be-rec', label: 'Recruitment', typeLabel: 'Laravel Module', traits: ['Arch: Core Package', 'DB: PostgreSQL', 'Comm: REST', 'Events: RequisitionCreated', 'Deps: Workflow'] },
      { id: 'be-cand', label: 'Candidate', typeLabel: 'Laravel Module', traits: ['Arch: Core Package', 'DB: PostgreSQL', 'Comm: REST', 'Events: CandidateApplied', 'Deps: Recruitment'] },
      { id: 'be-int', label: 'Interview', typeLabel: 'Laravel Module', traits: ['Arch: Core Package', 'DB: PostgreSQL', 'Comm: REST', 'Events: InterviewScheduled', 'Deps: Candidate'] },
      { id: 'be-offer', label: 'Offer', typeLabel: 'Laravel Module', traits: ['Arch: Core Package', 'DB: PostgreSQL', 'Comm: REST', 'Events: OfferAccepted', 'Deps: Interview'] },
      { id: 'be-onb', label: 'Onboarding', typeLabel: 'Laravel Module', traits: ['Arch: Core Package', 'DB: PostgreSQL', 'Comm: REST', 'Events: OnboardingCompleted', 'Deps: Offer'] },
      { id: 'be-emp', label: 'Employee', typeLabel: 'Laravel Module', traits: ['Arch: Core Package', 'DB: PostgreSQL', 'Comm: gRPC', 'Events: EmployeeCreated', 'Deps: Onboarding'] },
      { id: 'be-att', label: 'Attendance', typeLabel: 'Go Service', traits: ['Arch: Independent', 'DB: PostgreSQL', 'Comm: gRPC', 'Events: ShiftCompleted', 'Deps: Employee'] },
      { id: 'be-pay', label: 'Payroll', typeLabel: 'Python Batch', traits: ['Arch: Independent', 'DB: PostgreSQL', 'Comm: Kafka', 'Events: PayrollRun', 'Deps: Attendance'] },
      { id: 'be-rep', label: 'Reports', typeLabel: 'Laravel Module', traits: ['Arch: Core Package', 'DB: ClickHouse', 'Comm: REST', 'Events: ReportGenerated', 'Deps: Payroll'] }
    ]
  },
  {
    id: 'grp-evt', label: 'Kafka Event Choreography', color: COLORS.events,
    nodes: [
      { id: 'ev-emp', label: 'Employee Data', typeLabel: 'Core Record', traits: ['Arch: Laravel', 'DB: PostgreSQL'] },
      { id: 'ev-att', label: 'Attendance Service', typeLabel: 'Event Producer', traits: ['Arch: Go', 'Comm: gRPC', 'Events: PunchIngested'] },
      { id: 'ev-kafka', label: 'Kafka Event Backbone', typeLabel: 'Message Broker', traits: ['Arch: Apache Kafka', 'Comm: Pub/Sub'] },
      { id: 'ev-pay', label: 'Payroll Service', typeLabel: 'Event Consumer', traits: ['Arch: Python', 'Comm: Kafka Listener', 'Events: LedgerUpdated'] },
      { id: 'ev-ch', label: 'ClickHouse Sync', typeLabel: 'Data Pipeline', traits: ['Arch: Debezium', 'DB: ClickHouse', 'Comm: CDC'] },
      { id: 'ev-ana', label: 'Analytics Engine', typeLabel: 'Read Model', traits: ['Arch: Metabase', 'DB: ClickHouse', 'Comm: SQL'] }
    ]
  },
  {
    id: 'grp-plat', label: 'Shared Platform Backbone', color: COLORS.platform,
    nodes: [
      { id: 'sp-id', label: 'Identity & Access', typeLabel: 'Keycloak', traits: ['Arch: Standalone', 'DB: Keycloak DB', 'Comm: OIDC/SAML'] },
      { id: 'sp-gw', label: 'API Gateway', typeLabel: 'Kong', traits: ['Arch: Standalone', 'Comm: REST', 'Events: RequestRouted'] },
      { id: 'sp-lar', label: 'Laravel Core Platform', typeLabel: 'Framework Base', traits: ['Arch: PHP/Octane', 'DB: PostgreSQL'] },
      { id: 'sp-frm', label: 'Shared Framework', typeLabel: 'Data primitives', traits: ['Arch: Core Library', 'Comm: Internal'] },
      { id: 'sp-wf', label: 'Workflow Engine', typeLabel: 'State Machines', traits: ['Arch: Core Module', 'DB: PostgreSQL', 'Events: StateChanged'] },
      { id: 'sp-evt', label: 'Event Backbone', typeLabel: 'Apache Kafka', traits: ['Arch: Standalone', 'Comm: TCP'] },
      { id: 'sp-app', label: 'Business Applications', typeLabel: 'HR Modules', traits: ['Arch: Packages', 'Deps: Shared Framework'] },
      { id: 'sp-inf', label: 'Infrastructure', typeLabel: 'Kubernetes', traits: ['Arch: EKS', 'Comm: Mesh'] }
    ]
  },
  {
    id: 'grp-ai', label: 'Next-Gen AI & Intelligence', color: COLORS.ai,
    nodes: [
      { id: 'ai-doc', label: 'Document AI', typeLabel: 'Python Service', traits: ['Arch: NLP Engine', 'DB: Vector DB', 'Comm: Kafka', 'Events: ResumeParsed'] },
      { id: 'ai-skill', label: 'Skills Intelligence', typeLabel: 'Graph DB', traits: ['Arch: Ontology', 'DB: Neo4j', 'Comm: gRPC', 'Events: SkillGapDetected'] },
      { id: 'ai-attr', label: 'Predictive Attrition', typeLabel: 'ML Model', traits: ['Arch: PyTorch', 'Comm: Scheduled', 'Deps: Analytics Engine'] },
      { id: 'ai-copilot', label: 'AI HR Copilot', typeLabel: 'LLM Gateway', traits: ['Arch: LangChain', 'Comm: WebSocket', 'Events: IntentResolved'] }
    ]
  }
];

export function buildTab2BackendLogicGraph(): { nodes: Node[]; edges: Edge[] } {
  const nodes: Node[] = [];
  const edges: Edge[] = [];

  function getOptimalCols(count: number) {
    if (count <= 2) return count;
    if (count === 4) return 2;
    return 3;
  }

  let currentY = START_Y;

  BACKEND_FLOWS.forEach((flow) => {
    const modCols = getOptimalCols(flow.nodes.length);
    const modRows = Math.ceil(flow.nodes.length / modCols);

    const gridW = modCols * TECH_W + (modCols - 1) * TECH_GAP_X;
    const gridH = modRows * TECH_H + (modRows - 1) * TECH_GAP_Y;
    
    const containerW = gridW + 80; // 40px padding on left/right
    const containerH = gridH + 120; // 80px top padding for title, 40px bottom

    // Container
    nodes.push({
      id: flow.id,
      type: 'domainGroup',
      position: { x: START_X, y: currentY },
      style: { width: containerW, height: containerH },
      zIndex: -1,
      data: {
        label: flow.label,
        description: 'Backend Flow',
      } as LayerNodeData,
    });

    flow.nodes.forEach((mod, idx) => {
      const col = idx % modCols;
      const row = Math.floor(idx / modCols);

      const nx = START_X + 40 + col * (TECH_W + TECH_GAP_X);
      const ny = currentY + 80 + row * (TECH_H + TECH_GAP_Y);
      
      nodes.push({
        id: mod.id,
        type: 'architecture',
        position: { x: nx, y: ny },
        data: {
          ...mod,
          color: flow.color,
          isTechNode: true,
          width: TECH_W,
          height: TECH_H
        } as ArchNodeData,
      });

      // Chain edges
      if (idx > 0) {
        const prevId = flow.nodes[idx - 1].id;
        edges.push({
          id: `e-${prevId}-${mod.id}`,
          source: prevId,
          target: mod.id,
          type: 'step',
          sourceHandle: 'right',
          targetHandle: 'left',
          style: { stroke: flow.color, strokeWidth: 3 },
          markerEnd: { type: 'arrowclosed', color: flow.color },
        });
      }
    });

    currentY += containerH + TECH_GAP_Y;
  });

  return { nodes, edges };
}
