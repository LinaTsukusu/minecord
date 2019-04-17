export default class Replacer {
  private readonly regexp: RegExp
  private readonly replacer: (...args: string[]) => string

  constructor (regexp: RegExp, replacer: () => string) {
    this.regexp = regexp
    this.replacer = replacer
  }

  test (str: string) {
    return this.regexp.test(str)
  }

  replace (str: string) {
    return str.replace(this.regexp, this.replacer)
  }
}
