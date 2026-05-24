# Problems / DTO

Data Transfer Objects that define the shape of a Problem Details payload as specified by [RFC 9457](https://www.rfc-editor.org/rfc/rfc9457).

## Standard Fields

All fields are optional per [RFC 9457](https://www.rfc-editor.org/rfc/rfc9457), but should be populated wherever possible for a useful error response.

| Field    | Type     | Description                                            |
| -------- | -------- | ------------------------------------------------------ |
| `type`   | `string` | URI identifying the problem type                       |
| `title`  | `string` | Short, human-readable summary of the problem           |
| `status` | `number` | HTTP status code                                       |
| `detail` | `string` | Human-readable explanation specific to this occurrence |

## Extension Members

RFC 9457 allows additional fields beyond the standard ones. `instance` (a URI identifying the specific occurrence) is a common extension not currently part of the DTO, but can be added when needed. Problem-type-specific fields (e.g. `errors` for validation failures) can also be introduced per response.
