import { useCallback, useMemo, useRef, useState, useEffect } from 'react';
import {
  ReactFlow, Background, Controls, MiniMap,
  useNodesState, useEdgesState, useReactFlow,
  ReactFlowProvider, BackgroundVariant,
  getNodesBounds, getViewportForBounds,
} from '@xyflow/react';
import '@xyflow/react/dist/style.css';
import { toPng, toSvg } from 'html-to-image';

import { buildTab1EnterpriseGraph } from './data/tab1EnterpriseWireflow';
import { buildTab2BackendLogicGraph } from './data/tab2BackendLogic';
import { buildTab3SystemDesignGraph } from './data/tab3SystemDesign';

import { ArchitectureNode } from './components/ArchitectureNode';
import { DomainGroupNode } from './components/DomainGroupNode';
import { generateVectorPDF } from './pdfExport';

const nodeTypes = {
  architecture: ArchitectureNode,
  domainGroup: DomainGroupNode,
};

const wait = (ms: number) => new Promise(res => setTimeout(res, ms));

async function exportImage(
  flowEl: HTMLElement,
  format: 'png' | 'svg',
  getNodes: any,
  setViewport: any,
  fitView: any,
  setExportState: (v: string) => void
) {
  const vpEl = flowEl.querySelector('.react-flow__viewport') as HTMLElement;
  if (!vpEl) return;

  setExportState('Calculating bounds...');
  const nodes = getNodes();
  const bounds = getNodesBounds(nodes);
  
  const pad = 120;
  const renderW = bounds.width + pad * 2;
  const renderH = bounds.height + pad * 2;
  
  const viewport = getViewportForBounds(bounds, renderW, renderH, 0.01, 2, pad);
  setViewport({ x: viewport.x, y: viewport.y, zoom: viewport.zoom });
  
  await wait(800); 

  const opts = {
    backgroundColor: '#F8FAFC',
    width: renderW,
    height: renderH,
    pixelRatio: 2,
    style: {
      width: `${renderW}px`,
      height: `${renderH}px`,
      transform: `translate(${viewport.x}px, ${viewport.y}px) scale(${viewport.zoom})`,
    },
  };

  setExportState(`Generating ${format.toUpperCase()}...`);
  try {
    const url = format === 'png' ? await toPng(vpEl, opts) : await toSvg(vpEl, opts);
    const a = document.createElement('a');
    a.download = `Enterprise-Blueprint.${format}`;
    a.href = url;
    a.click();
  } catch (e) {
    console.error(e);
    alert('Export failed.');
  }

  setExportState('');
  fitView({ padding: 0.1, duration: 800 });
}

function WireflowCanvasWithRef({ activeTab, canvasRef, isExporting }: { activeTab: number, canvasRef: React.RefObject<HTMLDivElement | null>, isExporting: boolean }) {
  const graphFn = [
    buildTab1EnterpriseGraph,
    buildTab2BackendLogicGraph,
    buildTab3SystemDesignGraph
  ][activeTab];

  const { nodes: initNodes, edges: initEdges } = useMemo(() => graphFn(), [activeTab, graphFn]);
  const [nodes, setNodes, onNodesChange] = useNodesState(initNodes);
  const [edges, setEdges, onEdgesChange] = useEdgesState(initEdges);
  const { fitView } = useReactFlow();

  useEffect(() => {
    setNodes(initNodes);
    setEdges(initEdges);
    setTimeout(() => fitView({ padding: 0.1, duration: 800 }), 50);
  }, [initNodes, initEdges, setNodes, setEdges, fitView]);

  return (
    <div className="canvas-wrap" ref={canvasRef}>
      <ReactFlow
        nodes={nodes} edges={edges}
        onNodesChange={onNodesChange} onEdgesChange={onEdgesChange}
        nodeTypes={nodeTypes}
        minZoom={0.01} maxZoom={2}
        proOptions={{ hideAttribution: true }}
        onlyRenderVisibleElements={false}
      >
        <Background variant={BackgroundVariant.Dots} gap={48} size={2} color="#CBD5E1" />
        {!isExporting && <Controls showInteractive={false} />}
        {!isExporting && (
          <MiniMap
            nodeColor={(n) => n.type === 'domainGroup' ? '#E2E8F0' : '#94A3B8'}
            maskColor="rgba(248,250,252,0.8)"
            pannable zoomable
            position="bottom-left"
          />
        )}
      </ReactFlow>
    </div>
  );
}

function AppInner() {
  const canvasRef = useRef<HTMLDivElement>(null);
  const { getNodes, getEdges, setViewport, fitView } = useReactFlow();
  const [exportState, setExportState] = useState('');
  const [activeTab, setActiveTab] = useState(0);

  const handleExportRaster = useCallback(async (fmt: 'png' | 'svg') => {
    if (!canvasRef.current || exportState) return;
    await exportImage(canvasRef.current, fmt, getNodes, setViewport, fitView, setExportState);
  }, [getNodes, setViewport, fitView, exportState]);

  const handlePdfExport = async () => {
    if (!canvasRef.current || exportState) return;
    setExportState('Compiling native vector PDF...');
    
    await wait(100);
    
    try {
      const nodes = getNodes();
      const edges = getEdges();
      generateVectorPDF(nodes, edges);
    } catch (e) {
      console.error(e);
      alert('Export failed.');
    }

    setExportState('');
  };

  return (
    <div className="app">
      <div className="toolbar">
        <div className="toolbar-logo">
          <div className="logo-mark">EA</div>
          <div>
            <div className="logo-text">Enterprise Architecture Viewer</div>
            <div className="logo-sub">Multi-Perspective Blueprint</div>
          </div>
        </div>

        <div className="tabs-container">
          <button className={`tab-btn ${activeTab === 0 ? 'active' : ''}`} onClick={() => setActiveTab(0)}>Enterprise Wireflow</button>
          <button className={`tab-btn ${activeTab === 1 ? 'active' : ''}`} onClick={() => setActiveTab(1)}>Backend Logic</button>
          <button className={`tab-btn ${activeTab === 2 ? 'active' : ''}`} onClick={() => setActiveTab(2)}>System Design</button>
        </div>

        <div style={{ display: 'flex', gap: 12, alignItems: 'center' }}>
          {exportState && <div style={{ fontSize: 14, fontWeight: 600 }}>{exportState}</div>}
          <button type="button" className="tb-btn" onClick={() => handleExportRaster('svg')} disabled={!!exportState}>
            <span>📐</span> Export SVG
          </button>
          <button type="button" className="tb-btn" onClick={() => handleExportRaster('png')} disabled={!!exportState}>
            <span>🖼️</span> Export PNG
          </button>
          <button type="button" className="tb-btn primary" onClick={handlePdfExport} disabled={!!exportState}>
            <span>📄</span> Export Professional PDF
          </button>
        </div>
      </div>

      <WireflowCanvasWithRef activeTab={activeTab} canvasRef={canvasRef} isExporting={!!exportState} />
    </div>
  );
}

export default function App() {
  return (
    <ReactFlowProvider>
      <AppInner />
    </ReactFlowProvider>
  );
}
