# Problems

Implementation of [RFC 9457 — Problem Details for HTTP APIs](https://www.rfc-editor.org/rfc/rfc9457). Provides a consistent, structured error format across the entire API using `application/problem+json`.

## Subfolders

| Folder       | Purpose                                                             |
| ------------ | ------------------------------------------------------------------- |
| `dto/`       | Shape of a Problem Details payload                                  |
| `exception/` | Custom NestJS exceptions that carry a Problem Details payload       |
| `filter/`    | Exception filters that catch problems and write the HTTP response   |
| `response/`  | OpenAPI/Swagger decorator factories for documenting problem responses — no runtime effect |

A Problem Details response always includes at least `type`, `title`, and `status`. Additional fields (`detail`, `instance`, extension members) are optional.
