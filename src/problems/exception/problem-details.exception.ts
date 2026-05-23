import { HttpException } from "@nestjs/common";

export class ProblemDetailsException extends HttpException {
  constructor(body: Record<string, unknown>, status: number) {
    super(body, status);
  }
}
