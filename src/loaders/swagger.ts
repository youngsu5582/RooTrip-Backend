import express from "express";

import swaggerUi from "swagger-ui-express";
import { getMetadataArgsStorage } from "routing-controllers";
import { routingControllersToSpec } from "routing-controllers-openapi";
import { validationMetadatasToSchemas } from "class-validator-jsonschema";

import { routingControllerOptions } from "../utils/RoutingConfig";
import { env } from "./env";
/**
 * Swagger를 사용하도록 한다.
 * @param app Express Application
 */
export function useSwagger(app: express.Application) {
  const schemas = validationMetadatasToSchemas({
    refPointerPrefix: "#/components/schemas"
  });
  const route = env.swagger.route;
  // Parse routing-controllers classes into OPENAPI spec:
  const storage = getMetadataArgsStorage();
  const spec = routingControllersToSpec(storage, routingControllerOptions, {
    components: { schemas: { ...schemas } as any },
    info: {
      title: "Test Server",
      description: "Test API",
      version: "1.0.0"
    }
  });

  app.use(route, swaggerUi.serve, swaggerUi.setup(spec));
}
