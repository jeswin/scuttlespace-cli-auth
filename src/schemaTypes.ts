
      mutation CreateOrRenameUser($args: CreateOrRenameUserArgs) {
        createOrRenameUser(input: $args)
      }
{ queries: [],
  mutations:
   [ { index: 0,
       name: 'CreateOrRenameUser',
       selections:
        [ { name: 'createOrRenameUser',
            arguments: [ { name: 'input', value: 'args' } ],
            type:
             { kind: 'Scalar',
               type: 'ICreateOrRenameUserResult',
               nullable: false } } ],
       variables:
        [ { name: 'args',
            type:
             { kind: 'Scalar',
               type: 'ICreateOrRenameUserArgs',
               nullable: true } } ] } ] }
