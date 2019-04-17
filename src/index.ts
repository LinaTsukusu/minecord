#!/usr/bin/env node

import config from './config'
import {Client, TextChannel} from 'discord.js'
import Rcon from 'modern-rcon'
import Tail from './Tail'
import Plugin, { loadPlugins } from './Plugin'

const {
  enable,
  disable,
  minecraftLog,
  minecraftRconHost,
  minecraftRconPort,
  minecraftRconPassword,
  discordBotToken,
  discordChannel,
  encode,
} = config()

process.stdout.write('Starting Minecord ... ')

loadPlugins(enable.filter(pluginName => !disable.includes(pluginName)))
const plugin = Plugin.instance

const client = new Client()
const rcon = new Rcon(minecraftRconHost, minecraftRconPort, minecraftRconPassword)
const tail = new Tail(minecraftLog, encode)

let channel: TextChannel
const sendToDiscord: SendMethod = (...args: string[]) => channel.send(...args)
const sendToMinecraft: SendMethod = async (...args: string[]) => {
  try {
    await rcon.connect()
    await rcon.send(...args)
  } catch (e) {
    console.error(e)
  } finally {
    await rcon.disconnect()
  }
}

client.on('ready', () => {
  channel = client.channels.get(discordChannel)! as TextChannel
  console.log('Done!!')
})

client.on('message', message => {
  if (message.channel.id !== channel.id) return
  if (message.author.bot || message.author.id === client.user.id) return

  plugin.emit('discord', {
    message,
    channel,
    user: client.user,
    sendToDiscord,
    sendToMinecraft,
  })
})

client.on('error', (error) => {
  console.error(error)
})

const regexpLog = /^\[(.*)]\s\[([^/]*)\/(.*)][^:]*:\s(.*)$/

tail.on('line', (line: string) => {
  if (!regexpLog.test(line)) return

  const [log, time, causedAt, level, message] = regexpLog.exec(line)!
  console.log(log)

  plugin.emit('minecraft', {
    log,
    time,
    causedAt,
    level,
    message,
    channel,
    user: client.user,
    sendToDiscord,
    sendToMinecraft,
  })
})

client.login(discordBotToken)
