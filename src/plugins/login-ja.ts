import Replacers from '../Replacers'
import {EventEmitter} from 'events'

const replacers = (new Replacers)
  .add(/^(.*)\sjoined\sthe\sgame$/, (message, player) => `${player} がログインしたみたい。`)
  .add(/^(.*)\sleft\sthe\sgame$/, (message, player) => `${player} がログアウトしたみたい。`)

export default (plugin: EventEmitter) => {
  plugin.on('minecraft', async ({causedAt, level, message, sendToDiscord}: MinecraftArgs) => {
    if (causedAt !== 'Server thread' || level !== 'INFO') return

    const newMessage = replacers.replace(message)
    if (newMessage !== false) await sendToDiscord(newMessage)
  })
}
