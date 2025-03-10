# NextJS Project Guidelines

## Build Commands
```bash
# Development
npm run dev        # Start development server
npm run build      # Build for production
npm run start      # Run production build

# No explicit lint/test commands in package.json
```

## Code Style Guidelines

### Imports
- Client components: `"use client"` at the top
- Path aliases: Use `@/` for root imports
- Group imports: React/Next first, then components, then utilities

### TypeScript
- Use strict types, avoid `any`
- Prefer explicit types in function parameters
- Use interfaces for component props (with proper exports)

### Components
- Use function components with named exports
- Use React.forwardRef for forwarded ref components
- Export UI components from ui/ directory

### Error Handling
- Use try/catch for async operations
- Log errors with console.error before returning error messages
- Use encodedRedirect for redirects with error/success messages

### Naming Conventions
- PascalCase for components and interfaces
- camelCase for functions and variables
- Use descriptive, semantic naming

### UI/Styling
- Use Tailwind with cn utility for class merging
- Use shadcn/ui component patterns
- Define variants with class-variance-authority (cva)