import { verifyJWT } from "@/http/middlewares/verify-jwt";
import { FastifyInstance } from "fastify";

export function gymRoutes(app: FastifyInstance) {
   app.addHook("onRequest", verifyJWT);
}
