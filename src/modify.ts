import pg = require("pg");
import { parseServiceResult } from "scuttlespace-api-common";
import { Response } from "scuttlespace-cli-common";
import * as authServiceModule from "scuttlespace-service-auth";
import { ICallContext } from "standard-api";
import * as expr from "switch-expr";
import { IHostSettings } from ".";

export default async function modify(
  args: any,
  externalUsername: string,
  messageId: string,
  pool: pg.Pool,
  hostSettings: IHostSettings,
  context: ICallContext,
  authService: typeof authServiceModule
) {
  try {
    const accountCreationExpressions = async () =>
      await expr.firstAsync([
        [
          () => typeof args.enable !== "undefined",
          async () => {
            const { username } = await parseServiceResult(
              authService.enable(externalUsername, pool, context)
            );
            return new Response(
              `The user ${username} has been enabled.`,
              messageId
            );
          }
        ],
        [
          () => typeof args.disable !== "undefined",
          async () => {
            const { username } = await parseServiceResult(
              authService.disable(externalUsername, pool, context)
            );
            return new Response(
              `The user ${username} was disabled.`,
              messageId
            );
          }
        ],
        [
          () => typeof args.destroy !== "undefined",
          async () => {
            try {
              const { username } = await parseServiceResult(
                authService.destroy(externalUsername, pool, context)
              );

              return new Response(
                `The user ${username} was deleted.`,
                messageId
              );
            } catch (ex) {
              const code = ex.message.split(/:|\(/)[0];
              return new Response(
                code === "CANNOT_DELETE_ACTIVE_ACCOUNT"
                  ? `As a security measure, the user needs to be disabled before deleting it. Say 'user disable'.`
                  : `Unable to delete the user.`,
                messageId
              );
            }
          }
        ]
      ]);

    const accountModExpressions = async () => {
      const results = await expr.collectAsync([
        [
          () => typeof args.about !== "undefined",
          async () => {
            const { username } = await parseServiceResult(
              authService.editAbout(args.about, externalUsername, pool, context)
            );
            return "about text";
          }
        ],
        [
          () => typeof args.domain !== "undefined",
          async () => {
            const { username } = await parseServiceResult(
              authService.editDomain(
                args.domain,
                externalUsername,
                pool,
                context
              )
            );
            return "domain";
          }
        ]
      ]);
      return results.length
        ? new Response(`Updated ${results.join(", ")}.`, messageId)
        : undefined;
    };

    const accountPermissionExpressions = async () =>
      await expr.firstAsync([
        [
          () => typeof args.link !== "undefined",
          async () => {
            const { username } = await parseServiceResult(
              authService.addPermissions(
                args.link,
                externalUsername,
                ["POST"],
                pool,
                context
              )
            );
            return new Response(``, messageId);
          }
        ],
        [
          () => typeof args.unlink !== undefined,
          async () => {
            const { username } = await parseServiceResult(
              authService.addPermissions(
                args.unlink,
                externalUsername,
                ["POST"],
                pool,
                context
              )
            );
            return new Response(``, messageId);
          }
        ]
      ]);

    return (
      (await accountCreationExpressions()) ||
      (await accountModExpressions()) ||
      (await accountPermissionExpressions()) ||
      new Response(`Sorry, did not follow that instruction.`, messageId)
    );
  } catch (ex) {}
}
