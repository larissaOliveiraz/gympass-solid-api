import { makeSearchGymsService } from "@/services/factories/make-search-gyms-service";
import { FastifyReply, FastifyRequest } from "fastify";
import { z } from "zod";

export async function search(request: FastifyRequest, reply: FastifyReply) {
   const createSearchBodySchema = z.object({
      q: z.string(),
      page: z.coerce.number().min(1).default(1),
   });

   const { q, page } = createSearchBodySchema.parse(request.body);

   const service = makeSearchGymsService();

   const { gyms } = await service.execute({
      query: q,
      page,
   });

   return reply.status(200).send({ gyms });
}
