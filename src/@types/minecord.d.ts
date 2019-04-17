interface Config {
  pluginsDir: string | null
  enable: string[]
  disable: string[]
  minecraftLog: string
  minecraftRconHost: string
  minecraftRconPort: number
  minecraftRconPassword: string
  discordBotToken: string
  discordChannel: string
  encode: string
}

interface DiscordArgs {
  message: import('discord.js').Message
  channel: import('discord.js').TextChannel
  user: import('discord.js').User
  sendToDiscord: SendMethod
  sendToMinecraft: SendMethod
}

interface MinecraftArgs {
  log: string
  time: string
  causedAt: string
  level: string
  message: string,
  channel: import('discord.js').TextChannel
  user: import('discord.js').User
  sendToDiscord: SendMethod
  sendToMinecraft: SendMethod
}

type SendMethod = (...args: string[]) => void
