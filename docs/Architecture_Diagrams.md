# Real Estate Application Architecture Diagrams

This document provides visual representations of the rental listing integration process and key architectural flows.

## Data Access Layer Structure

```mermaid
graph TD
    subgraph "Data Access Layer"
        A[data/listings.ts] --> B[data/supabase-client.ts]
        C[data/auth.ts] --> B
        D[data/users.ts] --> B
    end

    subgraph "Server Actions"
        E[actions/create-listing.ts]
        F[actions/update-listing.ts]
        G[actions/delete-listing.ts]
    end

    subgraph "Components"
        H[ListingCard.tsx]
        I[ListingForm.tsx]
        J[ListingGrid.tsx]
    end

    K[Supabase Database] --> B
    E --> A
    F --> A
    G --> A
    H --> A
    I --> E
    J --> A

    style A fill:#2196F3,stroke:#1976D2
    style B fill:#4CAF50,stroke:#388E3C
    style C fill:#9C27B0,stroke:#7B1FA2
    style D fill:#FF9800,stroke:#F57C00
```

## Data Flow Sequence

```mermaid
sequenceDiagram
    participant Client
    participant SSR as Server Component
    participant DAL as Data Access Layer
    participant SA as Server Action
    participant DB as Supabase DB

    Client->>SSR: Request Page
    SSR->>DAL: getCurrentUser()
    DAL->>DB: Auth Check
    DB-->>DAL: User Data
    SSR->>DAL: getListings()
    DAL->>DB: Fetch Listings
    DB-->>DAL: Raw Data
    DAL-->>SSR: DTOs
    SSR-->>Client: Rendered Page

    Note over Client,DB: Create/Update Flow
    Client->>SA: Submit Form
    SA->>DAL: validateAndCreate()
    DAL->>DB: Insert/Update
    DB-->>DAL: Result
    DAL-->>SA: Success/Error
    SA-->>Client: Redirect/Error
```

## Authentication Flow

```mermaid
flowchart LR
    A[Route Handler] -->|Check Auth| B[getCurrentUser]
    B -->|Valid| C[Allow Access]
    B -->|Invalid| D[Redirect to Login]

    style B fill:#FF4081,stroke:#C2185B
    style C fill:#4CAF50,stroke:#388E3C
    style D fill:#F44336,stroke:#D32F2F
```

## Data Security Layers

```mermaid
flowchart TD
    A[Client Request] --> B[Next.js Middleware]
    B --> C[Server Component]
    C --> D[DAL Authorization]
    D --> E[RLS Policies]
    E --> F[Database]

    style D fill:#2196F3,stroke:#1976D2
    style E fill:#FF9800,stroke:#F57C00
    style F fill:#4CAF50,stroke:#388E3C
```

## Key Implementation Notes

1. The Data Access Layer (DAL) centralizes all database interactions
2. Server Actions handle form submissions and data mutations
3. Authentication is checked at multiple levels (Middleware, DAL, RLS)
4. DTOs are used to sanitize data before sending to the client
5. Components are structured to optimize for server-side rendering
6. Security is implemented in layers from client to database

## Security Considerations

- All database access is routed through the DAL
- Authentication state is verified on every request
- Row Level Security (RLS) provides an additional security layer
- DTOs prevent exposure of sensitive data
- Server Actions validate all input data
- Middleware protects routes based on authentication state
