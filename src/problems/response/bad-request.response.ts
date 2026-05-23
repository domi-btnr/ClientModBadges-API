import { applyDecorators } from "@nestjs/common";
import { ApiExtraModels, ApiResponse } from "@nestjs/swagger";
import { buildProblemDetailsContent } from "@utils";

import { ProblemDetailsDTO } from "../dto/problem-details.dto";

const defaultExample = {
  type: "error:api@clientmodbadges:validation-failed",
  status: 400,
  title: "Validation failed",
  errors: [{ detail: "userId must be a valid Discord ID (17-20 digits long)." }]
};

export const BadRequestProblemResponse = (override?: Partial<typeof defaultExample>) =>
  applyDecorators(
    ApiExtraModels(ProblemDetailsDTO),
    ApiResponse({
      status: 400,
      description: "Validation of the request parameters or body failed",
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
