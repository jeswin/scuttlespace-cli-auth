import "mocha";
import { ValidResult } from "scuttlespace-api-common";
import * as authService from "scuttlespace-service-auth";
import { CreateOrRenameResult } from "scuttlespace-service-auth/dist/create-account";
import "should";
import authCLI from "../";
import { inject } from "../";

const shouldLib = require("should");

const mockDbPool: any = {};
const mockContext = { id: "context-id" };

export default function() {
  describe("modify accounts", () => {
    it("enables a user", async () => {
      inject({
        auth: {
          ...authService,
          enable: async () => new ValidResult(undefined)
        }
      });

      const resp = await authCLI(
        "user enable",
        "msg-id",
        "jpk001",
        mockDbPool,
        { hostname: "example.com" },
        mockContext
      );

      shouldLib.exist(resp);
      if (resp) {
        resp.message.should.equal(
          "Your profile is accessible at https://example.com/jeswin."
        );
      }
    });
  });
}
