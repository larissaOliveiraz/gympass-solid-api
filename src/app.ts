import fastify from "fastify";
import { ZodError } from "zod";
import { env } from "./env";
import { fastifyJwt } from "@fastify/jwt";
import { gymRoutes } from "./http/controllers/gyms/routes";
import { userRoutes } from "./http/controllers/users/routes";

export const app = fastify();

app.register(fastifyJwt, {
   secret: env.JWT_SECRET,
});

app.register(userRoutes);
app.register(gymRoutes);

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
