import { ApolloClient } from "apollo-client";
import gql from "graphql-tag";
import queries from "./queries";

export interface ICreateOrRenameUserInput {
  args?: {
    externalId?: string;
    pub?: string;
    username?: string;
  } | null;
}
export interface ICreateOrRenameUser {
  createOrRenameUser: string;
}

export async function invokeCreateOrRenameUser(
  input: ICreateOrRenameUserInput,
  apolloClient: ApolloClient<any>
): Promise<ICreateOrRenameUser> {
  try {
    const result = await apolloClient.mutate({
      mutation: gql(queries.mutations.createOrRenameUser),
      variables: input.args
    });
    return result.data as any;
  } catch (ex) {
    throw ex;
  }
}
