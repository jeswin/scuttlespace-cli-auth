import createOrRenameTests from "./create-or-rename-tests";
import initTests from "./init-tests";
import modifyTests from "./modify-tests";

describe("scuttlespace-cli-auth", () => {
  initTests();
  createOrRenameTests();
  modifyTests();
});
