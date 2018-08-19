const gqlSchema = require("scuttlespace-service-user-graphql-schema");
const fromQuery = require("@gql2ts/from-query");

const fixedSchema = gqlSchema.typeDefs
  .replace("extend type Query", "type Query")
  .replace("extend type Mutation", "type Mutation");

const generated = fromQuery.default(
  fixedSchema,
  `
    mutation createOrRenameUserMutation($args: CreateOrRenameUserArgs) {
      createOrRenameUser(input: $args)
    }
    `,
  {},
  {
    generateSubTypeInterfaceName: () => {
      throw "dsdd";
    },
    generateInterfaceName: name => `I${name}`
  }
);

console.log(
  generated[0].result.replace(/export interface /g, "export interface I")
);
