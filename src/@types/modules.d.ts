declare module 'modern-rcon' {
  export default class Rcon {
    constructor(host: string, port?: number, password?: string, timeout?: number)
    public connect(): Promise<void>
    public send(...data: string[]): Promise<string>
    public disconnect(): Promise<void>
  }
}
