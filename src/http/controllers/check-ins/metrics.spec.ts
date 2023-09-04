import { app } from "@/app";
import { createAndAuthenticateUser } from "@/utils/test/create-and-authenticate-user";
import { afterAll, beforeAll, describe, expect, it } from "vitest";
import request from "supertest";
import { prisma } from "@/lib/prisma";

describe("Get Check In Metrics Controller - E2E", () => {
   beforeAll(async () => {
      await app.ready();
   });

   afterAll(async () => {
      await app.close();
   });

   it("should be able to get check in metrics", async () => {
      const { token } = await createAndAuthenticateUser(app);

      const response = await request(app.server)
         .get(`/check-ins/metrics`)
         .set("Authorization", `Bearer ${token}`)
         .send();

      expect(response.statusCode).toEqual(200);
      expect(response.body.checkInsCount).toEqual(0);
   });
});
