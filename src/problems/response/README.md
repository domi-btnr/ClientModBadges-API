# Problems / Response

> [!NOTE]
> These are purely OpenAPI/Swagger documentation decorators. They have no effect at runtime and do not determine what is actually thrown or returned. For the runtime behaviour, see the [exception](../exception/README.md) folder.

Each response combines `ApiExtraModels` and `ApiResponse` via `applyDecorators` so that controllers can document `application/problem+json` responses with a single decorator. The default example in each decorator is derived from the corresponding exception's body constant.

## Usage

Apply the decorator factory directly to a controller method:

```ts
@Get(':id')
@NotFoundProblemResponse()
@BadRequestProblemResponse()
findOne(@Param('id') id: string) { ... }
```

All factories accept an optional `override` argument to customise the OpenAPI example for that specific route.

## Adding a New Response

Create a response file alongside its exception counterpart. Import the body constant from the exception file and use it as the base for the OpenAPI example:

1. Create `[http-reason].response.ts` (e.g. `conflict.response.ts`).
2. Import the body constant from `../exception/[http-reason].exception`.
3. Export the decorator factory using `applyDecorators(ApiExtraModels(ProblemDetailsDTO), ApiResponse({ ... }))`.
4. Re-export through `index.ts`.

```ts
import { conflict409Body } from "../exception/conflict.exception";

export const ConflictProblemResponse = (override?: Partial<ProblemDetailsDTO>) =>
  applyDecorators(
    ApiExtraModels(ProblemDetailsDTO),
    ApiResponse({
      status: conflict409Body.status,
      description: conflict409Body.title,
      content: buildProblemDetailsContent({ ...conflict409Body, ...override })
    })
  );
```
