import "mocha";
import * as authService from "scuttlespace-service-auth";
import "should";
import authCLI from "../";
import { inject } from "../";
import { ValidResult } from "scuttlespace-api-common";

const shouldLib = require("should");

const mockDbPool: any = {};
const mockContext = { id: "context-id" };

describe("scuttlespace-cli-auth", () => {
  it("creates a user", async () => {
    inject({
      auth: {
        ...authService,
        checkAccountStatus: async () =>
          new ValidResult({
            status: "AVAILABLE"
          } as authService.AccountStatusCheckResult),
        getAccountByExternalUsername: async () =>
          new ValidResult({
            about: "",
            domain: "",
            enabled: false,
            externalUsername: "jpk001",
            username: "jeswin"
          })
      }
    });

    const resp = await authCLI(
      "user id jeswin",
      "msg-id",
      "sender-id",
      mockDbPool,
      { hostname: "example.com" },
      mockContext
    );

    shouldLib.exist(resp);
    if (resp) {
      resp.message.should.equal(
        "The id 'jeswin' is now accessible at https://example.com/jeswin."
      );
    }
  });
});
