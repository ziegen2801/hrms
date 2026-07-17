import { memo } from 'react';
import { Handle, Position } from '@xyflow/react';
import type { ArchNodeData } from '../types';

interface Props { data: ArchNodeData; selected?: boolean; }

function ArchitectureNodeComp({ data, selected }: Props) {
  if (data.isTechNode) {
    return (
      <div className={`tech-node ${selected ? 'selected' : ''}`} style={{ borderColor: data.color }}>
        <Handle type="target" position={Position.Top} className="wf-handle" />
        
        <div className="tech-node-header" style={{ backgroundColor: `${data.color}15` }}>
          <div className="tech-type" style={{ color: data.color }}>{data.typeLabel}</div>
          <div className="tech-title">{data.label}</div>
        </div>

        {data.traits && data.traits.length > 0 && (
          <div className="tech-node-body">
            {data.traits.map((trait, i) => (
              <div key={i} className="tech-trait">{trait}</div>
            ))}
          </div>
        )}

        <Handle type="source" position={Position.Bottom} className="wf-handle" />
        <Handle type="source" position={Position.Right} id="right" className="wf-handle" />
        <Handle type="target" position={Position.Left} id="left" className="wf-handle" />
      </div>
    );
  }

  // Business Node
  return (
    <div className={`ent-node ${selected ? 'selected' : ''}`} style={{ borderTopColor: data.color, borderTopWidth: 6 }}>
      <Handle type="target" position={Position.Top} className="wf-handle" />
      <Handle type="target" position={Position.Left} id="left" className="wf-handle" />
      
      {/* Header */}
      <div className="ent-node-header">
        <div className="ent-node-title" style={{ color: data.color }}>{data.label}</div>
      </div>

      {/* Body */}
      <div className="ent-node-body">
        <div className="ent-section-title">Purpose</div>
        <div className="ent-body-text">{data.purpose}</div>
        
        {data.features && data.features.length > 0 && (
          <>
            <div className="ent-section-title mt-2">Business Features</div>
            <ul className="ent-list">
              {data.features.map((f, i) => <li key={i}>{f}</li>)}
            </ul>
          </>
        )}

        {data.screens && data.screens.length > 0 && (
          <>
            <div className="ent-section-title mt-2">Related Screens</div>
            <ul className="ent-list text-alt">
              {data.screens.map((s, i) => <li key={i}>{s}</li>)}
            </ul>
          </>
        )}
      </div>

      {/* Footer (Tech Summary) */}
      {data.tech && (
        <div className="ent-node-footer">
          <div className="ent-section-title">Technical Summary</div>
          
          <div className="tech-item">
            <span className="tech-key">Architecture</span>
            <span className="tech-val">{data.tech.architecture}</span>
          </div>
          {data.tech.db && (
            <div className="tech-item">
              <span className="tech-key">Database</span>
              <span className="tech-val">{data.tech.db}</span>
            </div>
          )}
          <div className="tech-item">
            <span className="tech-key">Communication</span>
            <span className="tech-val">{data.tech.comm}</span>
          </div>
          <div className="tech-item">
            <span className="tech-key">Dependencies</span>
            <span className="tech-val">{data.tech.dependencies.join(', ') || 'None'}</span>
          </div>
        </div>
      )}

      <Handle type="source" position={Position.Bottom} className="wf-handle" />
      <Handle type="source" position={Position.Right} id="right" className="wf-handle" />
    </div>
  );
}

export const ArchitectureNode = memo(ArchitectureNodeComp);
