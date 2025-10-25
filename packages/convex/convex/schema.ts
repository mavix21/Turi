import { defineSchema, defineTable } from "convex/server";

import { locations } from "./tables/locations";

const schema = defineSchema({
  locations,
});

export default schema;
