import {
  ApplicationCommandPermissionType,
  CommandContext,
  CommandOptionType,
  SlashCommand,
  SlashCreator,
} from 'slash-create';
import client from '../../App';
import roleIds from '../../service/constants/roleIds';
import { addmhlauncherToUser } from '../../service/role/Addmhlauncher';
import ServiceUtils from '../../utils/ServiceUtils';
import ValidationError from '../../errors/ValidationError';
import discordServerIds from '../../service/constants/discordServerIds';
import Log, { LogUtils } from '../../utils/Log';
import { command } from '../../utils/SentryUtils';

export default class Coordinape extends SlashCommand {
  constructor(creator: SlashCreator) {
    super(creator, {
      name: 'mhlauncher',
      description: 'Accepts bot ID and grant the MhLuncher Role',
      guildIDs: [discordServerIds.kingPin, discordServerIds.discordBotGarage],
      options: [
        {
          type: CommandOptionType.MENTIONABLE,
          name: 'bot',
          description: 'Grant mhlauncher role to:',
          required: true,
        },
      ],
      throttling: {
        usages: 2,
        duration: 1,
      },
      defaultPermission: false,
      permissions: {
        [discordServerIds.kingPin]: [
          {
            type: ApplicationCommandPermissionType.ROLE,
            id: roleIds.mhstarter,
            permission: true,
          },
        ],
        [discordServerIds.discordBotGarage]: [
          {
            type: ApplicationCommandPermissionType.ROLE,
            id: roleIds.mhstarter,
            permission: true,
          },
        ],
      },
    });
  }

	@command
  async run(ctx: CommandContext): Promise<any> {
    LogUtils.logCommandStart(ctx);
    if (ctx.user.bot) return;
		
    Log.info('/mad hatter Launcher start');
    const guild = await client.guilds.fetch(ctx.guildID);
    const starter = await guild.members.fetch(ctx.user.id);
    const botId = await guild.members.fetch(ctx.options.id);

    if (!botId.user.bot) {
      return ctx.send('ID must be your bot id in the garage!');
    }

    try {
      await addmhlauncherToUser(starter);
    } catch (e) {
      LogUtils.logError('failed to add guest role to user', e);
    }
    await ctx.send(`<@${ctx.user.id}> mhlauncher added and message sent!`);
  }

}
