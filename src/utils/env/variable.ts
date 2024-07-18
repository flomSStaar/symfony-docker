import { BlockRow } from '@/utils/env/block-row'

export class Variable extends BlockRow {
  private readonly mKey: string
  private mValue: string

  constructor(key: string, value: string) {
    super()
    this.mKey = key
    this.mValue = value
  }

  get key(): string {
    return this.mKey
  }

  get value(): string {
    return this.mValue
  }

  set value(value: string) {
    this.mValue = value
  }

  equals(item: BlockRow): boolean {
    if (item instanceof Variable) {
      return this.mKey === item.mKey
    }
    return false
  }

  toString(): string {
    return `${this.mKey}=${this.mValue}`
  }
}
