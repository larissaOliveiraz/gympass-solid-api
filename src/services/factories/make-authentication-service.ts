import { PrismaUsersRepository } from "@/repositories/prisma/prisma-users-repository";
import { AuthenticationService } from "../authentication";

export function makeAuthenticationService() {
   const usersRepository = new PrismaUsersRepository();
   const service = new AuthenticationService(usersRepository);

   return service;
}
