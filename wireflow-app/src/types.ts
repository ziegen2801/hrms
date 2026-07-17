export interface ArchNodeData extends Record<string, unknown> {
  label: string;
  color: string;
  isTechNode?: boolean;
  width?: number;
  height?: number;
  
  // Business Node Fields
  purpose?: string;
  features?: string[];
  screens?: string[];
  tech?: {
    architecture: string;
    db?: string;
    comm: string;
    dependencies: string[];
  };

  // Tech Node Fields
  typeLabel?: string; 
  traits?: string[];
}

export interface LayerNodeData extends Record<string, unknown> {
  label: string;
  description: string;
  colorHex?: string;
}

export type WireframeType = string;
