import { ProblemDetailsException } from "./problem-details.exception";

export const internalServerError500Body = {
  type: "error:api@clientmodbadges:internal-server-error",
  status: 500,
  title: "Internal Server Error",
  detail: "An internal error happened during request processing. Please try again later."
};

export class InternalServerErrorProblemException extends ProblemDetailsException {
  constructor(override?: Record<string, unknown>) {
    super({ ...internalServerError500Body, ...override }, internalServerError500Body.status);
  }
}
