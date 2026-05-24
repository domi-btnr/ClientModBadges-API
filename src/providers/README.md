# Providers

Integrations with external services and APIs. Each provider is responsible for communicating with one external system and exposing its data in a shape the rest of the application can consume.

## Structure

```
[provider]/
├── [provider].provider.ts   # NestJS injectable, HTTP client logic
├── dto/
│   └── [name].dto.ts        # Shapes of the external API's request/response payloads
└── mapper/
    └── to-[entity].mapper.ts  # Transforms external DTOs into internal domain types
```

## Guidelines

- Providers should be pure data-fetching boundaries — no business logic.
- DTOs under `dto/` reflect the external API's contract, not the application's domain model. Keep them separate.
- Mappers under `mapper/` are responsible for the translation between external DTOs and internal types. One mapper per target shape.
- Register the provider in the module that owns it; export it if other modules need access.
