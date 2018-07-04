import pg = require("pg");
import { Response } from "scuttlespace-cli-common";
import * as authServiceModule from "scuttlespace-service-auth";
import { ICallContext } from "standard-api";

export default async function createOrRename(
  username: string,
  externalUsername: string,
  pool: pg.Pool,
  context: ICallContext,
  authService: typeof authServiceModule
) {
  return isValidIdentity(username)
    ? await (async () => {
        const accountResult = await authService.getAccountByExternalUsername(
          externalUsername,
          pool,
          context
        );

        const account = ensureValidResult(accountResult);

        const statusResult = await authService.checkAccountStatus(
          username,
          externalUsername,
          pool,
          context
        );

        const status = ensureValidResult(statusResult);

        // create
        return !account
          ? status.status === "AVAILABLE"
            ? await (async () => {
                await authService.createAccount(
                  {
                    about: "",
                    domain: "",
                    enabled: true,
                    externalUsername,
                    username
                  },
                  pool,
                  context
                );
                return new Response(
                  `The id '${username}' is now accessible at https://${
                    hostSettings.hostname
                  }/${username}.`,
                  messageId
                );
              })()
            : status.status === "TAKEN"
              ? new Response(
                  `The id ${username} already exists. Choose something else.`,
                  messageId
                )
              : undefined
          : status.status === "AVAILABLE"
            ? new Response(
                `The id '${username}' is now accessible at https://${
                  hostSettings.hostname
                }/${username}.`,
                messageId
              )
            : status.status === "TAKEN"
              ? new Response(
                  `The id ${username} already exists. Choose something else.`,
                  messageId
                )
              : undefined;
      })()
    : new Response(
        `Invalid username. For now, only alphabets, numbers and underscore is allowed.`,
        messageId
      );
}

function isValidIdentity(username: string) {
  const regex = /^[a-z][a-z0-9_]+$/;
  return regex.test(username);
}
