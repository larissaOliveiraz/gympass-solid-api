import fastify from "fastify";
import { appRoutes } from "./api/routes";
import { ZodError } from "zod";
import { env } from "./env";

export const app = fastify();

app.register(appRoutes);

app.setErrorHandler((error, request, reply) => {
   if (error instanceof ZodError) {
      return reply
         .status(400)
         .send({ massage: "Validation error.", issues: error.format() });
   }

   if (env.NODE_ENV !== "production") {
      console.log(error);
   } else {
      // TODO: log the error to an external tool
   }

   return reply.status(500).send({ message: "Internal server error." });
});
