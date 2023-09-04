import { makeFetchNearbyGymsService } from "@/services/factories/make-fetch-nearby-gyms-service";
import { makeSearchGymsService } from "@/services/factories/make-search-gyms-service";
import { FastifyReply, FastifyRequest } from "fastify";
import { number, z } from "zod";

export async function nearby(request: FastifyRequest, reply: FastifyReply) {
   const nearbyGymQuerySchema = z.object({
      latitude: z.number().refine((value) => Math.abs(value) <= 90),
      longitude: z.number().refine((value) => Math.abs(value) <= 180),
   });

   const { latitude, longitude } = nearbyGymQuerySchema.parse(request.query);

   const service = makeFetchNearbyGymsService();

   const { gyms } = await service.execute({
      userLatitude: latitude,
      userLongitude: longitude,
   });

   return reply.status(200).send({ gyms });
}
