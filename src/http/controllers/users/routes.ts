import { FastifyInstance } from "fastify";
import { registerUser } from "./register";
import { authenticateUser } from "./authentication";
import { profile } from "./profile";
import { verifyJWT } from "../../middlewares/verify-jwt";

export async function userRoutes(app: FastifyInstance) {
   app.post("/users", registerUser);
   app.post("/sessions", authenticateUser);

   // Authenticated
   app.get("/me", { onRequest: [verifyJWT] }, profile);
}
