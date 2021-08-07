import { ApplicationCommandData, ApplicationCommandPermissionData, CommandInteraction } from "discord.js";

export default interface Command extends ApplicationCommandData {
    ownerOnly?: boolean;
    permissions?: ApplicationCommandPermissionData[];
    exec(interaction: CommandInteraction): Promise<void>;
}