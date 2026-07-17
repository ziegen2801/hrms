import type { Node, Edge } from '@xyflow/react';
import type { ArchNodeData, LayerNodeData } from '../types';

const NODE_W = 380;
const NODE_H = 340; // Shorter height since no tech footer is needed here to match PDF purely
const GAP_X = 60;
const GAP_Y = 60;
const START_X = 100;
const START_Y = 100;

const COLORS = {
  platform: '#F59E0B',
  super: '#8B5CF6',
  hr: '#3B82F6',
  payroll: '#10B981',
  manager: '#0EA5E9',
  employee: '#F43F5E',
  candidate: '#F97316',
  arch: '#EAB308',
  workflow: '#84CC16',
  cross: '#EAB308'
};

const PDF_STRUCTURE = [
  {
    role: { id: 'r-super', label: 'Super Admin', color: COLORS.super, desc: 'Related to Super Admin operations' },
    rows: [
      [
        { id: 'sa-1', label: 'Admin Console', related: 'Super Admin', purpose: 'Module enablement per tenant, Tenant admin configuration', features: [] },
        { id: 'sa-2', label: 'Policy Engine', related: 'Super Admin', purpose: 'Attendance rules, Leave rules, Visible precedence eg - dept > individual', features: [] },
        { id: 'sa-3', label: 'Global Leave Config', related: 'Super Admin', purpose: 'Final intake & category, Designation / classification mapping', features: [] }
      ],
      [
        { id: 'sa-4', label: 'Global Leave Policy', related: 'Super Admin', purpose: 'Shift timing & minimum hours, Leave / Regularization window, Leave lapse, encash, carry forward, overrides', features: [] },
        { id: 'sa-5', label: 'Offer Approval', related: 'Super Admin', purpose: 'Offer approval - Compensation band mismatch, Offer accepted, declined, sent, dropped, declined', features: [] },
        { id: 'sa-6', label: 'Template Library', related: 'Super Admin', purpose: 'Template library - Merge field setup', features: [] }
      ],
      [
        { id: 'sa-7', label: 'Payroll & Compensation Oversight', related: 'Super Admin', purpose: 'Budget allocation - Increment & variable', features: [] },
        { id: 'sa-8', label: 'Rewards Program Config', related: 'Super Admin', purpose: 'Budget allocation - Point System - Department budget limits', features: [] },
        { id: 'sa-9', label: 'Reports & People Analytics', related: 'Super Admin', purpose: 'Global usage insights, Peer scoped dashboard', features: [] }
      ],
      [
        { id: 'sa-10', label: 'Workforce & Position Oversight', related: 'Super Admin', purpose: 'Position management, Headcount budget approval, Org design sandbox', features: [] },
        { id: 'sa-11', label: 'Performance Oversight', related: 'Super Admin', purpose: 'Performance cycles & metrics, Skills / competency framework', features: [] },
        { id: 'sa-12', label: 'Employee Lifecycle Oversight', related: 'Super Admin', purpose: 'Active / inactive pending directory, Audit validity, Document compliance', features: [] }
      ]
    ]
  },
  {
    role: { id: 'r-hr', label: 'HR Admin', color: COLORS.hr, desc: 'Related to Day to day HR operations including recruitment, people, documents, and lifecycle' },
    rows: [
      [
        { id: 'hr-1', label: 'Career Page Management', related: 'HR Admin', purpose: 'Create / edit / publish job postings', features: [] },
        { id: 'hr-2', label: 'Recruitment & Interview', related: 'HR Admin', purpose: 'Application stages (New - HR, HM Review pipeline channel), Resume parse / auto-fill, Interview panel assignment & schedule (calendar sync), Rejection / conflict handling / feedback', features: [] },
        { id: 'hr-3', label: 'Offer Management', related: 'HR Admin', purpose: 'Draft from selected candidate, Offer page with ctc, Approval flow - compensation band validation', features: [] }
      ],
      [
        { id: 'hr-4', label: 'Requisition - Employee Conversion', related: 'HR Admin', purpose: 'Accepted offer -> conversion, Assign reporting line &, Onboarding profile, Onboarding handoff', features: [] },
        { id: 'hr-5', label: 'Recruitment Reports', related: 'HR Admin', purpose: 'Yield - source performance - time to hire, Requisition -> candidate exports', features: [] },
        { id: 'hr-6', label: 'Onboarding', related: 'HR Admin', purpose: 'Pre-joining checklist, Document collection & verification, Day 1 orientation planning, Induction schedule & policy acknowledgement', features: [] }
      ],
      [
        { id: 'hr-7', label: 'Confirmation / Probation', related: 'HR Admin', purpose: 'Probation tracker - Manager recommendation - HR sign-off / extend, Confirmation schedule - HR alert - Confirmation letter issue', features: [] },
        { id: 'hr-8', label: 'Employee Profile & Org View', related: 'HR Admin', purpose: 'Full data directory search, filter, sort, export, Employee record modification (correction, updates), Org chart / reporting lines', features: [] },
        { id: 'hr-9', label: 'HR Help Desk', related: 'HR Admin', purpose: 'Ticket queue, status, SLA countdown - Category filter, Re-assign ticket (re-route categorization)', features: [] }
      ],
      [
        { id: 'hr-10', label: 'HR Documents & Signature', related: 'HR Admin', purpose: 'Template library - Generate, preview, send, pin, download, Issued document log - E-signature request / status', features: [] },
        { id: 'hr-11', label: 'Employee Benefits', related: 'HR Admin', purpose: 'Enrollment / eligibility tracking, Benefit claim approval', features: [] },
        { id: 'hr-12', label: 'Engagement, Surveys & NPS', related: 'HR Admin', purpose: 'Survey results (anonymity threshold) - Announcements / Noticeboard, Pulse survey management', features: [] }
      ],
      [
        { id: 'hr-13', label: 'Reports & People Analytics', related: 'HR Admin', purpose: 'Standard reports - Custom report builder - Recurring email delivery', features: [] },
        { id: 'hr-14', label: 'Travel & Expense Oversight', related: 'HR Admin', purpose: 'Pending claims dashboard - compliance flags - Payroll handoff', features: [] },
        { id: 'hr-15', label: 'Exit & Separation', related: 'HR Admin', purpose: 'Full / partial / resignation / notice tracking, Clearance & assets recovery - Full and final handoff - Repro', features: [] }
      ]
    ]
  },
  {
    role: { id: 'r-pay', label: 'Payroll Admin', color: COLORS.payroll, desc: 'Related to Restricted compensation and payroll operations' },
    rows: [
      [
        { id: 'pa-1', label: 'Payroll & Compensation', related: 'Payroll Admin', purpose: 'Salary structure setup, Tax declarations, Reimbursement input, LOP, process, lock, Pay slip generate', features: [] },
        { id: 'pa-2', label: 'Tax & Statutory', related: 'Payroll Admin', purpose: 'Investment declarations & proof verification - Statutory filing controls', features: [] },
        { id: 'pa-3', label: 'Compensation & Increment', related: 'Payroll Admin', purpose: 'Compensation / Increment cycle - Performance linked increment routing', features: [] }
      ],
      [
        { id: 'pa-4', label: 'Expense & Reimbursement', related: 'Payroll Admin', purpose: 'Approved reimbursement queue - Disbursed mark batch - Policy override', features: [] },
        { id: 'pa-5', label: 'Payroll Reports', related: 'Payroll Admin', purpose: 'Payroll cost - Pay-run history - Statutory compliance exports - Variance', features: [] },
        { id: 'pa-6', label: 'Full & Final Settlement', related: 'Payroll Admin', purpose: 'Final dues calculation from exit clearance', features: [] }
      ]
    ]
  },
  {
    role: { id: 'r-mgr', label: 'Manager', color: COLORS.manager, desc: 'Related to Team oversight, approvals, attendance, performance, and lifecycle' },
    rows: [
      [
        { id: 'mg-1', label: 'Recruitment (Team)', related: 'Manager', purpose: 'Requisition request - Candidate review - Interview feedback, Probation review / recommendation', features: [] },
        { id: 'mg-2', label: 'Team Profile & Org View', related: 'Manager', purpose: 'Team directory - Scoped search & filter, Profile - attendance status - org chart', features: [] },
        { id: 'mg-3', label: 'Attendance & Shift', related: 'Manager', purpose: 'Roster / schedule - Exception review / regularization, Shift roster - shift swap approvals', features: [] }
      ],
      [
        { id: 'mg-4', label: 'Leave Approvals', related: 'Manager', purpose: 'Pending approvals - Team calendar overlap, Balance visibility - Approve / reject / comment', features: [] },
        { id: 'mg-5', label: 'HR Help Desk (Team)', related: 'Manager', purpose: 'View / escalated tickets, Escalation response', features: [] },
        { id: 'mg-6', label: 'Travel & Expense', related: 'Manager', purpose: 'Review expense claim - Payroll/reimbursement handoff', features: [] }
      ],
      [
        { id: 'mg-7', label: 'Performance & Talent', related: 'Manager', purpose: 'Goals / OKRs - quarterly review - 360 feedback - Manager rating, Succession recommendations', features: [] },
        { id: 'mg-8', label: 'Exit & Separation', related: 'Manager', purpose: 'Resignation recommendation / acceptance - Notice waiver, Clearance & asset return sign-off', features: [] },
        { id: 'mg-9', label: 'Team Reports', related: 'Manager', purpose: 'Team attendance, leave, performance, lifecycle summaries', features: [] }
      ]
    ]
  },
  {
    role: { id: 'r-emp', label: 'Employee', color: COLORS.employee, desc: 'Related to Self-service HR for user request, requests, and payroll views' },
    rows: [
      [
        { id: 'em-1', label: 'Onboarding (Self)', related: 'Employee', purpose: 'Pre-joining checklist - Induction schedule', features: [] },
        { id: 'em-2', label: 'Home & Profile', related: 'Employee', purpose: 'User profile - personal / employment / documents (compliance alert), Profile update request', features: [] },
        { id: 'em-3', label: 'Attendance & Shifts', related: 'Employee', purpose: 'Punch in / out - timesheets - attendance calendar, Regularization request (X-day buffer) - Shift roster / swap request', features: [] }
      ],
      [
        { id: 'em-4', label: 'Leave Request', related: 'Employee', purpose: 'Leave balance - Application history - Approve/leave view', features: [] },
        { id: 'em-5', label: 'HR Help Desk', related: 'Employee', purpose: 'Raise ticket - View ticket - Ticket status - reopen', features: [] },
        { id: 'em-6', label: 'Documents & E-Signature', related: 'Employee', purpose: 'Sign pending documents, Document verification, Requesting documents', features: [] }
      ],
      [
        { id: 'em-7', label: 'Employee Benefits', related: 'Employee', purpose: 'Benefits catalogue - enrollment - dependents - Claim reimbursement limit', features: [] },
        { id: 'em-8', label: 'Travel & Expense', related: 'Employee', purpose: 'Travel request - Receipt backed expense claim, Policy warnings - claim status', features: [] },
        { id: 'em-9', label: 'Rewards', related: 'Employee', purpose: 'Colleague nomination - Recognition feed - Points / badges leaderboard', features: [] }
      ],
      [
        { id: 'em-10', label: 'Engagement & Surveys', related: 'Employee', purpose: 'Pulse surveys - Discussion groups', features: [] },
        { id: 'em-11', label: 'Performance (Self)', related: 'Employee', purpose: 'Goals / OKRs - self-review - 360 peer feedback, 1-on-1s / check-ins log', features: [] },
        { id: 'em-12', label: 'Payroll Self-Service', related: 'Employee', purpose: 'Payslips - Tax declarations / proofs - Reimbursement status', features: [] }
      ],
      [
        { id: 'em-13', label: 'Lifecycle (Self)', related: 'Employee', purpose: 'Resignation / separation - Clearance tasks - exit interview', features: [] }
      ]
    ]
  },
  {
    role: { id: 'r-cand', label: 'Candidate', color: COLORS.candidate, desc: 'Related to Public, unauthenticated career and application experience' },
    rows: [
      [
        { id: 'cd-1', label: 'Public Career Portal', related: 'Candidate', purpose: 'Search / filter / browse jobs, Register / profile / resume drop, Job detail - Apply', features: [] },
        { id: 'cd-2', label: 'Candidate Registration', related: 'Candidate', purpose: 'Profile setup - Resume parsing / manual entry, Profile completeness indicator - multiple applications', features: [] },
        { id: 'cd-3', label: 'Application Flow', related: 'Candidate', purpose: 'Application form - supporting docs - portfolio / links, Draft save - submit confirmation, Status view -> applied -> screened -> interview -> offer -> hire, Interview & offer notifications', features: [] }
      ],
      [
        { id: 'cd-4', label: 'Public Document Verify', related: 'Candidate', purpose: 'Document upload via secure link (visa, employee forms, identity)', features: [] }
      ]
    ]
  }
];

