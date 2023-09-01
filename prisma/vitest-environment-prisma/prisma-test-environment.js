import "dotenv/config";
import { randomUUID } from "crypto";
import { execSync } from "child_process";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

function generateDatabaseURL(schema) {
   if (!process.env.DATABASE_URL) {
      throw new Error("Please provide a DATABASE_URL environment variable.");
   }

   const url = new URL(process.env.DATABASE_URL);

   url.searchParams.set("schema", schema);

   return url.toString();
}

export default {
   name: "prisma",
   transformMode: "ssr",
   async setup() {
      const schema = randomUUID();
      const databaseURL = generateDatabaseURL(schema);

      process.env.DATABASE_URL = databaseURL;

      execSync("npx prisma migrate deploy");

      return {
         async teardown() {
            await prisma.$executeRawUnsafe(`
               DROP SCHEMA IF EXISTS "${schema}" CASCADE
            `);

            await prisma.$disconnect();
         },
      };
   },
};
