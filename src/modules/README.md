# Modules

NestJS feature modules that make up the application's domain logic. Each module is self-contained and responsible for a single domain area.

## Structure

```
[module]/
├── [module].module.ts       # Module definition, imports, and provider wiring
├── [module].service.ts      # Business logic and data access
├── [module].controller.ts   # HTTP route handlers (omit if no routes)
└── dto/
    └── [name].dto.ts        # Request/response shapes for this module
```

## Guidelines

- A module should only expose what other modules need via `exports`.
- Keep controllers thin — delegate all logic to the service.
- DTOs live inside the module they belong to, not in a shared global folder.
- Modules that are needed application-wide should be registered in `app.module.ts`.
