import "mocha";
import { ValidResult } from "scuttlespace-api-common";
import * as authService from "scuttlespace-service-auth";
import { CreateOrRenameAccountResult } from "scuttlespace-service-auth";
import "should";
import authCLI from "../";
import { inject } from "../";

const shouldLib = require("should");

const mockDbPool: any = {};
const mockContext = { id: "context-id" };

export default function() {
  describe("create and rename accounts", () => {
    it("creates a user", async () => {
      inject({
        auth: {
          ...authService,
          createOrRenameAccount: async () =>
            new ValidResult(CreateOrRenameAccountResult.Created)
        }
      });

      const resp = await authCLI(
        "user id jeswin",
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

    it("renames a user", async () => {
      inject({
        auth: {
          ...authService,
          createOrRenameAccount: async () =>
            new ValidResult(CreateOrRenameAccountResult.Renamed)
        }
      });

      const resp = await authCLI(
        "user id jeswin",
        "msg-id",
        "jpk001",
        mockDbPool,
        { hostname: "example.com" },
        mockContext
      );

      shouldLib.exist(resp);
      if (resp) {
        resp.message.should.equal(
          "Your profile is now accessible at https://example.com/jeswin."
        );
      }
    });

    it("fails if the username exists", async () => {
      inject({
        auth: {
          ...authService,
          createOrRenameAccount: async () =>
            new ValidResult(CreateOrRenameAccountResult.Taken)
        }
      });

      const resp = await authCLI(
        "user id jeswin",
        "msg-id",
        "jpk001",
        mockDbPool,
        { hostname: "example.com" },
        mockContext
      );

      shouldLib.exist(resp);
      if (resp) {
        resp.message.should.equal(
          "The id 'jeswin' already exists. Choose a different id."
        );
      }
    });

    it("skips renaming if username is already yours", async () => {
      inject({
        auth: {
          ...authService,
          createOrRenameAccount: async () =>
            new ValidResult(CreateOrRenameAccountResult.Own)
        }
      });

      const resp = await authCLI(
        "user id jeswin",
        "msg-id",
        "jpk001",
        mockDbPool,
        { hostname: "example.com" },
        mockContext
      );

      shouldLib.exist(resp);
      if (resp) {
        resp.message.should.equal(
          "The id 'jeswin' is already yours and is accessible at https://example.com/jeswin."
        );
      }
    });
  });
}
