import * as authServiceModule from "scuttlespace-service-auth";
import { ICallContext } from "standard-api";

export default async function modify(
  username: string,
  sender: string,
  pool: pg.Pool,
  context: ICallContext,
  authService: typeof authServiceModule
) {
  const account = await authService.externalUsername(sender, pool, context);

  return account
    ? // enable | disable | destroy
      exists(args.enable) ?
        await (async () => {
          await authService.enable(sender, pool, context);
          return new Response(
            `The user ${account.username} was disabled.`,
            messageId
          );
        })()
        : exists(args.disable) ? await (async () => {
          
        }): await (async () => {

        })();
          
        } else if () {
          await authService.disable(sender, pool, context);
          return new Response(
            `The user ${account.username} was disabled.`,
            messageId
          );
        } else if (exists(args.destroy)) {
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

        // about
        if (exists(args.about)) {
          await authService.editAbout(args.about, sender, pool, context);
        }

        // domain
        if (exists(args.domain)) {
          await authService.editDomain(args.domain, sender, pool, context);
        }

        // link | unlink
        if (exists(args.link)) {
          await authService.addPermissions(
            account.username,
            args.link,
            sender,
            ["POST"],
            pool,
            context
          );
        } else if (exists(args.unlink)) {
          await authService.addPermissions(
            account.username,
            args.unlink,
            sender,
            ["POST"],
            pool,
            context
          );
        }
      })()
    : new Response(
        `You don't have an account. Create an account first with id create <username>. eg: id create alice`,
        messageId
      );
}
