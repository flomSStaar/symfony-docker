export class StringBuilder {
  private builder: string = ''

  /**
   * Adds the string chain to the builder.
   *
   * @param chain Chain to add in the builder.
   * @return The instance builder to chain methods.
   */
  append(chain: string): StringBuilder {
    this.builder += chain
    return this
  }

  /**
   * Adds the string chain and a new line to the builder.
   *
   * @param chain Chain to add in the builder.
   * @return The instance builder to chain methods.
   */
  appendLine(chain: string): StringBuilder {
    this.builder += chain
    this.newLine()
    return this
  }

  /**
   * Adds a new line to the builder.
   *
   * @return The instance builder to chain methods.
   */
  newLine(): StringBuilder {
    this.builder += '\n'
    return this
  }

  /**
   * Method to build the string.
   * @return The built string.
   */
  toString(): string {
    return this.builder
  }
}
