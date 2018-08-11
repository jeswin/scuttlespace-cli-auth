import humanist from "humanist";
import { IConfig, Response } from "scuttlespace-commands-common";
import { ICallContext } from "standard-api";
import createOrRename from "./create-or-rename";
import modify from "./modify";
/*
  Supported commands
  
  A given externalId can have multiple usernames associated with it, one of which will be in is_primary state.

  Account Management
  ------------------
  # Creates a new identity, owned by the externalId's pkey
  # If the identity already exists, sets it as active.
  user id jeswin 

  # Sets some text about the current user
  user about Lives in a cold, dark cave.

  # Sets custom domain for username
  user domain jeswin.org

  # Disables an identity
  user disable
  
  # Enables an identity
  user enable 

  # Deletes a previously disabled identity
  user destroy 
*/

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

export async function init() {}

export async function handle(
  command: string,
  messageId: string,
  sender: string,
  config: IConfig,
  context: ICallContext
): Promise<Response | undefined> {
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
                config,
                context
              )
            : await modify(args, sender, messageId, config, context);
          return resp;
        } catch (ex) {
          return new Response(
            `Sorry that did not work, looks like an error at our end. We'll fix it.`,
            messageId
          );
        }
      })()
    : undefined;
}
