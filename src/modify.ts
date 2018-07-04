import pg = require("pg");
import { parseServiceResult, ServiceResult } from "scuttlespace-api-common";
import { Response } from "scuttlespace-cli-common";
import * as authServiceModule from "scuttlespace-service-auth";
import { ICallContext } from "standard-api";
import { IHostSettings } from ".";

export default async function modify(
  username: string,
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

  const expressions: [
    () => boolean,
    (() => Response | Promise<Response>) | Response
  ][] = [
    [
      () => typeof args.enable !== "undefined",
      async () => {
        await authService.enable(sender, pool, context);
        return new Response(
          `The user ${account.username} was disabled.`,
          messageId
        );
      }
    ],
    [
      () => typeof args.disable !== "undefined",
      async () => {
        await authService.disable(sender, pool, context);
        return new Response(
          `The user ${account.username} was disabled.`,
          messageId
        );
      }
    ],
    [
      () => typeof args.destroy !== "undefined",
      async () => {
        const result = await authService.destroy(sender, pool, context);

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
  ];

  const match = expressions.find(([predicate]) => predicate());


  // // enable | disable | destroy
  //    ?
  //     await ()()
  //     :  ? await (): await (async () => {

  //     })()

  //    if () {

  //     }

  //     // about
  //     if (exists(args.about)) {
  //       await authService.editAbout(args.about, sender, pool, context);
  //     }

  //     // domain
  //     if (exists(args.domain)) {
  //       await authService.editDomain(args.domain, sender, pool, context);
  //     }

  //     // link | unlink
  //     if (exists(args.link)) {
  //       await authService.addPermissions(
  //         account.username,
  //         args.link,
  //         sender,
  //         ["POST"],
  //         pool,
  //         context
  //       );
  //     } else if (exists(args.unlink)) {
  //       await authService.addPermissions(
  //         account.username,
  //         args.unlink,
  //         sender,
  //         ["POST"],
  //         pool,
  //         context
  //       );
  //     }
  //   })()
  // : new Response(
  //     `You don't have an account. Create an account first with id create <username>. eg: id create alice`,
  //     messageId
  //   );
}
