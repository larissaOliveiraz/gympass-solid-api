import { makeFetchUserCheckInHistoryService } from "@/services/factories/make-fetch-user-check-in-history-service";
import { FastifyReply, FastifyRequest } from "fastify";
import { z } from "zod";

export async function history(request: FastifyRequest, reply: FastifyReply) {
   const checkInHistoryQuerySchema = z.object({
      page: z.coerce.number().min(1).default(1),
   });

   const { page } = checkInHistoryQuerySchema.parse(request.query);

   const service = makeFetchUserCheckInHistoryService();

   const { checkIns } = await service.execute({
      userId: request.user.sub,
      page,
   });

   return reply.status(200).send({ checkIns });
}
