import { applyDecorators } from "@nestjs/common";
import { ApiExtraModels, ApiResponse } from "@nestjs/swagger";

import { buildProblemDetailsContent } from "#utils";

import { ProblemDetailsDTO } from "../dto/problem-details.dto.js";
import { notFound404Body } from "../exception/not-found.exception.js";

export const NotFoundProblemResponse = (override?: Partial<ProblemDetailsDTO>) =>
  applyDecorators(
    ApiExtraModels(ProblemDetailsDTO),
    ApiResponse({
      status: notFound404Body.status,
      description: notFound404Body.title,
      content: buildProblemDetailsContent({ ...notFound404Body, ...override })
    })
  );
