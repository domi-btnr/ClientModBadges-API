import { applyDecorators } from "@nestjs/common";
import { ApiExtraModels, ApiResponse, getSchemaPath } from "@nestjs/swagger";

import { ProblemDetailsDTO } from "./problem-details.dto";

const defaultExample = {
  type: "error:api@clientmodbadges:validation-failed",
  status: 400,
  title: "Validation failed",
  errors: [{ detail: "userId must be a valid Discord Snowflake ID (17-20 digits long)." }]
};

export const BadRequestProblemResponse = (override?: Partial<typeof defaultExample>) =>
  applyDecorators(
    ApiExtraModels(ProblemDetailsDTO),
    ApiResponse({
      status: 400,
      description: "Validation of the request parameters or body failed",
      content: {
        "application/problem+json": {
          schema: {
            allOf: [{ $ref: getSchemaPath(ProblemDetailsDTO) }],
            properties: {
              errors: {
                type: "array",
                items: {
                  type: "object",
                  properties: {
                    detail: { type: "string", description: "A granular description of the specific error" }
                  }
                }
              }
            },
            example: { ...defaultExample, ...override }
          }
        }
      }
    })
  );
