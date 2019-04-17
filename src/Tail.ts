import { EventEmitter } from 'events'
import {createReadStream, Stats, statSync} from 'fs'
import { createInterface } from 'readline'
import { dirname } from 'path'
import { FSWatcher, watch } from 'chokidar'
import { decodeStream } from 'iconv-lite'

export default class Tail extends EventEmitter {
  private readonly filename: string
  private encode: string
  private watcher: FSWatcher | null = null
  private position = 0

  constructor (filename: string, encode = 'utf-8') {
    super()
    this.filename = filename
    this.encode = encode
    this.watch()
  }

  private watch () {
    if (this.watcher) return

    const stats = this._getStats()
    if (stats) this.position = stats.size

    this.watcher = watch(dirname(this.filename), {
      ignoreInitial: true,
      alwaysStat: true,
      awaitWriteFinish: {
        stabilityThreshold: 200,
        pollInterval: 50,
      },
    }).on('add', (basename, stats) => {
      if (basename === this.filename) this._handleCreateFile(stats!)
    }).on('change', (basename, stats) => {
      if (basename === this.filename) this._handleChangeFile(stats!)
    }).on('unlink', basename => {
      if (basename === this.filename) this._handleRemoveFile()
    })
  }

  private unwatch () {
    if (!this.watcher) return
    this.watcher.close()
    this.watcher = null
  }

  private _getStats () {
    try {
      return statSync(this.filename)
    } catch (e) {
      return false
    }
  }

  private _handleCreateFile (stats: Stats) {
    this.position = 0
    this._handleChangeFile(stats)
  }

  private _handleChangeFile (stats: Stats) {
    if (stats.size < this.position) this.position = 0

    if (!stats.size) return

    createInterface({
      input: createReadStream(this.filename, {
        start: this.position,
        end: stats.size - 1,
      }).pipe(decodeStream(this.encode))
    }).on('line', line => {
      this.emit('line', line)
    })

    this.position = stats.size
  }

  private _handleRemoveFile () {
    this.position = 0
  }
}
