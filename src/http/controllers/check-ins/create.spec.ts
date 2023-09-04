import { app } from "@/app";
import { createAndAuthenticateUser } from "@/utils/test/create-and-authenticate-user";
import { afterAll, beforeAll, describe, expect, it } from "vitest";
import request from "supertest";
import { prisma } from "@/lib/prisma";

describe("Create Check In Controller - E2E", () => {
   beforeAll(async () => {
      await app.ready();
   });

   afterAll(async () => {
      await app.close();
   });

   it("should be able to create check in", async () => {
      const { token } = await createAndAuthenticateUser(app);

      await request(app.server)
         .post("/gyms")
         .set("Authorization", `Bearer ${token}`)
         .send({
            title: "Fit Gym",
            description: "Gym description",
            phone: "1133996644",
            latitude: -23.6842928,
            longitude: -46.5580988,
         });

      const gym = await prisma.gym.findFirst({
         where: {
            title: "Fit Gym",
         },
      });

      const response = await request(app.server)
         .post(`/gyms/${gym?.id}/check-ins`)
         .set("Authorization", `Bearer ${token}`)
         .send({
            latitude: -23.6842928,
            longitude: -46.5580988,
         });

      expect(response.statusCode).toEqual(201);
   });
});
