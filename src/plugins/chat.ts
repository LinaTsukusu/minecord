import Replacers from '../Replacers'
import EventEmitter = NodeJS.EventEmitter

const replacers = (new Replacers)
  .add(/^<(.*?)>\s(.*)$/, (message, player, text) => `**${player}**: ${text}`)
  // .add(/^\[(.*?)]\s(.*)$/, (message, player, text) => `**${player}**: ${text}`)

export default (plugin: EventEmitter) => {
  plugin.on('discord', async ({message, sendToMinecraft}: DiscordArgs) => {
      await sendToMinecraft(`tellraw @a ${JSON.stringify({
        text: `<${message.member && message.member.nickname || message.author.username}> ${message.cleanContent}`
      })}`)
    })
  plugin.on('minecraft', async ({causedAt, level, message, sendToDiscord}: MinecraftArgs) => {
    if (causedAt !== 'Server thread' || level !== 'INFO') return

    const newMessage = replacers.replace(message)
    if (newMessage !== false) sendToDiscord(newMessage)
  })
}
