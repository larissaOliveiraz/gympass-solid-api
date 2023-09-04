import { app } from "@/app";
import { createAndAuthenticateUser } from "@/utils/test/create-and-authenticate-user";
import { afterAll, beforeAll, describe, expect, it } from "vitest";
import request from "supertest";

describe("Get Check In History Controller - E2E", () => {
   beforeAll(async () => {
      await app.ready();
   });

   afterAll(async () => {
      await app.close();
   });

   it("should be able to get check in history", async () => {
      const { token } = await createAndAuthenticateUser(app);

      const response = await request(app.server)
         .get(`/check-ins/history`)
         .set("Authorization", `Bearer ${token}`)
         .send();

      expect(response.statusCode).toEqual(200);
   });
});
