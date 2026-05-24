import { ProblemDetailsException } from "./problem-details.exception";

export const badRequest400Body = {
  type: "error:api@clientmodbadges:validation-failed",
  status: 400,
  title: "Validation failed",
  detail: "Validation of the request parameters or body failed."
};

export class BadRequestProblemException extends ProblemDetailsException {
  constructor(errors?: Array<{ detail: string }>) {
    super({ ...badRequest400Body, ...(errors && { errors }) }, badRequest400Body.status);
  }
}
