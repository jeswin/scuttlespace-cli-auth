import humanist from "humanist";
import {
  extractText,
  IConfig,
  IMessage,
  IMessageSource,
  Response
} from "scuttlespace-commands-common";
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

export async function init(configVal: IConfig) {}

export async function handle(
  msg: IMessage<any>,
  msgSource: IMessageSource,
  config: IConfig,
  context: ICallContext
): Promise<Response | undefined> {
  // Right now we only handle simple text messages.
  if (msg.type === "post") {
    const command = extractText(msg, config.botMention);
    if (command) {
      const lcaseCommand = command.toLowerCase();
      return lcaseCommand.startsWith("user ")
        ? await (async () => {
            const args: any = parser(command);
            try {
              return createOrRename(args) || modify(args);
            } catch (ex) {
              return new Response(
                `Sorry that did not work, looks like an error at our end. We'll fix it.`,
                msg.key
              );
            }
          })()
        : undefined;
    }
  } else {
    return undefined;
  }
}
