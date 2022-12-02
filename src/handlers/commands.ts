import { readdirSync } from 'fs';
import chalk from 'chalk';
import { Client } from 'eris';

let dir = 'dist';

const commands = [];
export { commands };

export function loadCommands(client: Client) {
    client.on('ready', async () => {
        const commandFolders = readdirSync(`./${dir}/commands`);
        for (const folder of commandFolders) {
            const commandFiles = readdirSync(
                `./${dir}/commands/${folder}`
            ).filter((file) => file.endsWith('.js' || '.ts'));
            for (const file of commandFiles) {
                const slashCommandObject = await import(
                    `../commands/${folder}/${file}`
                );
                if (slashCommandObject.default.data.name) {
                    console.log(
                        chalk.cyanBright(
                            `[Command] ${slashCommandObject.default.data.name} is loaded`
                        )
                    );
                }
                // await client.createGuildCommand(process.env.SLASH_COMMANDS_GUILD, slashCommandObject.default.data)
                // Use code underneath for global slash commands
                await client.createCommand(slashCommandObject.default.data);
                commands.push({
                    name: slashCommandObject.default.data.name,
                    run: slashCommandObject.default.run,
                });
            }
        }
    });
    setTimeout(() => {
        console.log(
            chalk.blueBright(`[System] ${commands.length} commands is loaded`)
        );
    }, 70000);
}
