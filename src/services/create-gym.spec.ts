import { InMemoryGymsRepository } from "@/repositories/in-memory/in-memory-gyms-repository";
import { beforeEach, describe, expect, it } from "vitest";
import { CreateGymService } from "./create-gym-service";

let gymsRepository: InMemoryGymsRepository;
let sut: CreateGymService;

describe("Create Gym Service", () => {
   beforeEach(() => {
      gymsRepository = new InMemoryGymsRepository();
      sut = new CreateGymService(gymsRepository);
   });

   it("should be able to create gym", async () => {
      const { gym } = await sut.execute({
         title: "New Gym",
         description: null,
         phone: null,
         latitude: -23.4591186,
         longitude: -46.6802013,
      });

      expect(gym.id).toEqual(expect.any(String));
   });
});
