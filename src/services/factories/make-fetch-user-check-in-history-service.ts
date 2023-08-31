import { PrismaCheckInsRepository } from "@/repositories/prisma/prisma-check-ins-repository";
import { FetchUserCheckInHistoryService } from "../fetch-user-check-in-history";

export function makeFetchUserCheckInHistoryService() {
   const checkInsRepository = new PrismaCheckInsRepository();
   const service = new FetchUserCheckInHistoryService(checkInsRepository);

   return service;
}
