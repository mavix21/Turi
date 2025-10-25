import { typedV } from "convex-helpers/validators";
import { defineSchema } from "convex/server";

import { benefits } from "./tables/benefits";
import { bookings } from "./tables/bookings";
import { checkIns } from "./tables/checkIns";
import { collectibles } from "./tables/collectibles";
import { companies } from "./tables/companies";
import { locations } from "./tables/locations";
import { tourPackages } from "./tables/tourPackages";
import { users } from "./tables/users";

const schema = defineSchema({
  locations,
  users,
  collectibles,
  checkIns,
  benefits,
  companies,
  tourPackages,
  bookings,
});

export default schema;

export const vv = typedV(schema);
