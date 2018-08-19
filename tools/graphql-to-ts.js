const gqlSchema = require("scuttlespace-service-user-graphql-schema");
const fromQuery = require("@gql2ts/from-query");
const queries = require("../dist/queries");

const fixedSchema = gqlSchema.typeDefs
  .replace("extend type Query", "type Query")
  .replace("extend type Mutation", "type Mutation");

const generated = Object.keys(queries.default).map(key =>
  fromQuery.default(fixedSchema, queries.default[key])
);

console.log(generated);

// console.log(
//   generated[0].result.replace(/export interface /g, "export interface I")
// );
