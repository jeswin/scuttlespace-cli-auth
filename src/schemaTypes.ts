import { ApolloClient } from "apollo-client";
import gql from "graphql-tag";
import queries from "./queries";

const invokeCreateOrRenameUserGQL = `mutation CreateOrRenameUser($args: CreateOrRenameUserArgs) {
  createOrRenameUser(input: $args)
}`;
export async function invokeCreateOrRenameUser(
  args: ICreateOrRenameUserArgs | undefined,
  apolloClient: ApolloClient<any>
): Promise<{
  createOrRenameUser: ICreateOrRenameUserResult;
}> {
  try {
    const result = await apolloClient.mutate({
      mutation: gql(invokeCreateOrRenameUserGQL),
      variables: {
        args
      }
    });
    return result.data as any;
  } catch (ex) {
    throw ex;
  }
}

const invokeDestroyUserGQL = `mutation DestroyUser($args: ChangeUserStatusArgs) {
  destroyUser(input: $args)
}`;
export async function invokeDestroyUser(
  args: IChangeUserStatusArgs | undefined,
  apolloClient: ApolloClient<any>
): Promise<{
  destroyUser: IChangeUserStatusResult;
}> {
  try {
    const result = await apolloClient.mutate({
      mutation: gql(invokeDestroyUserGQL),
      variables: {
        args
      }
    });
    return result.data as any;
  } catch (ex) {
    throw ex;
  }
}

const invokeDisableUserGQL = `mutation DisableUser($args: ChangeUserStatusArgs) {
  disableUser(input: $args)
}`;
export async function invokeDisableUser(
  args: IChangeUserStatusArgs | undefined,
  apolloClient: ApolloClient<any>
): Promise<{
  disableUser: IChangeUserStatusResult;
}> {
  try {
    const result = await apolloClient.mutate({
      mutation: gql(invokeDisableUserGQL),
      variables: {
        args
      }
    });
    return result.data as any;
  } catch (ex) {
    throw ex;
  }
}

const invokeEnableUserGQL = `mutation EnableUser($args: ChangeUserStatusArgs) {
  enableUser(input: $args)
}`;
export async function invokeEnableUser(
  args: IChangeUserStatusArgs | undefined,
  apolloClient: ApolloClient<any>
): Promise<{
  enableUser: IChangeUserStatusResult;
}> {
  try {
    const result = await apolloClient.mutate({
      mutation: gql(invokeEnableUserGQL),
      variables: {
        args
      }
    });
    return result.data as any;
  } catch (ex) {
    throw ex;
  }
}
