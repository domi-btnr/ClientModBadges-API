import { INestApplication, Module } from "@nestjs/common";
import { DocumentBuilder, SwaggerModule } from "@nestjs/swagger";
import { Logger } from "nestjs-pino/Logger";

import { getAppUrl } from "../constants";

@Module({
  imports: [SwaggerModule]
})
export class OpenAPIModule {
  static init(app: INestApplication): () => Promise<void> {
    const config = new DocumentBuilder()
      .setTitle("ClientModBadges-API Documentation")
      .setDescription(
        "Swagger API documentation for the ClientModBadges-API\n\n" +
          "Spec: [openapi.json](/docs/openapi.json) · [openapi.yaml](/docs/openapi.yaml)"
      )
      .build();

    const document = SwaggerModule.createDocument(app, config, {
      operationIdFactory: (controllerKey: string, methodKey: string) => methodKey
    });
    SwaggerModule.setup("docs", app, document, {
      customSiteTitle: "ClientModBadges-API Documentation",
      jsonDocumentUrl: "/docs/openapi.json",
      yamlDocumentUrl: "/docs/openapi.yaml",
      customCss: ".swagger-ui .topbar { display: none }"
    });

    return async () => {
      const appUrl = await getAppUrl(app);
      app.get(Logger).log(`OpenAPI documentation available at ${appUrl}/docs`, "OpenAPIModule");
    };
  }
}
