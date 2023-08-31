import { FastifyReply, FastifyRequest } from "fastify";

export function profile(request: FastifyRequest, reply: FastifyReply) {
   return reply.status(200).send();
}
