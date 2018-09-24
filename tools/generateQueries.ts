import * as graphqlToTS from "graphql-to-ts";
import prettier = require("prettier");
import gqlSchema from "scuttlespace-service-user-graphql-schema";
import queries from "../src/queries";
import { inspect } from "util";

const fixedSchema = gqlSchema
  .replace("extend type Query", "type Query")
  .replace("extend type Mutation", "type Mutation");

let output = "";
output += `import { ApolloClient } from "apollo-client";`;
output += `import gql from "graphql-tag";`;
output += `import queries from "./queries";`;
output += "\n\n";

const mutations: any = queries.mutations;
if (mutations) {
  for (const key of Object.keys(queries.mutations)) {
    const generated = graphqlToTS.getQueries(mutations[key], fixedSchema);
    for (const mutation of generated.mutations) {
      const invokeFunctionName = `invoke${mutation.name}`;

      const invokeFunctionBody = `
        export async function ${invokeFunctionName}(
          
          apolloClient: ApolloClient<any>
        ): Promise<I${"interfaces[1]"}> {
          try {
            const result = await apolloClient.mutate({
              mutation: gql(queries.mutations.${key}),
              variables: input.args
            });
            return result.data as any;
          } catch (ex) {
            throw ex;
          }
        }
        `;
      output += invokeFunctionBody;
      output += "\n";
    }
  }
}