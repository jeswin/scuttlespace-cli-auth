import pg = require("pg");
import { parseServiceResult, ServiceResult } from "scuttlespace-api-common";
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
  const account = await parseServiceResult(
    authService.getAccountByExternalUsername(externalUsername, pool, context)
  );

  return account
    ? await (async () => {
        const accountCreationResult = await expr.firstAsync([
          [
            () => typeof args.enable !== "undefined",
            async () => {
              await authService.enable(externalUsername, pool, context);
              return new Response(
                `The user ${account.username} was disabled.`,
                messageId
              );
            }
          ],
          [
            () => typeof args.disable !== "undefined",
            async () => {
              await authService.disable(externalUsername, pool, context);
              return new Response(
                `The user ${account.username} was disabled.`,
                messageId
              );
            }
          ],
          [
            () => typeof args.destroy !== "undefined",
            async () => {
              const result = await authService.destroy(
                externalUsername,
                pool,
                context
              );

              try {
                return new Response(
                  `The user ${account.username} was deleted.`,
                  messageId
                );
              } catch (ex) {
                const code = ex.message.split(/:|\(/)[0];
                return new Response(
                  code === "CANNOT_DELETE_ACTIVE_ACCOUNT"
                    ? `As a security measure, the user needs to be disabled before deleting it. Say 'user disable'.`
                    : `Unable to delete the user ${account.username}.`,
                  messageId
                );
              }
            }
          ]
        ]);

        return (
          accountCreationResult ||
          (await (async () => {
            const accountModResults = await expr.collectAsync([
              [
                () => typeof args.about !== "undefined",
                async () => {
                  await authService.editAbout(
                    args.about,
                    externalUsername,
                    pool,
                    context
                  );
                  return "about text";
                }
              ],
              [
                () => typeof args.domain !== "undefined",
                async () => {
                  await authService.editDomain(
                    args.domain,
                    externalUsername,
                    pool,
                    context
                  );
                  return "domain";
                }
              ]
            ]);

            return accountModResults.length
              ? new Response(
                  `Updated ${accountModResults.join(", ")}.`,
                  messageId
                )
              : await (async () => {
                  const changePermissionsResult = await expr.firstAsync([
                    [
                      () => typeof args.link !== "undefined",
                      async () => {
                        await authService.addPermissions(
                          account.username,
                          args.link,
                          externalUsername,
                          ["POST"],
                          pool,
                          context
                        );
                        return new Response(``, messageId);
                      }
                    ],
                    [
                      () => typeof args.unlink !== undefined,
                      async () => {
                        await authService.addPermissions(
                          account.username,
                          args.unlink,
                          externalUsername,
                          ["POST"],
                          pool,
                          context
                        );
                        return new Response(``, messageId);
                      }
                    ]
                  ]);

                  return (
                    changePermissionsResult ||
                    new Response(
                      `Sorry, did not follow that instruction.`,
                      messageId
                    )
                  );
                })();
          })())
        );
      })()
    : new Response(
        `You don't have an account. Create an account first with id create <username>. eg: id create alice`,
        messageId
      );
}
