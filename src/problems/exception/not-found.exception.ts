import { ProblemDetailsException } from "./problem-details.exception";

export const notFound404Body = {
  type: "error:api@clientmodbadges:not-found",
  status: 404,
  title: "Not found",
  detail: "The requested resource was not found"
};

export class NotFoundProblemException extends ProblemDetailsException {
  constructor(override?: Record<string, unknown>) {
    super({ ...notFound404Body, ...override }, notFound404Body.status);
  }
}
