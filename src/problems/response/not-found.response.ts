import { applyDecorators } from "@nestjs/common";
import { ApiExtraModels, ApiResponse } from "@nestjs/swagger";
import { buildProblemDetailsContent } from "@utils";

import { ProblemDetailsDTO } from "../dto/problem-details.dto";

const defaultExample = {
  type: "error:api@clientmodbadges:not-found",
  status: 404,
  title: "Not found",
  detail: "The requested resource was not found"
};

export const notFound404Body = defaultExample;

export const NotFoundProblemResponse = (override?: Partial<ProblemDetailsDTO>) =>
  applyDecorators(
    ApiExtraModels(ProblemDetailsDTO),
    ApiResponse({
      status: 404,
      description: "The requested resource was not found",
      content: buildProblemDetailsContent({ ...defaultExample, ...override })
    })
  );
