import { expect, it, describe } from "vitest";
import { RegisterService } from "./register-service";
import { compare } from "bcryptjs";
import { InMemoryUsersRepository } from "@/repositories/in-memory/in-memory-users-repository";
import { UserAlreadyExistsError } from "./errors/user-already-exists";

describe("Register Service", () => {
   it("should be able to register", async () => {
      const inMemoryUsersRepository = new InMemoryUsersRepository();
      const registerService = new RegisterService(inMemoryUsersRepository);

      const { user } = await registerService.execute({
         name: "John Doe",
         email: "johndoe@example.com",
         password: "123456",
      });

      expect(user.id).toEqual(expect.any(String));
   });

   it("should hash user password upon registration", async () => {
      const inMemoryUsersRepository = new InMemoryUsersRepository();
      const registerService = new RegisterService(inMemoryUsersRepository);

      const { user } = await registerService.execute({
         name: "John Doe",
         email: "johndoe@example.com",
         password: "123456",
      });

      const isPasswordHashed = await compare("123456", user.password_hash);

      expect(isPasswordHashed).toBe(true);
   });

   it("should not be able to register with same email", async () => {
      const inMemoryUsersRepository = new InMemoryUsersRepository();
      const registerService = new RegisterService(inMemoryUsersRepository);

      const email = "johndoe@example.com";

      await registerService.execute({
         name: "John Doe",
         email,
         password: "123456",
      });

      await expect(() =>
         registerService.execute({
            name: "John Doe",
            email,
            password: "123456",
         })
      ).rejects.toBeInstanceOf(UserAlreadyExistsError);
   });
});
