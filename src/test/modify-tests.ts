import "mocha";
import { ErrorResult, ValidResult } from "scuttlespace-api-common";
import * as authService from "scuttlespace-service-auth";
import "should";
import * as authCLI from "..";
import { inject } from "..";

const shouldLib = require("should");

const mockContext = { id: "context-id" };

export default function() {
  describe("modify accounts", () => {
    it("enables a user", async () => {
      inject({
        auth: {
          ...authService,
          enableAccount: async () => new ValidResult({ username: "jeswin" })
        }
      });

      const resp = await authCLI.handle(
        "user enable",
        "msg-id",
        "jpk001",
        { hostname: "example.com" },
        mockContext
      );

      shouldLib.exist(resp);
      if (resp) {
        resp.message.should.equal("The user jeswin has been enabled.");
      }
    });

    it("disables a user", async () => {
      inject({
        auth: {
          ...authService,
          disableAccount: async () => new ValidResult({ username: "jeswin" })
        }
      });

      const resp = await authCLI.handle(
        "user disable",
        "msg-id",
        "jpk001",
        { hostname: "example.com" },
        mockContext
      );

      shouldLib.exist(resp);
      if (resp) {
        resp.message.should.equal("The user jeswin has been disabled.");
      }
    });

    it("deletes a user", async () => {
      inject({
        auth: {
          ...authService,
          destroyAccount: async () => new ValidResult({ username: "jeswin" })
        }
      });

      const resp = await authCLI.handle(
        "user destroy",
        "msg-id",
        "jpk001",
        { hostname: "example.com" },
        mockContext
      );

      shouldLib.exist(resp);
      if (resp) {
        resp.message.should.equal("The user jeswin has been deleted.");
      }
    });

    it("will not delete an active user", async () => {
      inject({
        auth: {
          ...authService,
          destroyAccount: async () =>
            new ErrorResult({
              code: "CANNOT_DELETE_ACTIVE_ACCOUNT",
              message: "lorem ipsum not deleted"
            })
        }
      });

      const resp = await authCLI.handle(
        "user destroy",
        "msg-id",
        "jpk001",
        { hostname: "example.com" },
        mockContext
      );

      shouldLib.exist(resp);
      if (resp) {
        resp.message.should.equal(
          "As a safety measure, the user needs to be disabled before deleting it. Say 'user disable'."
        );
      }
    });
  });
}
