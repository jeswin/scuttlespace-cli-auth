import humanist from "humanist";
import pg = require("pg");
import * as authService from "scuttlespace-service-auth";
import { ICreateAccountArgs } from "scuttlespace-service-auth/dist/create-account";

/*
  Supported commands
  
  A given sender can have multiple usernames associated with it, one of which will be in is_primary state.

  Account Management
  ------------------
  # Creates a new identity, owned by the sender's pkey
  # If the identity already exists, sets it as active.
  id jeswin 

  # Gives another user access to the identity
  id add jeswin

  # Disassociate a user from the identity
  # There needs to be at least one admit
  id remove jeswin

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
  ["id", "single"],
  ["about", "multi", { join: true }],
  ["domain", "single"],
  ["enable", "flag"],
  ["disable", "flag"],
  ["admin", "single"],
  ["user", "single"],
  ["remove", "single"],
  ["destroy", "flag"]
]);

export default async function handle(
  command: string,
  sender: string,
  pool: pg.Pool
) {
  const lcaseCommand = command.toLowerCase();
  if (lcaseCommand.startsWith("id ")) {
    const args: any = parser(command);
    const username: string = args.id;
    if (isValidIdentity(username)) {
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

      } else if (status.status === "TAKEN") {
        
      } else if (status.status === "OWN") {
      }

      const identityStatus = await checkIdentityStatus(
        identityId,
        message.sender
      );
      return identityStatus.status === "AVAILABLE"
        ? await createIdentity(identityId, sender, command, message)
        : identityStatus.status === "TAKEN"
          ? await unavailableIdentity(identityId, sender, command, message)
          : await modifyIdentity(identityStatus, args, command, message);
    }
  }
}

function isValidIdentity(username: string) {
  const regex = /^[a-z][a-z0-9_]+$/;
  return regex.test(username);
}
