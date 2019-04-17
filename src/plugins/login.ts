import {EventEmitter} from 'events'

const regexpArray = [
  /^(.*)\sjoined\sthe\sgame$/,
  /^(.*)\sleft\sthe\sgame$/,
]

export default (plugin: EventEmitter) => {
  plugin.on('minecraft', async ({causedAt, level, message, sendToDiscord}: MinecraftArgs) => {
    if (causedAt !== 'Server thread' || level !== 'INFO') return

    if (regexpArray.some(regexp => regexp.test(message)))
      await sendToDiscord(message)
  })
}
