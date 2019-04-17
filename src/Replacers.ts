import Replacer from './Replacer'

export default class Replacers {
  private replacers: Replacer[]

  constructor () {
    this.replacers = []
  }

  public add(regexp: RegExp, replacer: (...args: string[]) => string) {
    this.replacers.push(new Replacer(regexp, replacer))
    return this
  }

  public replace(str: string) {
    const replacer = this.replacers.find(replacer => replacer.test(str))
    return replacer ? replacer.replace(str) : false
  }
}
