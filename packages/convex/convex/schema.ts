import { typedV } from "convex-helpers/validators";
import { defineSchema } from "convex/server";

import { benefits } from "./tables/benefits";
import { checkIns } from "./tables/check-ins";
import { collectibles } from "./tables/collectibles";
import { locations } from "./tables/locations";
import { users } from "./tables/users";

const schema = defineSchema({
  locations,
  users,
  collectibles,
  checkIns,
  benefits,
});

export default schema;

export const vv = typedV(schema);
