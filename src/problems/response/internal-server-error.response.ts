import { applyDecorators } from "@nestjs/common";
import { ApiExtraModels, ApiResponse } from "@nestjs/swagger";

import { buildProblemDetailsContent } from "#utils";

import { ProblemDetailsDTO } from "../dto/problem-details.dto.js";
import { internalServerError500Body } from "../exception/internal-server-error.exception.js";

export const internalServerError500Response = {
  description: internalServerError500Body.title,
  content: buildProblemDetailsContent(internalServerError500Body)
};

export const InternalServerErrorProblemResponse = (override?: Partial<ProblemDetailsDTO>) =>
  applyDecorators(
    ApiExtraModels(ProblemDetailsDTO),
    ApiResponse({
      status: internalServerError500Body.status,
      description: internalServerError500Body.title,
      content: buildProblemDetailsContent({ ...internalServerError500Body, ...override })
    })
  );
