import { memo } from 'react';
import type { LayerNodeData } from '../types';

function DomainGroupNodeComp({ data }: { data: LayerNodeData }) {
  return (
    <div className="layer-group">
      <div className="layer-header">
        <div className="layer-title">{data.label}</div>
        <div className="layer-desc">{data.description}</div>
      </div>
    </div>
  );
}

export const DomainGroupNode = memo(DomainGroupNodeComp);
