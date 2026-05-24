import { applyDecorators } from "@nestjs/common";
import { ApiExtraModels, ApiResponse } from "@nestjs/swagger";
import { buildProblemDetailsContent } from "@utils";

import { ProblemDetailsDTO } from "../dto/problem-details.dto";
import { badRequest400Body } from "../exception/bad-request.exception";

const defaultExample = {
  ...badRequest400Body,
  errors: [{ detail: "userId must be a valid Discord ID (17-20 digits long)." }]
};

export const BadRequestProblemResponse = (override?: Partial<typeof defaultExample>) =>
  applyDecorators(
    ApiExtraModels(ProblemDetailsDTO),
    ApiResponse({
      status: badRequest400Body.status,
      description: badRequest400Body.title,
      content: buildProblemDetailsContent(
        { ...defaultExample, ...override },
        {
          properties: {
            errors: {
              type: "array",
              items: {
                type: "object",
                properties: {
                  detail: {
                    type: "string",
                    description: "A granular description of the specific error"
                  }
                }
              }
            }
          }
        }
      )
    })
  );
