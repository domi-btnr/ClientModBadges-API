import { ArgumentsHost, Catch, ExceptionFilter, NotFoundException } from "@nestjs/common";
import { Response } from "express";

import { ProblemDetailsException } from "../exceptions/problem-details.exception";
import { notFound404Body } from "../responses/not-found.problem";

@Catch(ProblemDetailsException, NotFoundException)
export class ProblemDetailsFilter implements ExceptionFilter {
  catch(exception: ProblemDetailsException | NotFoundException, host: ArgumentsHost): void {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();

    if (exception instanceof ProblemDetailsException) {
      response.status(exception.getStatus()).type("application/problem+json").json(exception.getResponse());
      return;
    }

    response.status(404).type("application/problem+json").json(notFound404Body);
  }
}
