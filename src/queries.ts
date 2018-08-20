export default {
  mutations: {
    createOrRenameUser: `mutation CreateOrRenameUser($args: CreateOrRenameUserArgs) {
      createOrRenameUser(input: $args)
    }`
  }
};
