import { applyDecorators } from "@nestjs/common";
import { ApiExtraModels, ApiResponse } from "@nestjs/swagger";
import { buildProblemDetailsContent } from "@utils";

import { ProblemDetailsDTO } from "../dto/problem-details.dto";

const defaultExample = {
  type: "error:api@clientmodbadges:internal-server-error",
  status: 500,
  title: "Internal Server Error",
  detail: "An internal error happened during request processing. Please try again later."
};

const description = "An unexpected technical issue occurred during request processing";

export const internalServerError500Response = {
  description,
  content: buildProblemDetailsContent(defaultExample)
};

export const InternalServerErrorProblemResponse = (override?: Partial<ProblemDetailsDTO>) =>
  applyDecorators(
    ApiExtraModels(ProblemDetailsDTO),
    ApiResponse({
      status: 500,
      description,
      content: buildProblemDetailsContent({ ...defaultExample, ...override })
    })
  );
