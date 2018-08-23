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
  createOrRenameUser: any;
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

export interface IDestroyUserInput {
  args?: {
    externalId?: string;
  } | null;
}
export interface IDestroyUser {
  destroyUser: any;
}

export async function invokeDestroyUser(
  input: IDestroyUserInput,
  apolloClient: ApolloClient<any>
): Promise<IDestroyUser> {
  try {
    const result = await apolloClient.mutate({
      mutation: gql(queries.mutations.destroyUser),
      variables: input.args
    });
    return result.data as any;
  } catch (ex) {
    throw ex;
  }
}

export interface IDisableUserInput {
  args?: {
    externalId?: string;
  } | null;
}
export interface IDisableUser {
  disableUser: any;
}

export async function invokeDisableUser(
  input: IDisableUserInput,
  apolloClient: ApolloClient<any>
): Promise<IDisableUser> {
  try {
    const result = await apolloClient.mutate({
      mutation: gql(queries.mutations.disableUser),
      variables: input.args
    });
    return result.data as any;
  } catch (ex) {
    throw ex;
  }
}

export interface IEnableUserInput {
  args?: {
    externalId?: string;
  } | null;
}
export interface IEnableUser {
  enableUser: any;
}

export async function invokeEnableUser(
  input: IEnableUserInput,
  apolloClient: ApolloClient<any>
): Promise<IEnableUser> {
  try {
    const result = await apolloClient.mutate({
      mutation: gql(queries.mutations.enableUser),
      variables: input.args
    });
    return result.data as any;
  } catch (ex) {
    throw ex;
  }
}
