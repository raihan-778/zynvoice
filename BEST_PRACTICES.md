# 📘 Project Best Practices

## 1. Project Purpose
ZynVoice is a professional invoice generator application built with Next.js 15. It provides comprehensive invoice management capabilities including client/company management, PDF generation, email integration, and recurring invoice functionality. The application follows modern React patterns with TypeScript, uses MongoDB for data persistence, and implements authentication with NextAuth.js.

## 2. Project Structure
```
src/
├── app/                    # Next.js App Router pages and API routes
│   ├── (auth)/            # Authentication route group
│   ├── (marketting)/      # Marketing pages route group
│   ├── api/               # API endpoints
│   ├── dashboard/         # Dashboard pages
│   ├── invoice/           # Invoice-related pages
│   └── settings/          # Settings pages
├── components/            # Reusable UI components
│   ├── ui/               # Shadcn/ui base components
│   ├── auth/             # Authentication components
│   ├── dashboard/        # Dashboard-specific components
│   ├── invoice/          # Invoice-related components
│   └── forms/            # Form components
├── hooks/                # Custom React hooks
├── lib/                  # Utility libraries and configurations
│   ├── auth/             # Authentication utilities
│   ├── database/         # Database connection and utilities
│   ├── validations/      # Zod validation schemas
│   └── services/         # Business logic services
├── models/               # Mongoose database models
├── stors/                # Zustand state management stores
├── types/                # TypeScript type definitions
└── utils/                # General utility functions
```

## 3. Test Strategy
- **Framework**: Currently no testing framework is configured
- **Recommended Setup**: Jest + React Testing Library for unit tests, Playwright for E2E
- **Testing Philosophy**: Focus on critical user flows (invoice creation, PDF generation, email sending)
- **Coverage Expectations**: Aim for 80%+ coverage on business logic and API routes
- **Mocking Strategy**: Mock external services (email, PDF generation, database) in tests

## 4. Code Style

### TypeScript Usage
- **Strict Mode**: Use strict TypeScript configuration
- **Interface Definitions**: Define comprehensive interfaces in `src/types/` directory
- **Type Safety**: Prefer interfaces over types for object shapes
- **Generic Types**: Use generics for reusable components and utilities

### Naming Conventions
- **Files**: kebab-case for regular files, PascalCase for React components
- **Components**: PascalCase (e.g., `InvoicePreview.tsx`)
- **Hooks**: camelCase starting with "use" (e.g., `useInvoiceGenerator.ts`)
- **API Routes**: kebab-case directories with route.ts files
- **Database Models**: PascalCase with "I" prefix for interfaces (e.g., `IInvoice`)
- **Store Files**: camelCase ending with "Store" (e.g., `invoiceStore.ts`)

### Component Patterns
- **Functional Components**: Use function declarations for components
- **Props Interfaces**: Define props interfaces above component definitions
- **Default Exports**: Use default exports for page components, named exports for utilities
- **Component Composition**: Prefer composition over inheritance

### State Management
- **Zustand**: Primary state management solution
- **Store Organization**: Separate stores by domain (invoice, auth, etc.)
- **Devtools**: Enable Zustand devtools in development
- **State Structure**: Keep state flat and normalized

## 5. Common Patterns

### API Route Structure
```typescript
// Standard API route pattern
export async function POST(request: Request) {
  try {
    const body = await request.json();
    // Validation
    // Business logic
    // Database operations
    return NextResponse.json({ success: true, data });
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
```

### Form Handling
- **React Hook Form**: Primary form library with Zod validation
- **Validation**: Use Zod schemas defined in `src/lib/validations/`
- **Error Handling**: Centralized error display components
- **Form State**: Combine with Zustand for complex form state

### Database Operations
- **Mongoose**: ODM for MongoDB operations
- **Connection**: Centralized database connection in `src/lib/database/`
- **Models**: Define models in `src/models/` directory
- **Population**: Use Mongoose populate for related data

### PDF Generation
- **React PDF**: Primary library for PDF generation
- **Templates**: Configurable templates with customization options
- **Export Options**: Support both PDF and image exports

## 6. Do's and Don'ts

### ✅ Do's
- Use TypeScript interfaces for all data structures
- Implement proper error boundaries for component error handling
- Use Zod for runtime validation of API inputs
- Leverage Next.js App Router for file-based routing
- Use Shadcn/ui components as base building blocks
- Implement proper loading states for async operations
- Use environment variables for configuration
- Follow the established folder structure for new features
- Use Zustand devtools for debugging state changes
- Implement proper SEO metadata for public pages

### ❌ Don'ts
- Don't use any types - always define proper interfaces
- Don't put business logic directly in components
- Don't skip validation on API endpoints
- Don't hardcode configuration values
- Don't mix client and server components unnecessarily
- Don't ignore TypeScript errors
- Don't create deeply nested component hierarchies
- Don't forget to handle loading and error states
- Don't use inline styles - prefer Tailwind classes
- Don't skip error handling in async operations

## 7. Tools & Dependencies

### Core Framework
- **Next.js 15**: React framework with App Router
- **React 19**: UI library
- **TypeScript**: Type safety and developer experience

### UI & Styling
- **Tailwind CSS**: Utility-first CSS framework
- **Shadcn/ui**: Component library built on Radix UI
- **Framer Motion**: Animation library
- **Lucide React**: Icon library

### State Management & Forms
- **Zustand**: Lightweight state management
- **React Hook Form**: Form handling with validation
- **Zod**: Schema validation

### Database & Authentication
- **MongoDB**: Document database
- **Mongoose**: ODM for MongoDB
- **NextAuth.js**: Authentication solution

### PDF & Email
- **React PDF**: PDF generation
- **EmailJS**: Email service integration
- **Puppeteer**: Web scraping and PDF generation

### Development Tools
- **ESLint**: Code linting
- **Prettier**: Code formatting (recommended to add)
- **TypeScript**: Static type checking

## 8. Other Notes

### Performance Considerations
- Use Next.js Image component for optimized images
- Implement proper caching strategies for API routes
- Use React.memo for expensive component renders
- Leverage Next.js built-in optimizations (fonts, images, etc.)

### Security Best Practices
- Validate all API inputs with Zod schemas
- Use environment variables for sensitive configuration
- Implement proper authentication checks on protected routes
- Sanitize user inputs before database operations

### Accessibility
- Use semantic HTML elements
- Implement proper ARIA labels
- Ensure keyboard navigation works correctly
- Test with screen readers

### LLM Code Generation Guidelines
- Always use existing TypeScript interfaces when generating new code
- Follow the established folder structure for new components
- Use the existing Zustand stores for state management
- Implement proper error handling and loading states
- Use Shadcn/ui components as building blocks
- Follow the established naming conventions
- Include proper TypeScript types for all new functions and components
- Use the existing validation schemas or create new ones following the Zod pattern