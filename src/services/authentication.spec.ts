import { expect, it, describe, beforeEach } from "vitest";
import { RegisterService } from "./register-service";
import { InMemoryUsersRepository } from "@/repositories/in-memory/in-memory-users-repository";
import { AuthenticationService } from "./authentication-service";
import { hash } from "bcryptjs";
import { InvalidCredentialsError } from "./errors/invalid-credentials-error";

let usersRepository: InMemoryUsersRepository;
let sut: AuthenticationService;

describe("Authentication Service", () => {
   beforeEach(() => {
      usersRepository = new InMemoryUsersRepository();
      sut = new AuthenticationService(usersRepository);
   });

   it("should be able to authenticate", async () => {
      await usersRepository.create({
         name: "John",
         email: "john@example.com",
         password_hash: await hash("123456", 6),
      });

      const { user } = await sut.execute({
         email: "john@example.com",
         password: "123456",
      });

      expect(user.id).toEqual(expect.any(String));
   });

   it("should not be able to authenticate with wrong email", async () => {
      await expect(() =>
         sut.execute({
            email: "john@example.com",
            password: "123456",
         })
      ).rejects.toBeInstanceOf(InvalidCredentialsError);
   });

   it("should not be able to authenticate with wrong password", async () => {
      await usersRepository.create({
         name: "John",
         email: "john@example.com",
         password_hash: await hash("123456", 6),
      });

      await expect(() =>
         sut.execute({
            email: "john@example.com",
            password: "123123",
         })
      ).rejects.toBeInstanceOf(InvalidCredentialsError);
   });
});
