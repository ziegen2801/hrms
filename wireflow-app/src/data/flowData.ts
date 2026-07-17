import type { Node, Edge } from '@xyflow/react';
import type { ArchNodeData, LayerNodeData } from '../types';

// ─── Layout Constants ───────────────────────────────────────────────
const BIZ_W = 380;
const BIZ_H = 480;
const BIZ_GAP_Y = 120;
const COL_W = 460; 
const START_X = 100;
const START_Y = 100;

const TECH_W = 240;
const TECH_H = 180;
const TECH_GAP_Y = 100;

// ─── Combined Data ───────────────────────────────────────────────
const COLORS = {
  recruit: '#F59E0B',  // Amber
  core: '#10B981',     // Emerald
  attend: '#0EA5E9',   // Sky Blue
  payroll: '#8B5CF6',  // Purple
  framework: '#4F46E5',// Indigo
  infra: '#334155'     // Slate
};

export const BUSINESS_DOMAINS = [
  {
    id: 'dom-recruit', label: 'Recruitment Domain', color: COLORS.recruit,
    chain: [
      { id: 'biz-req', label: 'Job Requisition', purpose: 'Define hiring needs and get budget approval.', features: ['Budget linking', 'Headcount tracking', 'JD templates'], screens: ['Requisition Form'], tech: { architecture: 'Domain Service', comm: 'REST', dependencies: ['Core HR'] } },
      { id: 'biz-post', label: 'Job Posting', purpose: 'Publish jobs to career portal.', features: ['Internal portal', 'External boards', 'Social sharing'], screens: ['Job Board'], tech: { architecture: 'Edge Service', comm: 'REST', dependencies: ['Gateway'] } },
      { id: 'biz-pipe', label: 'Candidate Pipeline', purpose: 'Track applicants through stages.', features: ['Kanban board', 'Drag & drop', 'Status emails'], screens: ['Pipeline Board'], tech: { architecture: 'Domain Service', comm: 'REST', dependencies: ['Workflow Engine'] } },
      { id: 'biz-screen', label: 'Resume Screening', purpose: 'Parse and rank resumes.', features: ['OCR parsing', 'Keyword matching', 'Auto-reject'], screens: ['Resume Viewer'], tech: { architecture: 'Python ML', comm: 'Kafka', dependencies: ['Object Storage'] } },
      { id: 'biz-interview', label: 'Interview Scheduling', purpose: 'Schedule and collect feedback.', features: ['Calendar sync', 'Scorecards', 'Video links'], screens: ['Interview Panel'], tech: { architecture: 'Domain Service', comm: 'REST', dependencies: ['Integration Hub'] } },
      { id: 'biz-offer', label: 'Offer Generation', purpose: 'Generate and send offer letters.', features: ['Mail merge', 'E-signature', 'Comp band check'], screens: ['Offer Builder'], tech: { architecture: 'Domain Service', comm: 'REST', dependencies: ['Workflow Engine'] } }
    ]
  },
  {
    id: 'dom-core', label: 'Core HR Domain', color: COLORS.core,
    chain: [
      { id: 'biz-profile', label: 'Employee Profile', purpose: 'Master record for employee identity.', features: ['Personal details', 'Emergency contacts', 'Bank details'], screens: ['Profile View'], tech: { architecture: 'Core Service', comm: 'gRPC', dependencies: ['Data Layer'] } },
      { id: 'biz-employ', label: 'Employment Status', purpose: 'Track probation, confirmation, and notices.', features: ['Probation tracker', 'Notice period calc', 'Resignation flow'], screens: ['Status Manager'], tech: { architecture: 'Domain Service', comm: 'REST', dependencies: ['Workflow Engine'] } },
      { id: 'biz-org', label: 'Organization & Hierarchy', purpose: 'Manage reporting lines and departments.', features: ['Visual org chart', 'Matrix reporting', 'Dept codes'], screens: ['Org Chart'], tech: { architecture: 'Domain Service', comm: 'REST', dependencies: ['Data Layer'] } },
      { id: 'biz-docs', label: 'HR Documents', purpose: 'Secure vault for employee documents.', features: ['Document tags', 'Expiry alerts', 'Access logs'], screens: ['Document Vault'], tech: { architecture: 'Domain Service', comm: 'REST', dependencies: ['Object Storage'] } },
      { id: 'biz-assets', label: 'Asset Management', purpose: 'Track laptops and physical assets.', features: ['Asset assignment', 'Return checklist', 'Damage reports'], screens: ['Asset Tracker'], tech: { architecture: 'Domain Service', comm: 'REST', dependencies: [] } },
      { id: 'biz-audit', label: 'Lifecycle Audit', purpose: 'Immutable ledger of all changes.', features: ['Change history', 'Before/After values', 'Timestamping'], tech: { architecture: 'Audit Engine', comm: 'Kafka', dependencies: ['Data Layer'] } }
    ]
  },
  {
    id: 'dom-attend', label: 'Attendance Domain', color: COLORS.attend,
    chain: [
      { id: 'biz-roster', label: 'Shift Rostering', purpose: 'Plan employee shifts and rotations.', features: ['Shift patterns', 'Conflict alerts', 'Bulk upload'], screens: ['Roster Planner'], tech: { architecture: 'Domain Service', comm: 'REST', dependencies: [] } },
      { id: 'biz-punch', label: 'Clock In / Out', purpose: 'Capture real-time attendance.', features: ['Web punch', 'Geo-fencing', 'Biometric sync'], screens: ['Time Clock'], tech: { architecture: 'Go Service', comm: 'REST', dependencies: ['Integration Hub'] } },
      { id: 'biz-regular', label: 'Regularization', purpose: 'Correct missed punches.', features: ['Manager approval', 'Auto-escalation', 'Comment thread'], screens: ['Requests Queue'], tech: { architecture: 'Domain Service', comm: 'REST', dependencies: ['Workflow Engine'] } },
      { id: 'biz-leave-req', label: 'Leave Request', purpose: 'Apply for time off.', features: ['Balance check', 'Holiday calendar', 'Attach medical certs'], screens: ['Leave Application'], tech: { architecture: 'Domain Service', comm: 'REST', dependencies: ['Workflow Engine'] } },
      { id: 'biz-leave-app', label: 'Leave Approval', purpose: 'Manager approval for leave.', features: ['Team calendar overlap', 'One-click approve', 'Delegation'], screens: ['Manager Approvals'], tech: { architecture: 'Domain Service', comm: 'REST', dependencies: ['Workflow Engine'] } }
    ]
  },
  {
    id: 'dom-payroll', label: 'Payroll Domain', color: COLORS.payroll,
    chain: [
      { id: 'biz-salary', label: 'Salary Structures', purpose: 'Define compensation components.', features: ['Basic/HRA config', 'Tax brackets', 'Allowances'], screens: ['Structure Builder'], tech: { architecture: 'Domain Service', comm: 'REST', dependencies: ['Data Layer'] } },
      { id: 'biz-deduct', label: 'Attendance Deductions', purpose: 'Calculate LOP based on attendance.', features: ['LOP calculation', 'Leave encashment', 'Arrears'], screens: ['Pre-Run Report'], tech: { architecture: 'Batch Job', comm: 'Kafka', dependencies: ['Attendance Domain'] } },
      { id: 'biz-tax', label: 'Tax Calculation', purpose: 'Apply statutory deductions.', features: ['Income tax calc', 'PF/ESI deductions', 'Declarations'], screens: ['Tax Simulator'], tech: { architecture: 'Domain Service', comm: 'REST', dependencies: [] } },
      { id: 'biz-payslip', label: 'Payslip Generation', purpose: 'Generate monthly PDF payslips.', features: ['PDF generation', 'Watermarking', 'Password protection'], tech: { architecture: 'Batch Engine', comm: 'REST', dependencies: ['Object Storage'] } },
      { id: 'biz-bank', label: 'Bank Transfer', purpose: 'Generate bank-specific payout files.', features: ['Batch file format', 'Checksum validation', 'Approval lock'], screens: ['Bank Export'], tech: { architecture: 'Domain Service', comm: 'REST', dependencies: [] } }
    ]
  }
];

