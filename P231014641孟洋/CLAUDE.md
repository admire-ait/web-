# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

This is a Next.js application integrating QAnything LLM service and WakaTime API. The application provides a complete management interface for QAnything knowledge bases and AI agents, with separate pages for different functionalities.

## Development Commands

- `npm run dev` - Start development server with Turbopack
- `npm run build` - Build the application for production
- `npm run start` - Start production server
- `npm run lint` - Run ESLint to check code quality

## Architecture Overview

### Core Services
- **KnowledgeBaseClient** (`src/lib/knowledge-base-client.ts`) - Handles all knowledge base API operations
- **AgentService** (`src/services/agentService.ts`) - Manages AI agent CRUD operations
- Both services interact with the QAnything API at `https://openapi.youdao.com/q_anything/api`

### API Response Pattern
QAnything API returns data in `{result: [...]}` format. Services automatically extract the `result` field using `data.result || data` pattern.

### Component Architecture
- **Dashboard Pattern** - Each feature has a main dashboard component that manages state and coordinates child components
- **Service Integration** - Dashboards inject API keys into services and handle loading/error states
- **Modular Components** - Features are broken into List, Form, Detail, and Card components for reusability

### Key Features
1. **Knowledge Base Management** - Create, edit, delete knowledge bases; upload files/URLs; manage FAQs
2. **Agent Management** - Create, edit, delete AI agents; bind knowledge bases; configure model parameters
3. **Toast Notifications** - Custom toast system replaces browser alerts (`src/components/ui/toast.tsx`, `src/hooks/useToast.ts`)

## Technology Stack

- Next.js 15.3.4 with App Router
- React 19
- TypeScript
- Tailwind CSS v4
- Turbopack for development

## Type System

### Agent Types (`src/types/agent.ts`)
- API returns: `{name, description, promptSetting, maxToken: number, hybridSearch: boolean}`
- Form uses string values for all fields, converted when needed
- `UpdateAgentRequest` supports partial updates (all fields optional except `uuid`)

### Knowledge Base Types (`src/types/knowledge-base.ts`)
- Uses `ApiResponse<T>` wrapper for all API responses
- Supports both new format (`{errorCode, msg, result}`) and legacy format (`{code, message, data}`)

## Environment Configuration

- `NEXT_PUBLIC_QANYTHING_API_KEY` - Required API key from .env.local
- API key is injected into services at runtime via `setApiKey()` method

## Path Alias

- `@/*` maps to `./src/*` - use this for imports from the src directory

## Toast Notification System

Use `useToast()` hook instead of `alert()`:
```typescript
const { showSuccess, showError } = useToast();
showSuccess("Operation completed");
showError("Something went wrong");
```