import { INestApplication, Module } from "@nestjs/common";
import { DocumentBuilder, OpenAPIObject, SwaggerModule } from "@nestjs/swagger";
import { ProblemDetailsDTO } from "@problems/dto";
import { internalServerError500Response } from "@problems/response";
import { getAppUrl } from "@utils";
import { Logger } from "nestjs-pino/Logger";

@Module({
  imports: [SwaggerModule]
})
export class OpenAPIModule {
  static init(app: INestApplication): () => Promise<void> {
    const config = new DocumentBuilder()
      .setOpenAPIVersion("3.2.0")
      .setTitle("ClientModBadges-API Documentation")
      .setDescription(
        "Swagger API documentation for the ClientModBadges-API\n\n" +
          "Spec: [openapi.json](/docs/openapi.json) · [openapi.yaml](/docs/openapi.yaml)"
      )
      .build();

    const document = SwaggerModule.createDocument(app, config, {
      operationIdFactory: (_controllerKey: string, methodKey: string) => methodKey,
      extraModels: [ProblemDetailsDTO]
    });

    OpenAPIModule.injectGlobal500(document);

    SwaggerModule.setup("docs", app, document, {
      customSiteTitle: "ClientModBadges-API Documentation",
      jsonDocumentUrl: "/docs/openapi.json",
      yamlDocumentUrl: "/docs/openapi.yaml",
      customCss: ".swagger-ui .topbar { display: none }",
      swaggerOptions: {
        displayRequestDuration: true
      }
    });

    return async () => {
      const appUrl = await getAppUrl(app);
      app.get(Logger).log(`OpenAPI documentation available at ${appUrl}/docs`, "OpenAPIModule");
    };
  }

  private static injectGlobal500(document: OpenAPIObject): void {
    for (const path of Object.values(document.paths ?? {})) {
      for (const operation of Object.values(path ?? {})) {
        if (typeof operation === "object" && operation !== null && "responses" in operation) {
          (operation as { responses: Record<string, unknown> }).responses["500"] = internalServerError500Response;
        }
      }
    }
  }
}
