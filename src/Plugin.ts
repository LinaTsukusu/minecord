import config from './config'
import EventEmitter = NodeJS.EventEmitter
import * as path from 'path'


export default class Plugin extends EventEmitter {
  public static readonly instance = new Plugin()

  private constructor () {
    super()
  }
}


export const loadPlugins = (pluginNames: string[] = []) => {
  const {pluginsDir} = config()

  pluginNames.map(pluginName => {
    let plugin: ((plugin: Plugin) => void) | null = null

    try {
      if (pluginsDir) plugin = require(path.join(pluginsDir, pluginName)).default
    } catch (e) {}

    try {
      if (!plugin) plugin = require(`minecord-plugin-${pluginName}`).default
    } catch (e) {}

    try {
      if (!plugin) plugin = require(`./plugins/${pluginName}`).default
    } catch (e) {}

    if (plugin) {
      plugin(Plugin.instance)
    }
  })
}
