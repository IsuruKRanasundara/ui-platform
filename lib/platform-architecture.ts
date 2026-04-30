export const mainRoles = [
  {
    name: "Platform Admin",
    scope: "Platform",
    description:
      "Manages the SaaS system, global tenants, billing policy, support visibility, and operational controls.",
  },
  {
    name: "Company Admin",
    scope: "Company",
    description:
      "Owns the workspace, manages teammates, brand settings, versions, and exports for the company tenant.",
  },
  {
    name: "UI/UX Designer",
    scope: "Design",
    description:
      "Creates and refines brand identity, design tokens, component presets, and visual consistency.",
  },
  {
    name: "Frontend Developer",
    scope: "Implementation",
    description:
      "Uses generated code, reviews output quality, and integrates the exported UI kit into application codebases.",
  },
];

export const designModules = [
  {
    name: "Authentication Module",
    purpose: "Secure login, session handling, and identity verification for all users.",
    responsibilities: "JWT, OAuth, password reset, token refresh, and session lifecycle.",
    data: "Users, credentials, session metadata, role claims, verification state.",
  },
  {
    name: "Company and Workspace Management Module",
    purpose: "Create and govern company tenants and their isolated workspaces.",
    responsibilities: "Company CRUD, workspace CRUD, invites, memberships, tenant boundaries.",
    data: "Company records, workspaces, memberships, invitations, ownership data.",
  },
  {
    name: "Brand Profile Management Module",
    purpose: "Store the visual identity that powers each company’s UI kit.",
    responsibilities: "Logo upload, color palette, typography, spacing, radius, and shadow rules.",
    data: "Brand assets, palette values, type scale, spacing scale, radius and shadow configuration.",
  },
  {
    name: "Design Token Management Module",
    purpose: "Normalize brand values into structured tokens for theming and code generation.",
    responsibilities: "Token creation, validation, semantic mapping, versioning, export formats.",
    data: "Color tokens, typography tokens, spacing tokens, semantic tokens, token versions.",
  },
  {
    name: "Component Template Library Module",
    purpose: "Define the reusable base UI component catalog.",
    responsibilities: "Template metadata, supported variants, prop schema, default markup, framework support.",
    data: "Component keys, categories, template versions, props, defaults, supported targets.",
  },
  {
    name: "Component Playground Module",
    purpose: "Let users visually customize reusable components in a live editor.",
    responsibilities: "Select templates, modify variants, adjust props, compose layouts, save drafts.",
    data: "Editor state, selected template, variant settings, layout state, local drafts.",
  },
  {
    name: "Live Preview Module",
    purpose: "Render immediate feedback as tokens and component settings change.",
    responsibilities: "Responsive rendering, sandbox isolation, preview sessions, error handling.",
    data: "Preview contexts, viewport state, runtime styles, render payloads, preview errors.",
  },
  {
    name: "Code Generation Module",
    purpose: "Create framework-specific output from brand and component configuration.",
    responsibilities: "React/Next.js code, Tailwind mapping, CSS variables, JSON token packages.",
    data: "Generation templates, target formats, output artifacts, generation jobs, hashes.",
  },
  {
    name: "UI Kit Version Control Module",
    purpose: "Snapshot the workspace’s branded UI kit over time.",
    responsibilities: "Version creation, restore, diff, publish, changelog tracking.",
    data: "Version numbers, snapshot payloads, release notes, publish state, authorship.",
  },
  {
    name: "Export and Integration Module",
    purpose: "Package generated assets for download and downstream integration.",
    responsibilities: "ZIP packaging, artifact delivery, retries, integration-ready bundles.",
    data: "Export jobs, artifact URLs, output formats, delivery status, integration targets.",
  },
  {
    name: "Admin Dashboard Module",
    purpose: "Give platform operators a view into the SaaS system.",
    responsibilities: "Tenant oversight, support data, audits, usage metrics, moderation.",
    data: "Audit logs, platform metrics, tenant summaries, support actions, system health.",
  },
  {
    name: "Billing and Subscription Module",
    purpose: "Control plan entitlement and billing state for each company.",
    responsibilities: "Plan management, payment provider integration, feature limits, invoices.",
    data: "Subscriptions, seat limits, workspace limits, billing cycles, provider refs.",
  },
];

export const architectureDiagram = `flowchart LR
  U[Users / Browsers] --> F[Frontend Application\nNext.js + React]
  F --> API[Backend API]
  API --> AUTH[Authentication Service]
  API --> WORK[Workspace Service]
  API --> BRAND[Brand Profile Service]
  API --> TOKEN[Design Token Service]
  API --> COMP[Component Service]
  API --> PREV[Preview Engine]
  API --> CODE[Code Generation Service]
  API --> EXP[Export Service]
  AUTH --> DB[(PostgreSQL)]
  WORK --> DB
  BRAND --> DB
  TOKEN --> DB
  COMP --> DB
  PREV --> DB
  CODE --> DB
  EXP --> DB
  API --> CACHE[(Redis Cache)]
  BRAND --> STORE[(Cloud Storage)]
  EXP --> STORE
  PREV --> STORE`;

export const componentGenerationFlow = `flowchart TD
  A[Register company] --> B[Create workspace]
  B --> C[Set brand identity]
  C --> D[Generate design tokens]
  D --> E[Open playground]
  E --> F[Customize components]
  F --> G[Preview changes]
  G --> H[Save presets]
  H --> I[Create UI kit version]
  I --> J[Generate code]
  J --> K[Export UI kit]
  K --> L[Integrate into company app]`;

