import humanist from "humanist";
import pg = require("pg");
import { Response as CLIResponse, Response } from "scuttlespace-cli-common";
import * as authService from "scuttlespace-service-auth";
import { ICreateAccountArgs } from "scuttlespace-service-auth/dist/create-account";
import createAccount from "./create-account";
import { renameAccount } from "./rename-account";
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

const;

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
        const networkIdAccount = await authService.getAccountForCaller(
          sender,
          pool
        );

        const status = await authService.checkAccountStatus(
          username,
          sender,
          pool
        );

        // Create
        if (!networkIdAccount) {
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
            return await createAccount(username, sender, messageId, pool);
          } else if (status.status === "TAKEN") {
            return new Response(
              `The id ${username} already exists. Choose something else.`,
              messageId
            );
          }
        }
        // Rename
        if (networkIdAccount && status.status === "AVAILABLE") {
        }

        if (status.status === "AVAILABLE") {
          return await createAccount(args.id, sender, messageId, pool);
        } else if (status.status === "TAKEN") {
          return new Response(
            `The id ${username} already exists. Choose something else.`,
            messageId
          );
        }
      }
    } else if (args.rename) {
      const username: string = args.create;
      const status = await authService.checkAccountStatus(
        username,
        sender,
        pool
      );
    } else {
      const networkIdAccount = await authService.getAccountForCaller(
        sender,
        pool
      );
      if (networkIdAccount) {
        if (exists(args.about)) {
          await authService.editAbout(args.about, sender, pool);
        }
        if (exists(args.domain)) {
          await authService.editDomain(args.domain, sender, pool);
        }
        if (exists(args.adduser)) {
        }
        if (exists(args.deluser)) {
        }
        if (exists(args.enable)) {
          await authService.enable(sender, pool);
        }
        if (exists(args.disable)) {
          await authService.disable(sender, pool);
        }
        if (exists(args.destroy)) {
          await authService.disable(sender, pool);
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
