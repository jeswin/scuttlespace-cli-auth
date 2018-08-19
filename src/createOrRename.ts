import { ApolloClient } from "apollo-client";
import gql from "graphql-tag";
import {
  parseServiceResult,
  ServiceResultParseError
} from "scuttlespace-service-common";
import { IConfig, IMessage, Response } from "scuttlespace-commands-common";
import { ICallContext } from "standard-api";
import exception from "./exception";
import queries from "./queries";

export default async function createOrRename(
  args: any,
  msg: IMessage<{ text: string }>,
  config: IConfig,
  context: ICallContext,
  apolloClient: ApolloClient<any>
) {
  return args.id
    ? await (async () => {
        const externalId = msg.author;
        const username = args.id;
        const messageId = msg.key;

        const result: any = await apolloClient.mutate({
          mutation: gql(queries.createOrRenameUserMutation),
          variables: {
            externalId,
            username
          }
        });

        return !result.errors
          ? await (async () => {
              const responseCode =
                result.data && result.data.createOrRenameUser;

              return responseCode
                ? responseCode === "CREATED"
                  ? new Response(
                      `Your profile is accessible at https://${
                        config.hostname
                      }/${username}.`,
                      messageId
                    )
                  : responseCode === "RENAMED"
                    ? new Response(
                        `Your profile is now accessible at https://${
                          config.hostname
                        }/${username}.`,
                        messageId
                      )
                    : responseCode === "TAKEN"
                      ? new Response(
                          `The id '${username}' already exists. Choose a different id.`,
                          messageId
                        )
                      : responseCode === "OWN"
                        ? new Response(
                            `The id '${username}' is already yours and is accessible at https://${
                              config.hostname
                            }/${username}.`,
                            messageId
                          )
                        : exception("INVARIANT_VIOLATION", "")
                : exception("INVARIANT_VIOLATION", "");
            })()
          : new Response(
              result.errors[0] && result.errors[0].message,
              messageId
            );
      })()
    : undefined;
}
