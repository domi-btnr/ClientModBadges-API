import { applyDecorators } from "@nestjs/common";
import { ApiExtraModels, ApiResponse, getSchemaPath } from "@nestjs/swagger";

import { ProblemDetailsDTO } from "./problem-details.dto";

const DESCRIPTION = "An unexpected technical issue occurred during request processing";

const defaultExample = {
  type: "error:api@clientmodbadges:internal-server-error",
  status: 500,
  title: "Internal Server Error",
  detail: "An internal error happened during request processing. Please try again later."
};

const buildContent = (example: Partial<ProblemDetailsDTO>) => ({
  "application/problem+json": {
    schema: {
      allOf: [{ $ref: getSchemaPath(ProblemDetailsDTO) }],
      example
    }
  }
});

export const internalServerError500Response = {
  description: DESCRIPTION,
  content: buildContent(defaultExample)
};

export const InternalServerErrorProblemResponse = (override?: Partial<ProblemDetailsDTO>) =>
  applyDecorators(
    ApiExtraModels(ProblemDetailsDTO),
    ApiResponse({
      status: 500,
      description: DESCRIPTION,
      content: buildContent({ ...defaultExample, ...override })
    })
  );
