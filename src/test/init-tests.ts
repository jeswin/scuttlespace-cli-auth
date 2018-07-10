import "mocha";
import * as authService from "scuttlespace-service-auth";
import "should";

const shouldLib = require("should");
export function getEnvValue(envVar: string): string | never {
  const val = process.env[envVar];
  if (typeof val === "undefined") {
    throw new Error(`Expected ${envVar} to be defined.`);
  }
  return val;
}

export default function() {
  describe("start up", () => {
    it("inits", async () => {
      const dbConfig = {
        database: getEnvValue("SCUTTLESPACE_TESTDB_NAME"),
        host: getEnvValue("SCUTTLESPACE_TESTDB_HOST"),
        password: getEnvValue("SCUTTLESPACE_TESTDB_PASSWORD"),
        port: parseInt(getEnvValue("SCUTTLESPACE_TESTDB_PORT"), 10),
        user: getEnvValue("SCUTTLESPACE_TESTDB_USER")
      };

      const result = await authService.init(dbConfig);
      shouldLib.exist(result.pool);
    });
  });
}