export const TECH_LAYERS = [
  {
    id: 'layer-fw', label: 'Shared Platform Framework', description: 'Core Laravel primitives inherited by all business apps.', color: COLORS.framework,
    nodes: [
      { id: 'tech-data', label: 'Generic Data Layer', typeLabel: 'Core Primitive', traits: ['Multi-tenant Scoping', 'Soft Deletes'] },
      { id: 'tech-views', label: 'Metadata Views', typeLabel: 'Core Primitive', traits: ['List/Form Engine', 'Kanban Engine'] },
      { id: 'tech-wf', label: 'Workflow Engine', typeLabel: 'Core Primitive', traits: ['State Machines', 'Approvals'] },
      { id: 'tech-rbac', label: 'Access Control', typeLabel: 'Core Primitive', traits: ['RBAC', 'Record-level Security'] },
      { id: 'tech-lowcode', label: 'Low-Code Studio', typeLabel: 'Core Primitive', traits: ['Custom Fields', 'Automations'] }
    ]
  },
  {
    id: 'layer-infra', label: 'Infrastructure & Backend Services', description: 'The foundation powering the platform.', color: COLORS.infra,
    nodes: [
      { id: 'tech-gw', label: 'API Gateway & Auth', typeLabel: 'Kong + Keycloak', traits: ['Routing', 'SAML/OIDC', 'Rate Limiting'] },
      { id: 'tech-kafka', label: 'Event Backbone', typeLabel: 'Apache Kafka', traits: ['Async Messaging', 'Pub/Sub'] },
      { id: 'tech-db', label: 'Transactional DB', typeLabel: 'PostgreSQL', traits: ['Tenant Databases', 'System of Record'] },
      { id: 'tech-ml', label: 'Intelligent Services', typeLabel: 'Python / ML', traits: ['Resume Parsing', 'Anomaly Detection'] },
      { id: 'tech-rt', label: 'High-Throughput Services', typeLabel: 'Go Services', traits: ['Device Ingestion', 'WebSockets'] },
      { id: 'tech-olap', label: 'Data Platform', typeLabel: 'ClickHouse + MinIO', traits: ['Analytics', 'Object Storage'] }
    ]
  }
];

