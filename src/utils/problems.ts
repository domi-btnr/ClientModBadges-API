import { getSchemaPath } from "@nestjs/swagger";

import { ProblemDetailsDTO } from "../problems/dto/problem-details.dto";

type SchemaProperties = Record<string, object>;

type ProblemDetailsContentOptions = {
  /** Additional JSON Schema `properties` to merge into the schema, e.g. to document extra fields like `errors`. */
  properties?: SchemaProperties;
};

type ProblemDetailsContent = {
  "application/problem+json": {
    schema: {
      allOf: [{ $ref: string }];
      properties?: SchemaProperties;
      example: Partial<ProblemDetailsDTO> & Record<string, unknown>;
    };
  };
};

/**
 * Wraps a {@link ProblemDetailsDTO} example into an `application/problem+json` content block
 * suitable for use in Swagger `@ApiResponse` decorators.
 *
 * @param {Partial<ProblemDetailsDTO> & Record<string, unknown>} example - Example object based on {@link ProblemDetailsDTO}. Extra fields (e.g. `errors`) are allowed for responses that extend the base schema.
 * @param {ProblemDetailsContentOptions} [options] - Optional schema extensions.
 * @param {SchemaProperties} [options.properties] - Additional JSON Schema properties to include alongside the base DTO schema.
 * @returns {ProblemDetailsContent} A content object keyed by `application/problem+json` with the example embedded in the schema.
 */
export const buildProblemDetailsContent = (
  example: Partial<ProblemDetailsDTO> & Record<string, unknown>,
  options?: ProblemDetailsContentOptions
): ProblemDetailsContent => ({
  "application/problem+json": {
    schema: {
      allOf: [{ $ref: getSchemaPath(ProblemDetailsDTO) }],
      ...(options?.properties && { properties: options.properties }),
      example
    }
  }
});
