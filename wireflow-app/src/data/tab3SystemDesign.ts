import type { Node, Edge } from '@xyflow/react';
import type { ArchNodeData } from '../types';

const COLORS = {
  client: '#0EA5E9',    // Sky
  edge: '#8B5CF6',      // Purple
  identity: '#EC4899',  // Pink
  platform: '#F59E0B',  // Amber
  business: '#3B82F6',  // Blue
  event: '#14B8A6',     // Teal
  data: '#10B981',      // Emerald
  ai: '#F43F5E',        // Rose
  obs: '#6366F1',       // Indigo
  infra: '#64748B',     // Slate
  sync: '#94A3B8',      // Solid
  async: '#F59E0B',     // Dashed (Event)
  telemetry: '#6366F1'  // Dotted (Monitoring)
};

export function buildTab3SystemDesignGraph(): { nodes: Node[]; edges: Edge[] } {
  const nodes: Node[] = [];
  const edges: Edge[] = [];

  const addNode = (id: string, label: string, typeLabel: string, x: number, y: number, color: string, w: number = 240, h: number = 140, traits?: string[]) => {
    nodes.push({
      id, type: 'architecture', position: { x, y },
      data: { label, typeLabel, color, isTechNode: true, width: w, height: h, traits } as ArchNodeData
    });
  };

  const addEdge = (source: string, target: string, type: 'sync' | 'async' | 'telemetry', sHandle: string = 'bottom', tHandle: string = 'top') => {
    const isAsync = type === 'async';
    const isTelemetry = type === 'telemetry';
    const color = isAsync ? COLORS.async : (isTelemetry ? COLORS.telemetry : COLORS.sync);
    const dash = isAsync ? '6,6' : (isTelemetry ? '2,4' : undefined);

    edges.push({
      id: `e-${source}-${target}-${type}`, source, target, type: 'step', sourceHandle: sHandle, targetHandle: tHandle,
      style: { stroke: color, strokeWidth: isTelemetry ? 2 : 3, strokeDasharray: dash },
      markerEnd: { type: 'arrowclosed', color },
      animated: isAsync || isTelemetry
    });
  };

  const CENTER_X = 1200;

  // --- 1. CLIENT LAYER (Top) ---
  addNode('c-web', 'Web App', 'React SPA', CENTER_X - 600, 100, COLORS.client);
  addNode('c-mob', 'Mobile App', 'iOS / Android', CENTER_X - 300, 100, COLORS.client);
  addNode('c-adm', 'Admin Portal', 'React SPA', CENTER_X, 100, COLORS.client);
  addNode('c-car', 'Career Portal', 'Public Facing', CENTER_X + 300, 100, COLORS.client);
  addNode('c-api', 'Third Party APIs', 'Integrations', CENTER_X + 600, 100, COLORS.client);

  // --- 2. EDGE LAYER (Central Flow) ---
  addNode('e-cdn', 'Cloudflare CDN', 'Content Delivery', CENTER_X, 260, COLORS.edge);
  addNode('e-waf', 'WAF', 'Security', CENTER_X, 420, COLORS.edge);
  addNode('e-lb', 'Load Balancer', 'L7 Routing', CENTER_X, 580, COLORS.edge);
  addNode('e-gw', 'Kong API Gateway', 'Gateway', CENTER_X, 740, COLORS.edge);

  // Client to CDN
  ['c-web', 'c-mob', 'c-adm', 'c-car', 'c-api'].forEach(c => addEdge(c, 'e-cdn', 'sync', 'bottom', 'top'));
  
  // Edge flow
  addEdge('e-cdn', 'e-waf', 'sync', 'bottom', 'top');
  addEdge('e-waf', 'e-lb', 'sync', 'bottom', 'top');
  addEdge('e-lb', 'e-gw', 'sync', 'bottom', 'top');

  // --- 3. IDENTITY & CORE PLATFORM ---
  addNode('i-kc', 'Keycloak', 'Identity / OIDC', CENTER_X, 900, COLORS.identity);
  addNode('p-core', 'Shared Laravel Platform', 'Core Framework', CENTER_X, 1060, COLORS.platform, 300, 140);
  
  // Platform shared engines orbiting the core
  addNode('p-wf', 'Workflow Engine', 'Shared Service', CENTER_X - 350, 1060, COLORS.platform);
  addNode('p-notif', 'Notification Engine', 'Shared Service', CENTER_X + 350, 1060, COLORS.platform);
  addNode('p-aud', 'Audit Engine', 'Shared Service', CENTER_X - 700, 1060, COLORS.platform);
  addNode('p-meta', 'Metadata Engine', 'Shared Service', CENTER_X + 700, 1060, COLORS.platform);

  addEdge('e-gw', 'i-kc', 'sync', 'bottom', 'top');
  addEdge('i-kc', 'p-core', 'sync', 'bottom', 'top');
  addEdge('p-core', 'p-wf', 'sync', 'left', 'right');
  addEdge('p-core', 'p-notif', 'sync', 'right', 'left');
  addEdge('p-wf', 'p-aud', 'sync', 'left', 'right');
  addEdge('p-notif', 'p-meta', 'sync', 'right', 'left');

  // --- 4. MICROSERVICES CLUSTER (Orbiting Below Core) ---
  const msY1 = 1260;
  const msY2 = 1440;
  
  addNode('b-lev', 'Leave', 'Microservice', CENTER_X - 600, msY1, COLORS.business);
  addNode('b-att', 'Attendance', 'Microservice', CENTER_X - 300, msY1, COLORS.business);
  addNode('b-emp', 'Employee', 'Microservice', CENTER_X, msY1, COLORS.business);
  addNode('b-pay', 'Payroll', 'Microservice', CENTER_X + 300, msY1, COLORS.business);
  addNode('b-rec', 'Recruitment', 'Microservice', CENTER_X + 600, msY1, COLORS.business);

  addNode('b-perf', 'Performance', 'Microservice', CENTER_X - 600, msY2, COLORS.business);
  addNode('b-ben', 'Benefits', 'Microservice', CENTER_X - 300, msY2, COLORS.business);
  addNode('b-rep', 'Reports', 'Microservice', CENTER_X, msY2, COLORS.business);
  addNode('b-doc', 'Documents', 'Microservice', CENTER_X + 300, msY2, COLORS.business);
  addNode('b-hlp', 'Help Desk', 'Microservice', CENTER_X + 600, msY2, COLORS.business);

  // Connect platform to microservices
  ['b-lev', 'b-att', 'b-emp', 'b-pay', 'b-rec'].forEach(ms => addEdge('p-core', ms, 'sync', 'bottom', 'top'));
  
  // For the second row, connect them to the first row conceptually or directly from platform
  ['b-perf', 'b-ben'].forEach(ms => addEdge('p-core', ms, 'sync', 'bottom', 'left'));
  ['b-doc', 'b-hlp'].forEach(ms => addEdge('p-core', ms, 'sync', 'bottom', 'right'));
  addEdge('p-core', 'b-rep', 'sync', 'bottom', 'right');

  // --- 5. DATA LAYER (Beneath Microservices) ---
  const dbY = 1640;
  
  addNode('d-pg1', 'PostgreSQL', 'Tenant Data', CENTER_X, dbY, COLORS.data);
  addEdge('b-emp', 'd-pg1', 'sync', 'bottom', 'top');

  addNode('d-red', 'Redis', 'Session / Cache', CENTER_X - 300, dbY, COLORS.data);
  addEdge('b-att', 'd-red', 'sync', 'bottom', 'top');
  
  addNode('d-pg2', 'PostgreSQL', 'Payroll Data', CENTER_X + 300, dbY, COLORS.data);
  addEdge('b-pay', 'd-pg2', 'sync', 'bottom', 'top');

  addNode('d-min', 'MinIO', 'Object Storage', CENTER_X + 600, dbY, COLORS.data);
  addEdge('b-doc', 'd-min', 'sync', 'bottom', 'top');

  addNode('d-ch1', 'ClickHouse', 'Analytics DB', CENTER_X - 600, dbY, COLORS.data);
  addEdge('b-rep', 'd-ch1', 'sync', 'bottom', 'top');

  // --- 6. EVENT BACKBONE (Kafka) ---
  const kY = 1840;
  addNode('v-kaf', 'Apache Kafka', 'Event Backbone', CENTER_X - 600, kY, COLORS.event, 1440, 120);

  // Publishers to Kafka
  ['b-emp', 'b-lev', 'b-att', 'b-pay', 'b-rec', 'b-perf'].forEach(ms => addEdge(ms, 'v-kaf', 'async', 'bottom', 'top'));

  // --- 7. ASYNC WORKERS (Below Kafka) ---
  const wY = 2040;
  addNode('w-mail', 'Email Queue', 'Worker', CENTER_X - 300, wY, COLORS.business);
  addNode('w-pay', 'Payroll Proc', 'Worker', CENTER_X, wY, COLORS.business);
  addNode('w-doc', 'Doc Processor', 'Worker', CENTER_X + 300, wY, COLORS.business);
  addNode('p-not', 'Notification Service', 'Worker', CENTER_X + 600, wY, COLORS.platform);

  ['w-mail', 'w-pay', 'w-doc', 'p-not'].forEach(w => addEdge('v-kaf', w, 'async', 'bottom', 'top'));

  // --- 8. AI PLATFORM (Left Flank) ---
  const aiX = 100;
  addNode('a-cop', 'HR Copilot', 'LLM Agent', aiX, 1260, COLORS.ai);
  addNode('a-res', 'Resume Intel', 'Parsing', aiX, 1440, COLORS.ai);
  addNode('a-vec', 'Vector DB', 'Embeddings', aiX, 1620, COLORS.data);
  
  addEdge('a-cop', 'a-vec', 'sync', 'bottom', 'top');
  addEdge('a-res', 'a-vec', 'sync', 'bottom', 'top');
  addEdge('v-kaf', 'a-cop', 'async', 'left', 'right');
  addEdge('v-kaf', 'a-res', 'async', 'left', 'right');

  // --- 9. ANALYTICS CLUSTER (Right Flank) ---
  const anX = 2300;
  addNode('a-dash', 'BI Dashboards', 'Visualization', anX, 1260, COLORS.ai);
  addNode('a-pred', 'Predictive ML', 'Analytics', anX, 1440, COLORS.ai);
  addNode('d-os', 'OpenSearch', 'Global Search', anX, 1620, COLORS.data);

  addEdge('v-kaf', 'd-os', 'async', 'right', 'left');
  addEdge('v-kaf', 'a-pred', 'async', 'right', 'left');
  addEdge('d-ch1', 'a-dash', 'sync', 'right', 'left');

  // --- 10. OBSERVABILITY (Top Right) ---
  const obX = 2300;
  addNode('o-prom', 'Prometheus', 'Metrics', obX, 100, COLORS.obs);
  addNode('o-graf', 'Grafana', 'Dashboards', obX, 260, COLORS.obs);
  addNode('o-otel', 'OpenTelemetry', 'Traces', obX, 420, COLORS.obs);
  addNode('o-loki', 'Loki', 'Logs', obX, 580, COLORS.obs);

  addEdge('o-prom', 'o-graf', 'sync', 'bottom', 'top');
  addEdge('o-loki', 'o-graf', 'sync', 'bottom', 'top');
  
  // Telemetry from services
  addEdge('p-core', 'o-otel', 'telemetry', 'right', 'left');
  addEdge('b-emp', 'o-otel', 'telemetry', 'right', 'left');
  addEdge('e-gw', 'o-otel', 'telemetry', 'right', 'left');

  // --- 11. INFRASTRUCTURE (Bottom) ---
  const infY = 2260;
  addNode('f-doc', 'Docker', 'Containers', CENTER_X - 450, infY, COLORS.infra);
  addNode('f-k8s', 'Kubernetes', 'Orchestration', CENTER_X - 150, infY, COLORS.infra);
  addNode('f-argo', 'ArgoCD', 'GitOps', CENTER_X + 150, infY, COLORS.infra);
  addNode('f-mesh', 'Service Mesh', 'Istio', CENTER_X + 450, infY, COLORS.infra);

  addEdge('f-argo', 'f-k8s', 'sync', 'left', 'right');
  addEdge('f-doc', 'f-k8s', 'sync', 'right', 'left');

  return { nodes, edges };
}
