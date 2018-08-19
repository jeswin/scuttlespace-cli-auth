export interface ICreateOrRenameUserMutationInput {
  args?: {
    externalId?: string;
    pub?: string;
    username?: string;
  } | null;
}

export interface ICreateOrRenameUserMutation {
  createOrRenameUser: string;
}
