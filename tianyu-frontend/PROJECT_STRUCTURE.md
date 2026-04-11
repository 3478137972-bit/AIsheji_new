# TIANyu Frontend - Project Structure

## Overview
This document outlines the complete project structure for the TIANyu frontend application.

```
tianyu-frontend/
│
├── src/
│   ├── app/                      # Next.js App Router pages
│   │   ├── layout.tsx           # Root layout with metadata and Providers
│   │   ├── page.tsx             # Home page component
│   │   └── globals.css          # Global styles and Tailwind directives
│   │
│   ├── components/
│   │   ├── index.ts             # Barrel exports for all components
│   │   │
│   │   ├── base/                # Base UI components
│   │   │   ├── button.tsx       # Button component with multiple variants
│   │   │   ├── input.tsx        # Input component with variants
│   │   │   ├── tab.tsx          # Tabbed navigation component
│   │   │   ├── card.tsx         # Card component with sections
│   │   │   └── badge.tsx        # Badge component with status variants
│   │   │
│   │   └── layout/
│   │       ├── index.ts         # Layout exports
│   │       ├── layout.tsx       # Main layout wrapper
│   │       └── components.tsx   # Navbar and Footer components
│   │
│   └── lib/
│       └── utils.ts             # Utility functions (cn, etc.)
│
├── public/                       # Static assets (favicon, images, etc.)
├── docs/                         # Documentation files
│
├── package.json                  # Dependencies and scripts
├── package-lock.json            # Lockfile
├── tsconfig.json                # TypeScript configuration
├── tailwind.config.js           # Tailwind CSS configuration
├── postcss.config.js            # PostCSS configuration
├── next.config.js               # Next.js configuration
├── .eslintrc.json               # ESLint configuration
├── .prettierrc                  # Prettier configuration
├── .gitignore                   # Git ignore rules
├── .lintstagedrc.json           # Lint-staged configuration
├── README.md                    # Project documentation
└── PROJECT_STRUCTURE.md        # This file
```

## Component Architecture

### Base Components (`src/components/base/`)
All components follow the Shadcn/ui pattern with:
- Radix UI primitives for accessibility
- Tailwind CSS for styling
- class-variance-authority for variant management
- Lucide React for icons

### Layout Components (`src/components/layout/`)
- **Layout**: Main wrapper component
- **Navbar**: Responsive navigation with mobile menu
- **Footer**: Site footer with links and copyright

## Theme System

### Color Palette (tailwind.config.js)
- **Primary (Amber Orange)**: Main brand color
- **Cream**: Background and secondary elements
- **Cool Gray**: Text and border colors
- **Semantic Colors**: Success, Warning, Error

### Typography
- Font: Inter (system fallback)
- Scalable sizing with proper spacing

### Spacing
- Standard spacing scale from 0 to 64
- Responsive breakpoints: sm, md, lg, xl, 2xl

## Styling Approach

1. **Global Styles** (`globals.css`): Base reset and global styles
2. **Tailwind Config** (`tailwind.config.js`): Custom theme configuration
3. **CSS Modules**: Component-level scoped styles when needed
4. **Utility Classes**: Primary styling approach

## Dependency Strategy

### Production Dependencies
- **Framework**: Next.js 14 (App Router)
- **UI Library**: Radix UI primitives
- **Styling**: Tailwind CSS
- **Icons**: Lucide React
- **Utilities**: clsx, tailwind-merge, class-variance-authority

### Development Dependencies
- **TypeScript**: Type safety
- **ESLint**: Code quality
- **Prettier**: Code formatting
- **Tailwind**: CLI for development

## Development Workflow

1. Install dependencies: `npm install`
2. Start development server: `npm run dev`
3. Build for production: `npm run build`
4. Start production server: `npm start`

## Deployment

**Platform**: Vercel
**Build Command**: `npm run build`
**Output Directory**: `.next`

## License

MIT