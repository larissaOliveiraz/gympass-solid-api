import { InMemoryCheckInsRepository } from "@/repositories/in-memory/in-memory-check-ins-repository";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { ValidateCheckInService } from "./validate-check-in";
import { ResourceNotFoundError } from "./errors/resource-not-found-error";

let checkInsRepository: InMemoryCheckInsRepository;
let sut: ValidateCheckInService;

describe("Validate Check In Service", () => {
   beforeEach(async () => {
      checkInsRepository = new InMemoryCheckInsRepository();
      sut = new ValidateCheckInService(checkInsRepository);

      // vi.useFakeTimers();
   });

   afterEach(() => {
      // vi.useRealTimers()
   });

   it("should be able to validate check-in", async () => {
      const createdCheckIn = await checkInsRepository.create({
         gym_id: "gym-01",
         user_id: "user-01",
      });

      const { checkIn } = await sut.execute({ checkInId: createdCheckIn.id });

      expect(checkIn.validated_at).toEqual(expect.any(Date));
      expect(checkInsRepository.items[0].created_at).toEqual(expect.any(Date));
   });

   it("should not be able to validate a nonexistent check-in", async () => {
      await expect(() =>
         sut.execute({
            checkInId: "nonexistent-id",
         })
      ).rejects.toBeInstanceOf(ResourceNotFoundError);
   });
});
