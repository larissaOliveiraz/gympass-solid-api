import { describe, expect, it, beforeEach } from "vitest";
import { SearchGymsService } from "./search-gyms";
import { InMemoryGymsRepository } from "@/repositories/in-memory/in-memory-gyms-repository";

let gymsRepository: InMemoryGymsRepository;
let sut: SearchGymsService;

describe("Search Gyms Service", () => {
   beforeEach(async () => {
      gymsRepository = new InMemoryGymsRepository();
      sut = new SearchGymsService(gymsRepository);
   });

   it("should be able to search for gyms", async () => {
      await gymsRepository.create({
         title: "Gym one",
         description: null,
         phone: null,
         latitude: -23.4591186,
         longitude: -46.6802013,
      });

      await gymsRepository.create({
         title: "Gym two",
         description: null,
         phone: null,
         latitude: -23.4591186,
         longitude: -46.6802013,
      });

      const { gyms } = await sut.execute({ query: "one", page: 1 });

      expect(gyms).toHaveLength(1);
      expect(gyms).toEqual([expect.objectContaining({ title: "Gym one" })]);
   });

   it("should be able to fetch paginated gym search", async () => {
      for (let i = 1; i <= 22; i++) {
         await gymsRepository.create({
            title: `Gym ${i}`,
            description: null,
            phone: null,
            latitude: -23.4591186,
            longitude: -46.6802013,
         });
      }

      const { gyms } = await sut.execute({ query: "Gym", page: 2 });

      expect(gyms).toHaveLength(2);
      expect(gyms).toEqual([
         expect.objectContaining({ title: "Gym 21" }),
         expect.objectContaining({ title: "Gym 22" }),
      ]);
   });
});
