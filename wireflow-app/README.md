# HRMS Interactive Wireflow

Professional node-based wireflow diagram for the complete HRMS system, built with React Flow.

## Features

- **120+ wireframe screen nodes** with simplified UI previews (header, sidebar, forms, tables, etc.)
- **Role-based swimlanes**: Super Admin, HR Admin, Payroll Admin, Recruiter, Manager, Employee, Candidate
- **Module grouping** with color-coded sections and icons
- **Navigation arrows** with decision branches (login validation, role routing, approvals)
- **Zoom, pan, minimap, fit-to-screen**
- **Search nodes**, **highlight navigation path**, **expand/collapse modules**
- **Click any node** to enlarge wireframe preview with full metadata
- **Export** as PDF, PNG, or SVG

## Quick Start

```bash
cd wireflow-app
npm install
npm run dev
```

Open **http://localhost:5173**

## Source Data

- `../flow.txt` — Complete HRMS business logic and screen definitions
- Layout inspired by enterprise wireflow diagrams (RCM Wireframe reference)

## Tech Stack

- React 19 + TypeScript + Vite
- @xyflow/react (React Flow)
- lucide-react (module icons)
- html-to-image + jsPDF (export)
