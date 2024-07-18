import { BlockRow } from '@/utils/env/block-row'
import { StringBuilder } from '@/utils/string-builder'

export abstract class BlockSection<T extends BlockRow = BlockRow> {
  protected mKey: string
  protected mItems: T[] = []

  constructor(key: string, ...args: T[]) {
    this.mKey = key
    for (let i = 0; i < args.length; i++) {
      this.mItems.push(args[i])
    }
  }

  get key(): string {
    return this.mKey
  }

  has(item: T): boolean {
    return this.get(item) !== undefined
  }

  get(item: T): T | undefined {
    return this.mItems.find(i => i.equals(item))
  }

  add(item: T) {
    this.mItems.push(item)
  }

  remove(item: T) {
    this.mItems = this.mItems.filter(i => !i.equals(item))
  }

  toString(): string {
    const builder = new StringBuilder()

    for (const item of this.mItems) {
      builder.appendLine(item.toString())
    }

    return builder.toString().trim()
  }
}
