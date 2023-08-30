import { InMemoryCheckInsRepository } from "@/repositories/in-memory/in-memory-check-ins-repository";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { CheckInService } from "./check-in";
import { InMemoryGymsRepository } from "@/repositories/in-memory/in-memory-gyms-repository";
import { Decimal } from "@prisma/client/runtime/library";
import { MaxNumberOfCheckInsError } from "./errors/max-number-of-check-ins-error";
import { MaxDistanceError } from "./errors/max-distance-error";

let checkInsRepository: InMemoryCheckInsRepository;
let gymsRepository: InMemoryGymsRepository;
let sut: CheckInService;

describe("Check In Service", () => {
   beforeEach(async () => {
      checkInsRepository = new InMemoryCheckInsRepository();
      gymsRepository = new InMemoryGymsRepository();
      sut = new CheckInService(checkInsRepository, gymsRepository);

      await gymsRepository.create({
         id: "gym-01",
         title: "Java Gym",
         description: "",
         phone: "",
         latitude: -23.4591186,
         longitude: -46.6802013,
      });

      vi.useFakeTimers();
   });

   afterEach(() => {
      vi.useRealTimers();
   });

   it("should be able to check in", async () => {
      const { checkIn } = await sut.execute({
         userId: "user-01",
         gymId: "gym-01",
         userLatitude: -23.4591186,
         userLongitude: -46.6802013,
      });

      expect(checkIn.id).toEqual(expect.any(String));
   });

   it("should not be able to check in twice in the day", async () => {
      vi.setSystemTime(new Date(2022, 0, 20, 8, 0, 0));

      await sut.execute({
         userId: "user-01",
         gymId: "gym-01",
         userLatitude: -23.4591186,
         userLongitude: -46.6802013,
      });

      await expect(() =>
         sut.execute({
            userId: "user-01",
            gymId: "gym-01",
            userLatitude: -23.4591186,
            userLongitude: -46.6802013,
         })
      ).rejects.toBeInstanceOf(MaxNumberOfCheckInsError);
   });

   it("should be able to check in twice in different days", async () => {
      vi.setSystemTime(new Date(2022, 0, 20, 23, 0, 0));

      await sut.execute({
         userId: "user-01",
         gymId: "gym-01",
         userLatitude: -23.4591186,
         userLongitude: -46.6802013,
      });

      vi.setSystemTime(new Date(2022, 0, 21, 0, 0, 0));

      const { checkIn } = await sut.execute({
         userId: "user-01",
         gymId: "gym-01",
         userLatitude: -23.4591186,
         userLongitude: -46.6802013,
      });

      expect(checkIn.id).toEqual(expect.any(String));
   });

   it("should not be able to check in on distant gym", async () => {
      gymsRepository.items.push({
         id: "gym-02",
         title: "Type Gym",
         description: "",
         phone: "",
         latitude: new Decimal(-23.4976544),
         longitude: new Decimal(-46.6602886),
      });

      await expect(() =>
         sut.execute({
            gymId: "gym-02",
            userId: "user-01",
            userLatitude: -23.4591186,
            userLongitude: -46.6802013,
         })
      ).rejects.toBeInstanceOf(MaxDistanceError);
   });
});