export const stackLayers = [
  {
    name: "Frontend",
    detail: "Next.js, React, TypeScript, Tailwind CSS, and shadcn/ui for the UI shell and the playground.",
  },
  {
    name: "State Management",
    detail: "Redux for shared editor state, workspace context, and generation workflows.",
  },
  {
    name: "Backend",
    detail: "Node.js with Express.js or NestJS for modular API services and job orchestration.",
  },
  {
    name: "Data and storage",
    detail: "PostgreSQL, Redis, and Cloudflare R2 or AWS S3 for tenant data, caching, and assets.",
  },
  {
    name: "Deployment",
    detail: "Vercel for the frontend and AWS, Render, or Fly.io for backend and job workers.",
  },
];

export const databaseEntities = [
  {
    name: "Company",
    detail: "Tenant boundary with name, slug, status, and timestamps; owns users, workspaces, and subscriptions.",
  },
  {
    name: "User",
    detail: "Belongs to a company and stores email, name, password hash, role, status, and login history.",
  },
  {
    name: "Workspace",
    detail: "Company-scoped workspace that owns brand profiles, tokens, presets, versions, and exports.",
  },
  {
    name: "BrandProfile",
    detail: "Workspace branding record that stores logo, palette, typography, spacing, radius, and shadows.",
  },
  {
    name: "DesignToken",
    detail: "Normalized token row linked to a workspace and brand profile for stable code generation.",
  },
  {
    name: "ComponentTemplate",
    detail: "Shared library definition for reusable base components and supported target frameworks.",
  },
  {
    name: "ComponentPreset",
    detail: "Saved configuration for a template within a workspace, including variant and settings JSON.",
  },
  {
    name: "UIKitVersion",
    detail: "Versioned snapshot of the workspace UI kit with changelog, publish state, and lineage.",
  },
  {
    name: "Export",
    detail: "Generated bundle metadata, artifact URL, status, and output format for delivery.",
  },
  {
    name: "Subscription",
    detail: "Company billing record with plan name, billing cycle, seat and workspace limits, and provider reference.",
  },
];

export const apiGroups = [
  {
    name: "Authentication",
    detail: "Register, login, refresh, password reset, and current-user lookup endpoints.",
  },
  {
    name: "Companies and workspaces",
    detail: "Tenant management, workspace CRUD, invites, and membership administration.",
  },
  {
    name: "Brand profiles and tokens",
    detail: "Upload brand assets, update palette and typography, and generate token sets.",
  },
  {
    name: "Component catalog",
    detail: "Browse templates, create presets, and update template definitions.",
  },
  {
    name: "UI kit versions and exports",
    detail: "Snapshot, restore, compare, generate code, and download final bundles.",
  },
  {
    name: "Billing",
    detail: "Plan management, checkout, usage, and provider webhooks.",
  },
];

export const securityNotes = [
  {
    name: "JWT authentication",
    detail: "Short-lived access tokens with refresh rotation and server-side validation.",
  },
  {
    name: "Role-based access control",
    detail: "Permissions enforced by role and company membership on every protected action.",
  },
  {
    name: "Company-level data isolation",
    detail: "All tenant queries filtered by company and workspace identifiers on the server.",
  },
  {
    name: "Secure file upload",
    detail: "Signed uploads, content validation, size limits, and cloud storage instead of local disk.",
  },
  {
    name: "Validation and rate limiting",
    detail: "Schema validation for inputs and Redis-backed throttling for expensive or sensitive routes.",
  },
];

export const scalabilityNotes = [
  {
    name: "Multi-tenant SaaS design",
    detail: "Company-first data boundaries support many isolated tenants in one platform.",
  },
  {
    name: "Stateless backend services",
    detail: "Compute nodes can scale horizontally because durable state lives in the database or storage layer.",
  },
  {
    name: "Background jobs",
    detail: "Large exports and expensive generation tasks should run asynchronously in worker processes.",
  },
  {
    name: "CDN and cache usage",
    detail: "Static assets, generated downloads, and preview data benefit from Redis and edge delivery.",
  },
  {
    name: "Future service split",
    detail: "Auth, tokens, preview, codegen, exports, and billing can later move into separate services.",
  },
];

export const folderStructure = [
  {
    path: "apps/web",
    description: "Frontend application shell for the SaaS experience and visual playground.",
  },
  {
    path: "apps/api",
    description: "Primary backend API for authentication, workspace data, generation, and exports.",
  },
  {
    path: "packages/shared-types",
    description: "Shared TypeScript types and validation schemas used across frontend and backend.",
  },
  {
    path: "packages/ui-kit-templates",
    description: "Component template definitions and metadata for the reusable library.",
  },
  {
    path: "packages/codegen-templates",
    description: "Framework-specific generation templates for React, Next.js, and Tailwind output.",
  },
  {
    path: "packages/design-tokens",
    description: "Token schemas and helper utilities for theming and export formats.",
  },
  {
    path: "services/*",
    description: "Logical boundaries for future auth, workspace, brand, token, preview, codegen, export, and billing services.",
  },
  {
    path: "database/",
    description: "Schema, migrations, and seed data for PostgreSQL or the chosen persistence layer.",
  },
];