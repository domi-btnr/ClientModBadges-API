# Problems / Exception

Custom NestJS exceptions that wrap a Problem Details payload. Throwing one of these from anywhere in the application guarantees that the response will be formatted as `application/problem+json` by the global filter.

The exception files are also the **source of truth** for each error's default payload — response decorators and the filter both import their body constants from here.

## Pre-built Exceptions

| Exception                             | Status | When to use                             |
| ------------------------------------- | ------ | --------------------------------------- |
| `BadRequestProblemException`          | 400    | Malformed request or invalid parameters |
| `NotFoundProblemException`            | 404    | Requested resource does not exist       |
| `InternalServerErrorProblemException` | 500    | Unexpected server-side failures         |

All pre-built exceptions accept an optional `override` argument to customise the payload for the specific occurrence:

```ts
throw new NotFoundProblemException({ detail: 'User with ID 123 was not found.' });
throw new BadRequestProblemException({ type: 'error:api@clientmodbadges:validation-failed', errors: [...] });
```

## Base Exception

Use `ProblemDetailsException` directly when none of the pre-built exceptions fit:

```ts
throw new ProblemDetailsException({ type: "...", status: 409, title: "Conflict" }, 409);
```

## Adding a New Exception

1. Create `[http-reason].exception.ts` (e.g. `conflict.exception.ts`).
2. Export a body constant with the default payload (`conflict409Body`).
3. Export a class that extends `ProblemDetailsException` and spreads the body constant.
4. Re-export everything through `index.ts`.

```ts
import { ProblemDetailsException } from "./problem-details.exception";

export const conflict409Body = {
  type: "error:api@clientmodbadges:[reason]",
  status: 409,
  title: "Conflict",
  detail: "..."
};

export class ConflictProblemException extends ProblemDetailsException {
  constructor(override?: Record<string, unknown>) {
    super({ ...conflict409Body, ...override }, conflict409Body.status);
  }
}
```

## Guidelines

- Do not catch these exceptions manually — the global filter handles them.
- The body constant (e.g. `notFound404Body`) should be imported by the corresponding response decorator and the filter — not redefined.
