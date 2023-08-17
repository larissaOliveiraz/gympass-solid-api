import fastify from "fastify";
import { z } from "zod";
import { prisma } from "./lib/prisma";
import { registerUser } from "./controllers/register-controller";
import { appRoutes } from "./routes";

export const app = fastify();

app.register(appRoutes);
