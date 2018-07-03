import humanist from "humanist";
import pg = require("pg");
import { Response } from "scuttlespace-cli-common";
import * as authService from "scuttlespace-service-auth";
import createAccount from "./create-account";
import renameAccount from "./rename-account";

/*
  Supported commands
  
  A given networkId can have multiple usernames associated with it, one of which will be in is_primary state.

  Account Management
  ------------------
  # Creates a new identity, owned by the networkId's pkey
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

function exists(x: any): boolean {
  return typeof x !== "undefined";
}

export default async function handle(
  command: string,
  messageId: string,
  sender: string,
  pool: pg.Pool
) {
  const lcaseCommand = command.toLowerCase();
  if (lcaseCommand.startsWith("user ")) {
    const args: any = parser(command);

    if (args.id) {
      const username: string = args.id;

      if (isValidIdentity(username)) {
        const account = await authService.getAccountForCaller(sender, pool);

        const status = await authService.checkAccountStatus(
          username,
          sender,
          pool
        );

        // create
        if (!account) {
          if (status.status === "AVAILABLE") {
            return await createAccount(username, sender, messageId, pool);
          } else if (status.status === "TAKEN") {
            return new Response(
              `The id ${username} already exists. Choose something else.`,
              messageId
            );
          }
        } else {
          if (status.status === "AVAILABLE") {
            return await renameAccount(username, sender, messageId, pool);
          } else if (status.status === "TAKEN") {
            return new Response(
              `The id ${username} already exists. Choose something else.`,
              messageId
            );
          }
        }
      } else {
        return new Response(
          `Invalid username. For now, only alphabets, numbers and underscore is allowed.`,
          messageId
        );
      }
    } else {
      const account = await authService.getAccountForCaller(sender, pool);
      if (account) {
        // about
        if (exists(args.about)) {
          await authService.editAbout(args.about, sender, pool);
        }

        // domain
        if (exists(args.domain)) {
          await authService.editDomain(args.domain, sender, pool);
        }

        // link | unlink
        if (exists(args.link)) {
          await authService.addPermissions(
            account.username,
            args.link,
            sender,
            ["POST"],
            pool
          );
        } else if (exists(args.unlink)) {
          await authService.addPermissions(
            account.username,
            args.unlink,
            sender,
            ["POST"],
            pool
          );
        }

        // enable | disable | destroy
        if (exists(args.enable)) {
          await authService.enable(sender, pool);
          return new Response(
            `The user ${account.username} was disabled.`,
            messageId
          );
        } else if (exists(args.disable)) {
          await authService.disable(sender, pool);
          return new Response(
            `The user ${account.username} was disabled.`,
            messageId
          );
        } else if (exists(args.destroy)) {
          try {
            await authService.destroy(sender, pool);
            return new Response(
              `The user ${account.username} was deleted.`,
              messageId
            );
          } catch (ex) {
            const code = ex.message.split(/:|\(/)[0];
            return new Response(
              code === "CANNOT_DELETE_ACTIVE_ACCOUNT"
                ? `As a security measure, the user needs to be disabled before deleting it. Say 'user disable'.`
                : `Unable to delete the user ${account.username}.`,
              messageId
            );
          }
        }
      } else {
        return new Response(
          `You don't have an account. Create an account first with id create <username>. eg: id create alice`,
          messageId
        );
      }
    }
  }
}

function isValidIdentity(username: string) {
  const regex = /^[a-z][a-z0-9_]+$/;
  return regex.test(username);
}
