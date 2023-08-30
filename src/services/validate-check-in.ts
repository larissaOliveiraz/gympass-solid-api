import { CheckInsRepository } from "@/repositories/check-ins-repository";
import { GymsRepository } from "@/repositories/gyms-repository";
import { CheckIn } from "@prisma/client";
import { ResourceNotFoundError } from "./errors/resource-not-found-error";
import { getDistanceBetweenCoordinates } from "@/utils/get-distance-between-coordinates";
import { MaxDistanceError } from "./errors/max-distance-error";
import { MaxNumberOfCheckInsError } from "./errors/max-number-of-check-ins-error";
interface ValidateCheckInServiceRequest {
   checkInId: string;
}

interface ValidateCheckInServiceResponse {
   checkIn: CheckIn;
}

export class ValidateCheckInService {
   constructor(private checkInsRepository: CheckInsRepository) {}

   async execute({
      checkInId,
   }: ValidateCheckInServiceRequest): Promise<ValidateCheckInServiceResponse> {
      const checkIn = await this.checkInsRepository.findById(checkInId);

      if (!checkIn) {
         throw new ResourceNotFoundError();
      }

      checkIn.validated_at = new Date();

      await this.checkInsRepository.save(checkIn);

      return { checkIn };
   }
}
