import changeCase = require("change-case");
import * as graphqlToTS from "graphql-to-ts";
import prettier = require("prettier");
import gqlSchema from "scuttlespace-service-user-graphql-schema";
import queries from "../src/queries";
import { ITSQueries, ITSQuery } from "graphql-to-ts";

const fixedSchema = gqlSchema
  .replace("extend type Query", "type Query")
  .replace("extend type Mutation", "type Mutation");

let output = "";
output += `import { ApolloClient } from "apollo-client";`;
output += `import gql from "graphql-tag";`;
output += "\n\n";

if (queries.queries) {
  const generated = graphqlToTS.getQueries(queries.queries, fixedSchema);
  generateCode("query", "query", generated.queries);
}

if (queries.mutations) {
  const generated = graphqlToTS.getQueries(queries.mutations, fixedSchema);
  generateCode("mutate", "mutation", generated.mutations);
}

function generateCode(
  apolloClientMethod: "mutate" | "query",
  type: "mutation" | "query",
  parsedQueries: ITSQuery[]
) {
  for (const query of parsedQueries) {
    const invokeFunctionName = `invoke${query.name}`;
    const invokeFunctionArgs = query.variables
      .map(x => `${x.name}: ${graphqlToTS.typeToString(x.type, true)}`)
      .concat("apolloClient: ApolloClient<any>")
      .join(", ");
    const apolloClientVariables = query.variables.map(x => x.name).join(", ");
    const invokeFunctionBody = `
          const ${changeCase.camelCase(query.name)}GQL = \`${query.gql}\`;
          export async function ${invokeFunctionName}(
            ${invokeFunctionArgs}
          ): Promise<${graphqlToTS.selectionObjectToTypeString(
            query.selections
          )}> {
            try {
              const result = await apolloClient.${apolloClientMethod}({
                ${type}: gql(${invokeFunctionName}GQL),
                variables: {
                  ${apolloClientVariables}
                }
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

console.log(prettier.format(output, { parser: "typescript" }));
// console.log(output);
