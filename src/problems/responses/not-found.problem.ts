import { applyDecorators } from "@nestjs/common";
import { ApiExtraModels, ApiResponse, getSchemaPath } from "@nestjs/swagger";

import { ProblemDetailsDTO } from "./problem-details.dto";

const DESCRIPTION = "The requested resource was not found";

const defaultExample = {
  type: "error:api@clientmodbadges:not-found",
  status: 404,
  title: "Not found",
  detail: "The requested resource was not found"
};

const buildContent = (example: Partial<ProblemDetailsDTO>) => ({
  "application/problem+json": {
    schema: {
      allOf: [{ $ref: getSchemaPath(ProblemDetailsDTO) }],
      example
    }
  }
});

export const notFound404Body = defaultExample;

export const NotFoundProblemResponse = (override?: Partial<ProblemDetailsDTO>) =>
  applyDecorators(
    ApiExtraModels(ProblemDetailsDTO),
    ApiResponse({
      status: 404,
      description: DESCRIPTION,
      content: buildContent({ ...defaultExample, ...override })
    })
  );
