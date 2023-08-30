import { PrismaUsersRepository } from "@/repositories/prisma/prisma-users-repository";
import { AuthenticationService } from "@/services/authentication";
import { InvalidCredentialsError } from "@/services/errors/invalid-credentials-error";
import { makeAuthenticationService } from "@/services/factories/make-authentication-service";
import { FastifyReply, FastifyRequest } from "fastify";
import { z } from "zod";

export async function authenticateUser(
   request: FastifyRequest,
   reply: FastifyReply
) {
   const authenticationBodySchema = z.object({
      email: z.string().email(),
      password: z.string().min(6),
   });

   const { email, password } = authenticationBodySchema.parse(request.body);

   try {
      const authenticationService = makeAuthenticationService();

      await authenticationService.execute({
         email,
         password,
      });
   } catch (error) {
      if (error instanceof InvalidCredentialsError) {
         return reply.status(400).send({ message: error.message });
      }

      throw error;
   }

   return reply.status(200).send();
}
