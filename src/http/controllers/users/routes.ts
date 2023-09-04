import { FastifyInstance } from "fastify";
import { registerUser } from "./register";
import { authenticateUser } from "./authentication";
import { profile } from "./profile";
import { verifyJWT } from "../../middlewares/verify-jwt";
import { refresh } from "./refresh";

export async function userRoutes(app: FastifyInstance) {
   app.post("/users", registerUser);
   app.post("/sessions", authenticateUser);

   app.patch("/token/refresh", refresh);

   // Authenticated
   app.get("/me", { onRequest: [verifyJWT] }, profile);
}