export function buildFlowGraph(): { nodes: Node[]; edges: Edge[] } {
  const nodes: Node[] = [];
  const edges: Edge[] = [];
  
  let maxBizY = 0;
  const numBizCols = BUSINESS_DOMAINS.length;
  const totalBizWidth = numBizCols * COL_W;

  // 1. Render Business Domains (Columns)
  BUSINESS_DOMAINS.forEach((domain, colIdx) => {
    const startX = START_X + (colIdx * COL_W);
    const domainH = domain.chain.length * (BIZ_H + BIZ_GAP_Y) + 100;
    if (domainH > maxBizY) maxBizY = domainH;

    // Domain Background Container
    nodes.push({
      id: domain.id,
      type: 'domainGroup',
      position: { x: startX - 40, y: START_Y - 80 },
      style: { width: BIZ_W + 80, height: domainH },
      zIndex: -1,
      data: {
        label: domain.label,
        description: 'Business Workflow',
      } as LayerNodeData,
    });

    // Business Nodes in Chain
    domain.chain.forEach((bizNode, rowIdx) => {
      const ny = START_Y + rowIdx * (BIZ_H + BIZ_GAP_Y);
      
      nodes.push({
        id: bizNode.id,
        type: 'architecture',
        position: { x: startX, y: ny },
        data: {
          ...bizNode,
          color: domain.color,
          isTechNode: false
        } as ArchNodeData,
      });

      // Connect to previous in chain
      if (rowIdx > 0) {
        const prevNode = domain.chain[rowIdx - 1];
        edges.push({
          id: `e-${prevNode.id}-${bizNode.id}`,
          source: prevNode.id,
          target: bizNode.id,
          type: 'step',
          style: { stroke: domain.color, strokeWidth: 3 },
          markerEnd: { type: 'arrowclosed', color: domain.color },
        });
      }
    });
  });

  // Cross-domain connections
  edges.push({
    id: 'e-biz-offer-biz-profile',
    source: 'biz-offer', sourceHandle: 'right',
    target: 'biz-profile', targetHandle: 'left',
    type: 'step',
    style: { stroke: '#94A3B8', strokeWidth: 3, strokeDasharray: '6,6' },
    markerEnd: { type: 'arrowclosed', color: '#94A3B8' },
  });

  edges.push({
    id: 'e-biz-employ-biz-roster',
    source: 'biz-employ', sourceHandle: 'right',
    target: 'biz-roster', targetHandle: 'left',
    type: 'step',
    style: { stroke: '#94A3B8', strokeWidth: 3, strokeDasharray: '6,6' },
    markerEnd: { type: 'arrowclosed', color: '#94A3B8' },
  });

  edges.push({
    id: 'e-biz-leave-app-biz-deduct',
    source: 'biz-leave-app', sourceHandle: 'right',
    target: 'biz-deduct', targetHandle: 'left',
    type: 'step',
    style: { stroke: '#94A3B8', strokeWidth: 3, strokeDasharray: '6,6' },
    markerEnd: { type: 'arrowclosed', color: '#94A3B8' },
  });


  // 2. Render Tech Layers (Horizontal)
  let currentY = START_Y + maxBizY + 100;
  const techLayerW = totalBizWidth;

  TECH_LAYERS.forEach((layer) => {
    const rows = Math.ceil(layer.nodes.length / 4);
    const layerH = rows * (TECH_H + TECH_GAP_Y) + 120;

    nodes.push({
      id: layer.id,
      type: 'domainGroup',
      position: { x: START_X - 40, y: currentY },
      style: { width: techLayerW, height: layerH },
      zIndex: -1,
      data: {
        label: layer.label,
        description: layer.description,
      } as LayerNodeData,
    });

    const innerSpacing = techLayerW / (Math.min(layer.nodes.length, 4) + 1);

    layer.nodes.forEach((techNode, tIdx) => {
      const col = tIdx % 4;
      const row = Math.floor(tIdx / 4);
      
      const nx = START_X - 40 + innerSpacing * (col + 1) - (TECH_W / 2);
      const ny = currentY + 100 + row * (TECH_H + TECH_GAP_Y);

      nodes.push({
        id: techNode.id,
        type: 'architecture',
        position: { x: nx, y: ny },
        data: {
          ...techNode,
          color: layer.color,
          isTechNode: true
        } as ArchNodeData,
      });
    });

    currentY += layerH + 100;
  });

  // Connect Business down to Framework
  edges.push({ id: 'e-biz-audit-tech-data', source: 'biz-audit', target: 'tech-data', type: 'step', style: { stroke: '#CBD5E1', strokeWidth: 2, strokeDasharray: '4,4' } });
  edges.push({ id: 'e-biz-bank-tech-wf', source: 'biz-bank', target: 'tech-wf', type: 'step', style: { stroke: '#CBD5E1', strokeWidth: 2, strokeDasharray: '4,4' } });
  
  // Connect Framework down to Infra
  edges.push({ id: 'e-tech-wf-tech-kafka', source: 'tech-wf', target: 'tech-kafka', type: 'step', style: { stroke: '#CBD5E1', strokeWidth: 2 } });
  edges.push({ id: 'e-tech-data-tech-db', source: 'tech-data', target: 'tech-db', type: 'step', style: { stroke: '#CBD5E1', strokeWidth: 2 } });
  edges.push({ id: 'e-tech-rbac-tech-gw', source: 'tech-rbac', target: 'tech-gw', type: 'step', style: { stroke: '#CBD5E1', strokeWidth: 2 } });

  return { nodes, edges };
}
