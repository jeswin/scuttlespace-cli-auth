export default {
  mutations: {
    createOrRenameUser: `
      mutation CreateOrRenameUser($args: CreateOrRenameUserArgs) {
        createOrRenameUser(input: $args)
      }`,
    destroyUser: `
      mutation DestroyUser($args: ChangeUserStatusArgs) {
        destroyUser(input: $args)
      }`,
    disableUser: `
      mutation DisableUser($args: ChangeUserStatusArgs) {
        disableUser(input: $args)
      }`,
    enableUser: `
      mutation EnableUser($args: ChangeUserStatusArgs) {
        enableUser(input: $args)
      }`
  }
};
