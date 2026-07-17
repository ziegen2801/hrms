import { jsPDF } from 'jspdf';
import type { Node, Edge } from '@xyflow/react';
import type { ArchNodeData, LayerNodeData } from './types';

function hexToRgb(hex: string) {
  const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
  return result ? {
    r: parseInt(result[1], 16),
    g: parseInt(result[2], 16),
    b: parseInt(result[3], 16)
  } : { r: 0, g: 0, b: 0 };
}

export function generateVectorPDF(nodes: Node[], edges: Edge[]) {
  let minX = Infinity, minY = Infinity, maxX = -Infinity, maxY = -Infinity;

  nodes.forEach(n => {
    let w = 0, h = 0;
    if (n.type === 'domainGroup') {
      w = n.style?.width as number || 400;
      h = n.style?.height as number || 300;
    } else if (n.type === 'architecture') {
      const data = n.data as ArchNodeData;
      if (data.isTechNode) {
        w = data.width || 280;
        h = data.height || 220;
      } else {
        w = data.width || 380;
        h = data.height || 340;
      }
    }
    
    if (n.position.x < minX) minX = n.position.x;
    if (n.position.y < minY) minY = n.position.y;
    if (n.position.x + w > maxX) maxX = n.position.x + w;
    if (n.position.y + h > maxY) maxY = n.position.y + h;
  });

  const pad = 40; // Tighter, consistent 40px margin
  const pdfW = (maxX - minX) + pad * 2;
  const pdfH = (maxY - minY) + pad * 2;

  const pdf = new jsPDF({
    orientation: pdfW > pdfH ? 'landscape' : 'portrait',
    unit: 'pt',
    format: [pdfW, pdfH]
  });

  const tx = -minX + pad;
  const ty = -minY + pad;

  // Background
  pdf.setFillColor(248, 250, 252);
  pdf.rect(0, 0, pdfW, pdfH, 'F');

  // Draw Domain Groups First
  nodes.filter(n => n.type === 'domainGroup').forEach(n => {
    const data = n.data as LayerNodeData;
    const w = n.style?.width as number || 400;
    const h = n.style?.height as number || 300;
    const x = n.position.x + tx;
    const y = n.position.y + ty;

    // Background rect
    pdf.setFillColor(255, 255, 255);
    pdf.setDrawColor(148, 163, 184);
    pdf.setLineWidth(1);
    pdf.setLineDashPattern([6, 6], 0);
    pdf.roundedRect(x, y, w, h, 8, 8, 'FD');
    pdf.setLineDashPattern([], 0); // reset

    // Header rect
    pdf.setDrawColor(203, 213, 225);
    pdf.setLineWidth(1);
    pdf.setLineDashPattern([6, 6], 0);
    pdf.line(x, y + 80, x + w, y + 80);
    pdf.setLineDashPattern([], 0); // reset

    pdf.setFontSize(20);
    pdf.setFont('helvetica', 'bold');
    pdf.setTextColor(15, 23, 42);
    pdf.text(data.label, x + 32, y + 40);

    pdf.setFontSize(13);
    pdf.setFont('helvetica', 'normal');
    pdf.setTextColor(51, 65, 85);
    pdf.text(data.description || '', x + 32, y + 60);
  });

  // Draw Edges
  edges.forEach(e => {
    const srcNode = nodes.find(n => n.id === e.source);
    const tgtNode = nodes.find(n => n.id === e.target);
    if (!srcNode || !tgtNode) return;

    let sx = srcNode.position.x + tx;
    let sy = srcNode.position.y + ty;
    let tx_ = tgtNode.position.x + tx;
    let ty_ = tgtNode.position.y + ty;

    const srcW = (srcNode.data as ArchNodeData).width || (srcNode.type === 'architecture' && (srcNode.data as ArchNodeData).isTechNode ? 280 : 380);
    const srcH = (srcNode.data as ArchNodeData).height || (srcNode.type === 'architecture' && (srcNode.data as ArchNodeData).isTechNode ? 220 : 340);
    const tgtW = (tgtNode.data as ArchNodeData).width || (tgtNode.type === 'architecture' && (tgtNode.data as ArchNodeData).isTechNode ? 280 : 380);
    const tgtH = (tgtNode.data as ArchNodeData).height || (tgtNode.type === 'architecture' && (tgtNode.data as ArchNodeData).isTechNode ? 220 : 340);

    // Handle positions
    if (e.sourceHandle === 'right') { sx += srcW; sy += srcH / 2; }
    else { sx += srcW / 2; sy += srcH; }

    if (e.targetHandle === 'left') { ty_ += tgtH / 2; }
    else { tx_ += tgtW / 2; }

    pdf.setLineWidth(2);
    pdf.setDrawColor(148, 163, 184);

    const isDashed = e.style?.strokeDasharray ? true : false;
    if (isDashed) pdf.setLineDashPattern([6, 6], 0);
    else pdf.setLineDashPattern([], 0);

    // Simple Step Routing
    if (e.sourceHandle === 'right' && e.targetHandle === 'left') {
      const midX = sx + (tx_ - sx) / 2;
      pdf.line(sx, sy, midX, sy);
      pdf.line(midX, sy, midX, ty_);
      pdf.line(midX, ty_, tx_, ty_);
    } else {
      const midY = sy + (ty_ - sy) / 2;
      pdf.line(sx, sy, sx, midY);
      pdf.line(sx, midY, tx_, midY);
      pdf.line(tx_, midY, tx_, ty_);
    }

    // Arrowhead
    pdf.setFillColor(148, 163, 184);
    if (e.targetHandle === 'left') {
      pdf.triangle(tx_, ty_, tx_ - 10, ty_ - 5, tx_ - 10, ty_ + 5, 'F');
    } else {
      pdf.triangle(tx_, ty_, tx_ - 5, ty_ - 10, tx_ + 5, ty_ - 10, 'F');
    }
    
    pdf.setLineDashPattern([], 0); // reset
  });

  // Draw Architecture Nodes
  nodes.filter(n => n.type === 'architecture').forEach(n => {
    const data = n.data as ArchNodeData;
    const x = n.position.x + tx;
    const y = n.position.y + ty;
    const color = hexToRgb(data.color);

    if (data.isTechNode) {
      const w = data.width || 280; const h = data.height || 220;
      pdf.setFillColor(255, 255, 255);
      pdf.setDrawColor(148, 163, 184);
      pdf.setLineWidth(1);
      pdf.roundedRect(x, y, w, h, 6, 6, 'FD');

      // Left border accent
      pdf.setFillColor(color.r, color.g, color.b);
      // Hack for left border: draw a thin rect over the left edge
      pdf.rect(x, y + 6, 4, h - 12, 'F');

      // Header bg
      pdf.setFillColor(color.r, color.g, color.b);
      pdf.setGState(new (pdf as any).GState({ opacity: 0.1 }));
      pdf.rect(x + 4, y, w - 4, 50, 'F');
      pdf.setGState(new (pdf as any).GState({ opacity: 1 }));

      pdf.setDrawColor(203, 213, 225);
      pdf.line(x + 4, y + 50, x + w, y + 50);

      pdf.setFontSize(10);
      pdf.setFont('helvetica', 'bold');
      pdf.setTextColor(color.r, color.g, color.b);
      pdf.text(data.typeLabel || '', x + 16, y + 20);

      pdf.setFontSize(16);
      pdf.setTextColor(15, 23, 42);
      pdf.text(data.label, x + 16, y + 40);

      pdf.setFontSize(11);
      pdf.setFont('helvetica', 'normal');
      pdf.setTextColor(51, 65, 85);
      let ty_ = y + 70;
      data.traits?.forEach(trait => {
        pdf.text('•', x + 16, ty_);
        pdf.text(trait, x + 28, ty_, { maxWidth: w - 36 });
        ty_ += 16;
      });

    } else {
      const w = data.width || 380; const h = data.height || 340;
      pdf.setFillColor(255, 255, 255);
      pdf.setDrawColor(203, 213, 225);
      pdf.setLineWidth(1);
      pdf.roundedRect(x, y, w, h, 8, 8, 'FD');

      // Top border
      pdf.setFillColor(color.r, color.g, color.b);
      pdf.rect(x, y, w, 6, 'F');

      // Header
      pdf.setFillColor(241, 245, 249);
      pdf.rect(x, y + 6, w, 44, 'F');
      pdf.line(x, y + 50, x + w, y + 50);

      pdf.setFontSize(18);
      pdf.setFont('helvetica', 'bold');
      pdf.setTextColor(color.r, color.g, color.b);
      pdf.text(data.label, x + 20, y + 36);

      // Body
      let cy = y + 70;
      pdf.setFontSize(12);
      pdf.setTextColor(100, 116, 139);
      pdf.text('PURPOSE', x + 20, cy);
      cy += 16;

      pdf.setFontSize(13);
      pdf.setFont('helvetica', 'normal');
      pdf.setTextColor(15, 23, 42);
      const lines = pdf.splitTextToSize(data.purpose || '', w - 40);
      pdf.text(lines, x + 20, cy);
      cy += (lines.length * 16) + 20;

      if (data.features?.length) {
        pdf.setFontSize(12);
        pdf.setFont('helvetica', 'bold');
        pdf.setTextColor(100, 116, 139);
        pdf.text('BUSINESS FEATURES', x + 20, cy);
        cy += 16;

        pdf.setFontSize(12);
        pdf.setFont('helvetica', 'normal');
        pdf.setTextColor(15, 23, 42);
        data.features.forEach(f => {
          pdf.text('•', x + 20, cy);
          const fLines = pdf.splitTextToSize(f, w - 40);
          pdf.text(fLines, x + 30, cy);
          cy += (fLines.length * 16) + 4;
        });
        cy += 16;
      }

      if (data.screens?.length) {
        pdf.setFontSize(12);
        pdf.setFont('helvetica', 'bold');
        pdf.setTextColor(100, 116, 139);
        pdf.text('RELATED SCREENS', x + 20, cy);
        cy += 16;

        pdf.setFontSize(12);
        pdf.setFont('helvetica', 'normal');
        pdf.setTextColor(51, 65, 85);
        data.screens.forEach(s => {
          pdf.text('•', x + 20, cy);
          pdf.text(s, x + 30, cy);
          cy += 16;
        });
      }

      // Tech Footer (approx height 120)
      if (data.tech) {
        const footerY = y + h - 120;
        pdf.setFillColor(241, 245, 249);
        pdf.rect(x, footerY, w, 120, 'F');
        pdf.setDrawColor(203, 213, 225);
        pdf.line(x, footerY, x + w, footerY);

        pdf.setFontSize(12);
        pdf.setFont('helvetica', 'bold');
        pdf.setTextColor(100, 116, 139);
        pdf.text('TECHNICAL SUMMARY', x + 20, footerY + 24);

        let ty_ = footerY + 44;
        pdf.setFontSize(11);
        
        pdf.setFont('helvetica', 'bold');
        pdf.text('Architecture', x + 20, ty_);
        pdf.setFont('helvetica', 'normal');
        pdf.text(data.tech.architecture, x + w - 20, ty_, { align: 'right' });
        ty_ += 16;

        if (data.tech.db) {
          pdf.setFont('helvetica', 'bold');
          pdf.text('Database', x + 20, ty_);
          pdf.setFont('helvetica', 'normal');
          pdf.text(data.tech.db, x + w - 20, ty_, { align: 'right' });
          ty_ += 16;
        }

        pdf.setFont('helvetica', 'bold');
        pdf.text('Communication', x + 20, ty_);
        pdf.setFont('helvetica', 'normal');
        pdf.text(data.tech.comm, x + w - 20, ty_, { align: 'right' });
        ty_ += 16;

        pdf.setFont('helvetica', 'bold');
        pdf.text('Dependencies', x + 20, ty_);
        pdf.setFont('helvetica', 'normal');
        const deps = data.tech.dependencies.join(', ') || 'None';
        pdf.text(deps, x + w - 20, ty_, { align: 'right' });
      }
    }
  });

  pdf.save('Enterprise-Architecture-Blueprint.pdf');
}
