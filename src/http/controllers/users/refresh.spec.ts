import { app } from "@/app";
import { afterAll, beforeAll, describe, expect, it } from "vitest";
import request from "supertest";

describe("Refresh Token Controller - E2E", () => {
   beforeAll(async () => {
      await app.ready();
   });

   afterAll(async () => {
      await app.close();
   });

   it("should be able to refresh a token", async () => {
      await request(app.server).post("/users").send({
         name: "John",
         email: "john@example.com",
         password: "123456",
      });

      const authResponse = await request(app.server).post("/sessions").send({
         email: "john@example.com",
         password: "123456",
      });

      const cookies = authResponse.get("Set-Cookie");

      const response = await request(app.server)
         .patch("/token/refresh")
         .set("Cookie", cookies)
         .send();

      expect(response.statusCode).toEqual(200);
      expect(response.body).toEqual({
         token: expect.any(String),
      });
      expect(response.get("Set-Cookie")).toEqual([
         expect.stringContaining("refreshToken="),
      ]);
   });
});
