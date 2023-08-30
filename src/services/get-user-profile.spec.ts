import { InMemoryUsersRepository } from "@/repositories/in-memory/in-memory-users-repository";
import { beforeEach, describe, expect, it } from "vitest";
import { GetUserProfileService } from "./get-user-profile";
import { hash } from "bcryptjs";
import { ResourceNotFoundError } from "./errors/resource-not-found-error";

let usersRepository: InMemoryUsersRepository;
let sut: GetUserProfileService;

describe("Get User Profile Service", () => {
   beforeEach(() => {
      usersRepository = new InMemoryUsersRepository();
      sut = new GetUserProfileService(usersRepository);
   });

   it("should be able to get user profile", async () => {
      const newUser = await usersRepository.create({
         name: "John",
         email: "john@example.com",
         password_hash: await hash("123456", 6),
      });

      const { user } = await sut.execute({
         userId: newUser.id,
      });

      expect(user.id).toEqual(expect.any(String));
      expect(user.name).toEqual("John");
   });

   it("should not be able to get user profile with wrong id", async () => {
      await expect(() =>
         sut.execute({
            userId: "this-id-does-not-exist",
         })
      ).rejects.toBeInstanceOf(ResourceNotFoundError);
   });
});
