# Real Estate Application Architecture Diagrams

This document provides visual representations of the application architecture and key data flows.

## Application Layer Structure

```mermaid
graph TD
    subgraph "Data Access Layer"
        A[lib/db/schema.ts] --> B[lib/db/index.ts]
        C[lib/auth.ts] --> B
        D[lib/users.ts] --> B
    end

    subgraph "Server Actions"
        E[app/actions/listings.ts] --> A
        F[app/actions/users.ts] --> D
    end

    subgraph "Server Components"
        G[app/listings/page.tsx]
        H[app/listings/[id]/page.tsx]
    end

    subgraph "Client Components"
        I[components/listings/listing-form.tsx]
        J[components/listings/listing-card.tsx]
    end

    K[(PostgreSQL DB)] --> B
    G --> A
    H --> A
    I --> E
    J --> E

    style A fill:#2196F3,stroke:#1976D2
    style B fill:#4CAF50,stroke:#388E3C
    style E fill:#9C27B0,stroke:#7B1FA2
    style F fill:#FF9800,stroke:#F57C00
```

## Server-Side Data Flow

```mermaid
sequenceDiagram
    participant Client
    participant RSC as React Server Component
    participant SA as Server Action
    participant DAL as Data Access Layer
    participant DB as PostgreSQL

    Client->>RSC: Request Page
    RSC->>DAL: getCurrentUser()
    DAL->>DB: Auth Query
    DB-->>DAL: User Data
    RSC->>DAL: getListings()
    DAL->>DB: Drizzle Query
    DB-->>DAL: Raw Data
    DAL-->>RSC: Typed DTOs
    RSC-->>Client: Static HTML + RSC Payload

    Note over Client,DB: Mutation Flow
    Client->>SA: Form Action
    SA->>DAL: validateAndMutate()
    DAL->>DB: Transaction
    DB-->>DAL: Result
    DAL-->>SA: Success/Error
    SA-->>Client: Revalidation/Error
```

## Authentication Flow

```mermaid
flowchart LR
    A[Middleware] -->|Verify Session| B[getCurrentUser]
    B -->|Valid| C[Allow Access]
    B -->|Invalid| D[Redirect: /auth/login]

    C -->|Protected Routes| E[Server Component]
    E -->|getCurrentUser| F[Data Access Layer]

    style B fill:#FF4081,stroke:#C2185B
    style C fill:#4CAF50,stroke:#388E3C
    style D fill:#F44336,stroke:#D32F2F
```

## Security Architecture

```mermaid
flowchart TD
    A[Client Request] --> B[Next.js Middleware]
    B --> C[Server Component]
    C --> D[Server Action]
    D --> E[Data Access Layer]
    E --> F[PostgreSQL]

    subgraph "Security Layers"
        G[Session Validation]
        H[Input Validation: Zod]
        I[Type Safety: TypeScript]
        J[SQL Injection Prevention]
        K[Row Level Security]
    end

    style D fill:#2196F3,stroke:#1976D2
    style E fill:#FF9800,stroke:#F57C00
    style F fill:#4CAF50,stroke:#388E3C
```

## Key Implementation Details

1. **Type Safety**
   - Strict TypeScript throughout
   - Zod schemas for runtime validation
   - Drizzle schema for type-safe queries
   - DTOs for data transfer

2. **Performance**
   - React Server Components by default
   - Selective client components with `use client`
   - Server Actions for mutations
   - Edge runtime where applicable

3. **Data Security**
   - Middleware authentication
   - Server-side validation
   - PostgreSQL Row Level Security
   - Type-safe database queries

4. **Code Organization**
   - Feature-based directory structure
   - Separation of server/client concerns
   - Centralized data access layer
   - Reusable components

## Security Implementation

- **Authentication**
  - JWT-based session management
  - Route protection via middleware
  - Secure session cookie handling

- **Data Access**
  - Centralized through Data Access Layer
  - Parameterized queries via Drizzle
  - Row Level Security policies
  - Type-safe database operations

- **Input Validation**
  - Server-side Zod validation
  - TypeScript type checking
  - Sanitized database queries
  - XSS prevention

## Best Practices

- Server Components for data fetching
- Server Actions for mutations
- Edge runtime for global deployment
- Type safety at all levels
- Performance optimization via RSC
- Security in depth approach
