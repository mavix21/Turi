/* eslint-disable */
/**
 * Generated `api` utility.
 *
 * THIS CODE IS AUTOMATICALLY GENERATED.
 *
 * To regenerate, run `npx convex dev`.
 * @module
 */

import type * as authUtils from "../authUtils.js";
import type * as benefits from "../benefits.js";
import type * as checkIns from "../checkIns.js";
import type * as debug from "../debug.js";
import type * as http from "../http.js";
import type * as init from "../init.js";
import type * as locations from "../locations.js";
import type * as seedCompaniesAndTours from "../seedCompaniesAndTours.js";
import type * as tables_benefits from "../tables/benefits.js";
import type * as tables_bookings from "../tables/bookings.js";
import type * as tables_checkIns from "../tables/checkIns.js";
import type * as tables_collectibles from "../tables/collectibles.js";
import type * as tables_companies from "../tables/companies.js";
import type * as tables_locations from "../tables/locations.js";
import type * as tables_tourPackages from "../tables/tourPackages.js";
import type * as tables_userProfile from "../tables/userProfile.js";
import type * as tables_users from "../tables/users.js";
import type * as tourPackages from "../tourPackages.js";
import type * as userProfile from "../userProfile.js";
import type * as users from "../users.js";

import type {
  ApiFromModules,
  FilterApi,
  FunctionReference,
} from "convex/server";

/**
 * A utility for referencing Convex functions in your app's API.
 *
 * Usage:
 * ```js
 * const myFunctionReference = api.myModule.myFunction;
 * ```
 */
declare const fullApi: ApiFromModules<{
  authUtils: typeof authUtils;
  benefits: typeof benefits;
  checkIns: typeof checkIns;
  debug: typeof debug;
  http: typeof http;
  init: typeof init;
  locations: typeof locations;
  seedCompaniesAndTours: typeof seedCompaniesAndTours;
  "tables/benefits": typeof tables_benefits;
  "tables/bookings": typeof tables_bookings;
  "tables/checkIns": typeof tables_checkIns;
  "tables/collectibles": typeof tables_collectibles;
  "tables/companies": typeof tables_companies;
  "tables/locations": typeof tables_locations;
  "tables/tourPackages": typeof tables_tourPackages;
  "tables/userProfile": typeof tables_userProfile;
  "tables/users": typeof tables_users;
  tourPackages: typeof tourPackages;
  userProfile: typeof userProfile;
  users: typeof users;
}>;
declare const fullApiWithMounts: typeof fullApi;

export declare const api: FilterApi<
  typeof fullApiWithMounts,
  FunctionReference<any, "public">
>;
export declare const internal: FilterApi<
  typeof fullApiWithMounts,
  FunctionReference<any, "internal">
>;

export declare const components: {};
