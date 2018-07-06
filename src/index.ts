import humanist from "humanist";
import pg = require("pg");
import { ServiceResult } from "scuttlespace-api-common";
import * as authServiceModule from "scuttlespace-service-auth";
import { ICallContext } from "standard-api";
import createOrRename from "./create-or-rename";
import modify from "./modify";
import { Response } from "scuttlespace-cli-common/dist";
/*
  Supported commands
  
  A given externalUsername can have multiple usernames associated with it, one of which will be in is_primary state.

  Account Management
  ------------------
  # Creates a new identity, owned by the externalUsername's pkey
  # If the identity already exists, sets it as active.
  user id jeswin 

  # Sets some text about the current user
  user about Lives in a cold, dark cave.

  # Gives another user access to the identity
  user link alice

  # Disassociate a user from the identity
  user delink alice

  # Sets custom domain for username
  user domain jeswin.org

  # Disables an identity
  user disable
  
  # Enables an identity
  user enable 

  # Deletes a previously disabled identity
  user destroy 
*/

let authService: typeof authServiceModule = authServiceModule;

export function inject(mods: { auth: typeof authServiceModule }) {
  authService = mods.auth;
}

const parser = humanist([
  ["id", "single"],
  ["about", "multi", { join: true }],
  ["domain", "single"],
  ["link", "single"],
  ["delink", "single"],
  ["enable", "flag"],
  ["disable", "flag"],
  ["destroy", "flag"]
]);

export interface IHostSettings {
  hostname: string;
}

export default async function handle(
  command: string,
  messageId: string,
  sender: string,
  pool: pg.Pool,
  hostSettings: IHostSettings,
  context: ICallContext
) {
  const lcaseCommand = command.toLowerCase();

  return lcaseCommand.startsWith("user ")
    ? await (async () => {
        const args: any = parser(command);
        try {
          const resp = args.id
            ? await createOrRename(
                args.id,
                sender,
                messageId,
                pool,
                hostSettings,
                context,
                authService
              )
            : await modify(
                args.id,
                sender,
                messageId,
                pool,
                hostSettings,
                context,
                authService
              );
          return resp;
        } catch (ex) {
          console.log(ex);
          return new Response(
            `Sorry that did not work, looks like an error at our end. We'll fix it.`,
            messageId
          );
        }
      })()
    : undefined;
}
