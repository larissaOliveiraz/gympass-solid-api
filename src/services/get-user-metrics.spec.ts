import { CheckInsRepository } from "@/repositories/check-ins-repository";
import { beforeEach, describe, expect, it } from "vitest";
import { GetUserMetricsService } from "./get-user-metrics";
import { InMemoryCheckInsRepository } from "@/repositories/in-memory/in-memory-check-ins-repository";

let checkInsRepository: CheckInsRepository;
let sut: GetUserMetricsService;

describe("Get UserMetrics Service", () => {
   beforeEach(async () => {
      checkInsRepository = new InMemoryCheckInsRepository();
      sut = new GetUserMetricsService(checkInsRepository);
   });

   it("should be able to get check-in count from metrics", async () => {
      await checkInsRepository.create({
         gym_id: "gym-01",
         user_id: "user-01",
      });

      await checkInsRepository.create({
         gym_id: "gym-02",
         user_id: "user-01",
      });

      const { checkInsCount } = await sut.execute({ userId: "user-01" });

      expect(checkInsCount).toBe(2);
   });
});
