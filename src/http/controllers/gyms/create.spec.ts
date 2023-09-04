import { app } from "@/app";
import { createAndAuthenticateUser } from "@/utils/test/create-and-authenticate-user";
import { afterAll, beforeAll, describe, expect, it } from "vitest";
import request from "supertest";

describe("Create Gym Controller - E2E", () => {
   beforeAll(async () => {
      app.ready();
   });

   afterAll(async () => {
      app.close();
   });

   it("should be able to create gym", async () => {
      const { token } = await createAndAuthenticateUser(app);

      const response = await request(app.server)
         .post("/gyms")
         .set("Authorization", `Bearer ${token}`)
         .send({
            title: "Fit Gym",
            description: "Gym description",
            phone: "1133996688",
            latitude: -23.4591186,
            longitude: -46.6802013,
         });

      expect(response.statusCode).toEqual(201);
   });
});