export function buildTab1EnterpriseGraph(): { nodes: Node[]; edges: Edge[] } {
  const nodes: Node[] = [];
  const edges: Edge[] = [];

  function getOptimalCols(count: number) {
    if (count <= 2) return count;
    if (count === 4) return 2;
    return 3;
  }

  // 1. Core Platform
  const coreNodes = [
    { id: 'cn-1', label: 'Login', purpose: 'Employee login via SSO / email' },
    { id: 'cn-2', label: 'Authentication', purpose: 'JWT session management' },
    { id: 'cn-3', label: 'Authorization', purpose: 'Role-based access checks' },
    { id: 'cn-4', label: 'RBAC Roles', purpose: 'System role definitions' },
    { id: 'cn-5', label: 'Roles', purpose: 'Super Admin, HR Admin, Employee, Candidate' }
  ];
  
  const coreCols = getOptimalCols(coreNodes.length);
  const coreRows = Math.ceil(coreNodes.length / coreCols);
  const coreW = coreCols * NODE_W + (coreCols - 1) * GAP_X + 80;
  const coreH = coreRows * NODE_H + (coreRows - 1) * GAP_Y + 120; // 120 for header padding

  nodes.push({
    id: 'grp-core',
    type: 'domainGroup',
    position: { x: START_X, y: START_Y },
    style: { width: coreW, height: coreH },
    zIndex: -1,
    data: { label: 'Core Platform Services', description: 'Shared framework elements' } as LayerNodeData,
  });

  coreNodes.forEach((cn, i) => {
    const col = i % coreCols;
    const row = Math.floor(i / coreCols);
    nodes.push({
      id: cn.id,
      type: 'architecture',
      position: { x: START_X + 40 + col * (NODE_W + GAP_X), y: START_Y + 80 + row * (NODE_H + GAP_Y) },
      data: { ...cn, color: COLORS.platform, isTechNode: true, typeLabel: 'Core Service', width: NODE_W, height: NODE_H } as ArchNodeData,
    });
  });

  let currentY = START_Y + coreH + GAP_Y;

  // 2. Roles and Modules
  PDF_STRUCTURE.forEach((roleBlock) => {
    const roleId = roleBlock.role.id;
    const roleColor = roleBlock.role.color;

    const modules = roleBlock.rows.flat();
    const modCols = getOptimalCols(modules.length);
    const modRows = Math.ceil(modules.length / modCols);

    // Layout: Role node is on the left, Modules are on the right.
    const roleNodeX = START_X + 40;
    const roleNodeY = currentY + 80;
    
    // Calculate total height needed. Either the role node height, or the modules grid height.
    const gridH = modRows * NODE_H + (modRows - 1) * GAP_Y;
    const contentH = Math.max(NODE_H, gridH);
    const containerH = contentH + 120;
    
    const gridW = modCols * NODE_W + (modCols - 1) * GAP_X;
    const containerW = 40 + NODE_W + GAP_X + gridW + 40;

    // Domain Container
    nodes.push({
      id: `grp-${roleId}`,
      type: 'domainGroup',
      position: { x: START_X, y: currentY },
      style: { width: containerW, height: containerH },
      zIndex: -1,
      data: { label: `${roleBlock.role.label} Domain`, description: 'Business Area' } as LayerNodeData
    });

    // Role Node
    nodes.push({
      id: roleId,
      type: 'architecture',
      position: { x: roleNodeX, y: roleNodeY }, // top aligned with the first module row
      data: {
        label: roleBlock.role.label,
        purpose: roleBlock.role.desc,
        color: roleColor,
        isTechNode: false,
        typeLabel: 'ROLE',
        width: NODE_W,
        height: NODE_H
      } as ArchNodeData,
    });

    // Modules
    const modStartX = roleNodeX + NODE_W + GAP_X;
    modules.forEach((mod, idx) => {
      const col = idx % modCols;
      const row = Math.floor(idx / modCols);
      
      const mx = modStartX + col * (NODE_W + GAP_X);
      const my = currentY + 80 + row * (NODE_H + GAP_Y);

      nodes.push({
        id: mod.id,
        type: 'architecture',
        position: { x: mx, y: my },
        data: {
          label: mod.label,
          purpose: mod.purpose,
          color: roleColor,
          isTechNode: false,
          width: NODE_W,
          height: NODE_H
        } as ArchNodeData,
      });

      // Edge from Role to first col, or prev col to this col
      if (col === 0) {
        edges.push({
          id: `e-${roleId}-${mod.id}`, source: roleId, target: mod.id, type: 'step', sourceHandle: 'right', targetHandle: 'left',
          style: { stroke: roleColor, strokeWidth: 2 }, markerEnd: { type: 'arrowclosed', color: roleColor }
        });
      } else {
        const prevId = modules[idx - 1].id;
        edges.push({
          id: `e-${prevId}-${mod.id}`, source: prevId, target: mod.id, type: 'step', sourceHandle: 'right', targetHandle: 'left',
          style: { stroke: roleColor, strokeWidth: 2 }, markerEnd: { type: 'arrowclosed', color: roleColor }
        });
      }
    });

    currentY += containerH + GAP_Y;
  });

  // Cross-Module Lifecycle Connectors
  const crossEdges = [
    { source: 'hr-2', target: 'hr-6', id: 'xc-1' },
    { source: 'hr-6', target: 'hr-8', id: 'xc-2' },
    { source: 'hr-8', target: 'em-3', id: 'xc-3' },
    { source: 'em-3', target: 'em-4', id: 'xc-4' },
    { source: 'em-4', target: 'pa-1', id: 'xc-5' },
    { source: 'pa-1', target: 'pa-5', id: 'xc-6' }
  ];

  crossEdges.forEach(ce => {
    edges.push({
      id: ce.id,
      source: ce.source,
      target: ce.target,
      type: 'step',
      sourceHandle: 'bottom',
      targetHandle: 'top',
      style: { stroke: COLORS.cross, strokeWidth: 3, strokeDasharray: '6,6' },
      markerEnd: { type: 'arrowclosed', color: COLORS.cross },
      animated: true
    });
  });

  return { nodes, edges };
}

