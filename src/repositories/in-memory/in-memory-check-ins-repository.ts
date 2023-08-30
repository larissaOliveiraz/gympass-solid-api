import { CheckIn, Prisma } from "@prisma/client";
import { CheckInsRepository } from "../check-ins-repository";
import { randomUUID } from "crypto";
import dayjs from "dayjs";

export class InMemoryCheckInsRepository implements CheckInsRepository {
   public items: CheckIn[] = [];

   async findByUserIdOnDate(userId: string, date: Date) {
      const startOfDay = dayjs(date).startOf("date");
      const endOfDay = dayjs(date).endOf("date");

      const checkInOnSameDay = this.items.find((checkIn) => {
         const checkInDate = dayjs(checkIn.created_at);
         const isOnSameDate =
            checkInDate.isAfter(startOfDay) && checkInDate.isBefore(endOfDay);

         return checkIn.user_id === userId && isOnSameDate;
      });

      return checkInOnSameDay ? checkInOnSameDay : null;
   }

   async findManyByUserId(userId: string, page: number) {
      return this.items
         .filter((item) => item.user_id === userId)
         .slice((page - 1) * 20, page * 20);
   }

   async countByUserId(userId: string) {
      return this.items.filter((item) => item.user_id === userId).length;
   }

   async create(data: Prisma.CheckInUncheckedCreateInput) {
      const checkIn = {
         id: randomUUID(),
         user_id: data.user_id,
         gym_id: data.gym_id,
         validated_at: data.validated_at
            ? new Date(data.validated_at)
            : new Date(),
         created_at: new Date(),
      };

      this.items.push(checkIn);

      return checkIn;
   }
}
