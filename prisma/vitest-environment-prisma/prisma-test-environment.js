export default {
   name: "prisma",
   transformMode: "ssr",
   async setup() {
      console.log("Setup");

      return {
         teardown() {
            console.log("Teardown");
         },
      };
   },
};
