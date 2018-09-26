export default {
  mutations: `
    mutation CreateOrRenameUser($args: CreateOrRenameUserArgs) {
      createOrRenameUser(input: $args)
    }
    mutation DestroyUser($args: ChangeUserStatusArgs) {
      destroyUser(input: $args)
    }
    mutation DisableUser($args: ChangeUserStatusArgs) {
      disableUser(input: $args)
    }
    mutation EnableUser($args: ChangeUserStatusArgs) {
      enableUser(input: $args)
    }
  `,
  queries: `
    query GetUser($domain: String, $externalId: String, $username: String) {
      user(domain: $domain, externalId: $externalId, username: $username)
    }
  `
};
