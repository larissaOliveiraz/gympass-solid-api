import { PrismaUsersRepository } from "@/repositories/prisma/prisma-users-repository";
import { AuthenticationService } from "../authentication-service";

export function makeAuthenticationService() {
   const usersRepository = new PrismaUsersRepository();
   const authenticationService = new AuthenticationService(usersRepository);

   return authenticationService;
}
