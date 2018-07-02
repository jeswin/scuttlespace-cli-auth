import humanist from "humanist";
import pg = require("pg");
import { Response as CLIResponse, Response } from "scuttlespace-cli-common";
import * as authService from "scuttlespace-service-auth";
import { ICreateAccountArgs } from "scuttlespace-service-auth/dist/create-account";
/*
  Supported commands
  
  A given sender can have multiple usernames associated with it, one of which will be in is_primary state.

  Account Management
  ------------------
  # Creates a new identity, owned by the sender's pkey
  # If the identity already exists, sets it as active.
  id create jeswin 

  # Sets some text about the current user
  id about Lives in a cold, dark cave.

  # Gives another user access to the identity
  id link alice

  # Disassociate a user from the identity
  id delink alice

  # Sets custom domain for username
  id domain jeswin.org

  # Disables an identity
  id disable
  
  # Enables an identity
  id enable 

  # Deletes a previously disabled identity
  id destroy 
*/

const parser = humanist([
  ["create", "single"],
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
  if (lcaseCommand.startsWith("id ")) {
    const args: any = parser(command);
    if (args.create) {
      if (isValidIdentity(args.id)) {
        const username: string = args.id;
        const status = await authService.checkAccountStatus(
          username,
          sender,
          pool
        );

        if (status.status === "AVAILABLE") {
          const accountInfo: ICreateAccountArgs = {
            about: "",
            domain: "",
            enabled: true,
            networkId: sender,
            username
          };
          await authService.createAccount(accountInfo, pool);
          return new Response(
            `The id '${username}' is now accessible at https://scuttle.space/${username}.`,
            messageId
          );
        } else if (status.status === "TAKEN") {
          return new Response(
            `The id ${username} already exists. Choose something else.`,
            messageId
          );
        } else if (status.status === "OWN") {
          //return new Response();
        }
      }
    } else {
      const senderAccount = await authService.getAccountForCaller(sender, pool);
      if (senderAccount) {
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
          `You don't have an account. Create an account first with id <username>. eg: id create alice`,
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
