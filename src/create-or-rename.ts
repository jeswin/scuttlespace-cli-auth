import pg = require("pg");
import {
  parseServiceResult,
  ServiceResultParseError
} from "scuttlespace-api-common";
import { IConfig, Response } from "scuttlespace-commands-common";
import { ICallContext } from "standard-api";
import exception from "./exception";

export default async function createOrRename(
  username: string,
  externalId: string,
  messageId: string,
  config: IConfig,
  context: ICallContext
): Promise<Response | undefined> {
  return new Response(`TODO.`, messageId);

  // try {
  //   const result = await parseServiceResult(
  //     authService.createOrRenameAccount(
  //       {
  //         externalId,
  //         username
  //       },
  //       context
  //     )
  //   );
  //   return result === "CREATED"
  //     ? new Response(
  //         `Your profile is accessible at https://${
  //           config.hostname
  //         }/${username}.`,
  //         messageId
  //       )
  //     : result === "RENAMED"
  //       ? new Response(
  //           `Your profile is now accessible at https://${
  //             config.hostname
  //           }/${username}.`,
  //           messageId
  //         )
  //       : result === "TAKEN"
  //         ? new Response(
  //             `The id '${username}' already exists. Choose a different id.`,
  //             messageId
  //           )
  //         : result === "OWN"
  //           ? new Response(
  //               `The id '${username}' is already yours and is accessible at https://${
  //                 config.hostname
  //               }/${username}.`,
  //               messageId
  //             )
  //           : exception("INVARIANT_VIOLATION", "");
  // } catch (ex) {
  //   return new Response(
  //     ex instanceof ServiceResultParseError && ex.code === "INVALID_USERNAME"
  //       ? `Invalid username. For now, only alphabets, numbers and underscore is allowed.`
  //       : `An error occured. We're looking into it.`,
  //     messageId
  //   );
  // }
}
