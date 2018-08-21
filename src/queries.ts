export default {
  mutations: {
    createOrRenameUser: `
      mutation CreateOrRenameUser($args: CreateOrRenameUserArgs) {
        createOrRenameUser(input: $args)
      }`,
    enableAccount: `
      mutation EnableAccount($args: ChangeUserStatusArgs) {
        enableAccount(input: $args)
      }`,
    disableAccount: `
      mutation DisableAccount($args: ChangeUserStatusArgs) {
        disableAccount(input: $args)
      }`,
    destroyAccount: `
      mutation DestroyAccount($args: ChangeUserStatusArgs) {
        destroyAccount(input: $args)
      }`
  }
};
