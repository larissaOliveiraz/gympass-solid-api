import { InMemoryGymsRepository } from "@/repositories/in-memory/in-memory-gyms-repository";
import { beforeEach, describe, expect, it } from "vitest";
import { FetchNearbyGymsService } from "./fetch-nearby-gyms";

let gymsRepository: InMemoryGymsRepository;
let sut: FetchNearbyGymsService;

describe("Fetch Nearby Gyms Service", () => {
   beforeEach(async () => {
      gymsRepository = new InMemoryGymsRepository();
      sut = new FetchNearbyGymsService(gymsRepository);
   });

   it("should be able to fetch nearby gyms", async () => {
      await gymsRepository.create({
         title: "Near Gym",
         description: null,
         phone: null,
         latitude: -23.4591186,
         longitude: -46.6802013,
      });

      await gymsRepository.create({
         title: "Far Gym",
         description: null,
         phone: null,
         latitude: -23.6842928,
         longitude: -46.5580988,
      });

      const { gyms } = await sut.execute({
         userLatitude: -23.4591186,
         userLongitude: -46.6802013,
      });

      expect(gyms).toHaveLength(1);
      expect(gyms).toEqual([expect.objectContaining({ title: "Near Gym" })]);
   });
});
