import { ApplicationCommandData, ApplicationCommandPermissionData, CommandInteraction } from "discord.js";

export interface Command extends ApplicationCommandData {
    ownerOnly?: boolean;
    permissions?: ApplicationCommandPermissionData[];
    exec(interaction: CommandInteraction): Promise<void>;
}