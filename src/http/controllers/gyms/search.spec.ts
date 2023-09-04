import { app } from "@/app";
import { createAndAuthenticateUser } from "@/utils/test/create-and-authenticate-user";
import { afterAll, beforeAll, describe, expect, it } from "vitest";
import request from "supertest";

describe("Search Gyms Controller - E2E", () => {
   beforeAll(async () => {
      app.ready();
   });

   afterAll(async () => {
      app.close();
   });

   it("should be able to search gyms", async () => {
      const { token } = await createAndAuthenticateUser(app);

      await request(app.server)
         .post("/gyms")
         .set("Authorization", `Bearer ${token}`)
         .send({
            title: "Fit Gym",
            description: "Gym description",
            phone: "1133996688",
            latitude: -23.4591186,
            longitude: -46.6802013,
         });

      await request(app.server)
         .post("/gyms")
         .set("Authorization", `Bearer ${token}`)
         .send({
            title: "Running Gym",
            description: "Gym description",
            phone: "1133996688",
            latitude: -23.4591186,
            longitude: -46.6802013,
         });

      const response = await request(app.server)
         .get("/gyms/search")
         .query({
            q: "Running",
         })
         .set("Authorization", `Bearer ${token}`)
         .send();

      expect(response.statusCode).toEqual(200);
      expect(response.body.gyms).toHaveLength(1);
      expect(response.body.gyms).toEqual([
         expect.objectContaining({ title: "Running Gym" }),
      ]);
   });
});
