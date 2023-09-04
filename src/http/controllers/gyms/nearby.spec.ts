import { app } from "@/app";
import { createAndAuthenticateUser } from "@/utils/test/create-and-authenticate-user";
import { afterAll, beforeAll, describe, expect, it } from "vitest";
import request from "supertest";

describe("Nearby Gyms Controller - E2E", () => {
   beforeAll(async () => {
      app.ready();
   });

   afterAll(async () => {
      app.close();
   });

   it("should be able to fetch nearby gyms", async () => {
      const { token } = await createAndAuthenticateUser(app);

      await request(app.server)
         .post("/gyms")
         .set("Authorization", `Bearer ${token}`)
         .send({
            title: "Near Gym",
            description: null,
            phone: null,
            latitude: -23.4591186,
            longitude: -46.6802013,
         });

      await request(app.server)
         .post("/gyms")
         .set("Authorization", `Bearer ${token}`)
         .send({
            title: "Far Gym",
            description: null,
            phone: null,
            latitude: -23.6842928,
            longitude: -46.5580988,
         });

      const response = await request(app.server)
         .get("/gyms/nearby")
         .query({
            latitude: -23.4591186,
            longitude: -46.6802013,
         })
         .set("Authorization", `Bearer ${token}`)
         .send();

      expect(response.statusCode).toEqual(200);
      expect(response.body.gyms).toHaveLength(1);
      expect(response.body.gyms).toEqual([
         expect.objectContaining({ title: "Near Gym" }),
      ]);
   });
});
