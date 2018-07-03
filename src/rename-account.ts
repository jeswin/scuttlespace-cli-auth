import pg = require("pg");
import { Response } from "scuttlespace-cli-common";
import * as authService from "scuttlespace-service-auth";
import { ICreateAccountArgs } from "scuttlespace-service-auth/dist/create-account";

export default async function createAccount(
  username: string,
  networkId: string,
  messageId: string,
  pool: pg.Pool
) {
  const accountInfo: ICreateAccountArgs = {
    about: "",
    domain: "",
    enabled: true,
    networkId,
    username
  };
  await authService.createAccount(accountInfo, pool);
  return new Response(
    `The id '${username}' is now accessible at https://scuttle.space/${username}.`,
    messageId
  );
}
