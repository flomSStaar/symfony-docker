import { BlockRow } from '@/utils/env/block-row'

export class TestBlockRow extends BlockRow {
  private readonly mText: string

  constructor(text: string) {
    super()
    this.mText = text
  }

  equals(item: BlockRow): boolean {
    if (item instanceof TestBlockRow) {
      return this.mText === item.mText
    }
    return false
  }

  toString(): string {
    return this.mText
  }
}
