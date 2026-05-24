import { ArgumentsHost, Catch, ExceptionFilter, NotFoundException } from "@nestjs/common";
import { Response } from "express";

import { internalServerError500Body } from "../exception/internal-server-error.exception";
import { notFound404Body } from "../exception/not-found.exception";
import { ProblemDetailsException } from "../exception/problem-details.exception";

@Catch()
export class ProblemDetailsFilter implements ExceptionFilter {
  catch(exception: unknown, host: ArgumentsHost): void {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();

    if (exception instanceof ProblemDetailsException) {
      response.status(exception.getStatus()).type("application/problem+json").json(exception.getResponse());
      return;
    }

    if (exception instanceof NotFoundException) {
      response.status(404).type("application/problem+json").json(notFound404Body);
      return;
    }

    response.status(500).type("application/problem+json").json(internalServerError500Body);
  }
}
