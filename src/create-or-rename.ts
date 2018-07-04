import pg = require("pg");
import { parseServiceResult, ServiceResult } from "scuttlespace-api-common";
import { Response } from "scuttlespace-cli-common";
import * as authServiceModule from "scuttlespace-service-auth";
import { ICallContext } from "standard-api";
import { IHostSettings } from ".";

export default async function createOrRename(
  username: string,
  externalUsername: string,
  messageId: string,
  pool: pg.Pool,
  hostSettings: IHostSettings,
  context: ICallContext,
  authService: typeof authServiceModule
) {
  return isValidIdentity(username)
    ? await (async () => {
        const account = await parseServiceResult(
          authService.getAccountByExternalUsername(
            externalUsername,
            pool,
            context
          )
        );

        const status = await parseServiceResult(
          authService.checkAccountStatus(
            username,
            externalUsername,
            pool,
            context
          )
        );

        // create
        return !account
          ? status.status === "AVAILABLE"
            ? await (async () => {
                await parseServiceResult(
                  authService.createOrRename(
                    {
                      externalUsername,
                      username
                    },
                    pool,
                    context
                  )
                );
                return new Response(
                  `Your profile is accessible at https://${
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
