import { app } from "@/app";
import { createAndAuthenticateUser } from "@/utils/test/create-and-authenticate-user";
import { afterAll, beforeAll, describe, expect, it } from "vitest";
import request from "supertest";
import { prisma } from "@/lib/prisma";

describe("Validate Check In Controller - E2E", () => {
   beforeAll(async () => {
      await app.ready();
   });

   afterAll(async () => {
      await app.close();
   });

   it("should be able to validate check in", async () => {
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

      await request(app.server)
         .post(`/gyms/${gym?.id}/check-ins`)
         .set("Authorization", `Bearer ${token}`)
         .send({
            latitude: -23.6842928,
            longitude: -46.5580988,
         });

      const checkIn = await prisma.checkIn.findFirst({
         where: {
            gym_id: gym?.id,
         },
      });

      const response = await request(app.server)
         .patch(`/check-ins/${checkIn?.id}/validate`)
         .set("Authorization", `Bearer ${token}`)
         .send();

      expect(response.statusCode).toEqual(204);
   });
});
