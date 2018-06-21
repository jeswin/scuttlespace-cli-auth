import humanist, { IResult as IHumanistResult } from "humanist";

/*
  Supported commands
  
  A given sender can have multiple usernames associated with it, one of which will be in is_primary state.

  Account Management
  ------------------
  # Creates a new identity, owned by the sender's pkey
  # If the identity already exists, sets it as active.
  id jeswin 

  # Gives another user access to the identity
  id anongamers member jeswin

  # Gives another user admin access to the identity
  id anongamers admin jeswin

  # Disassociate a user from the identity
  # There needs to be at least one admit
  id anongamers remove jeswin

  # Sets custom domain for username
  id jeswin domain jeswin.org

  # Disables an identity
  id jeswin disable
  
  # Enables an identity
  id jeswin enable 

  # Deletes a previously disabled identity
  id jeswin destroy 
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

export default function handle(command: string, sender: string) {
  const lcaseCommand = command.toLowerCase();
  if (lcaseCommand.startsWith("id ")) {
    const args: any = parser(command);
    const identityId = args.id;
    if (isValidIdentity(identityId)) {
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