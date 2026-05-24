# Problems / Filter

NestJS exception filter responsible for catching all exceptions and writing a well-formed `application/problem+json` HTTP response.

## Catch Behaviour

The filter handles exceptions in three branches, in order:

| Priority | Condition                                        | Behaviour                                                                                                                                    |
| -------- | ------------------------------------------------ | -------------------------------------------------------------------------------------------------------------------------------------------- |
| 1        | `instanceof ProblemDetailsException`             | Serializes the exception's payload as-is using its status code. Covers all pre-built exceptions since they extend `ProblemDetailsException`. |
| 2        | `instanceof NotFoundException` (NestJS built-in) | Maps to the `notFound404Body` payload. Handles cases where third-party libraries throw NestJS's own exception.                               |
| 3        | Anything else                                    | Falls back to `internalServerError500Body` with status 500.                                                                                  |

## Registration

The filter must be registered globally so that every unhandled exception is caught regardless of where it is thrown:

```ts
app.useGlobalFilters(new ProblemDetailsFilter());
```

All responses from this filter have `Content-Type: application/problem+json`.
