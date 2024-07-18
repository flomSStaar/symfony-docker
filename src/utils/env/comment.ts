import { BlockRow } from '@/utils/env/block-row'

export class Comment extends BlockRow {
  private readonly mText: string

  constructor(text: string) {
    super()
    this.mText = text
  }

  get text(): string {
    return this.mText
  }

  equals(item: BlockRow): boolean {
    if (item instanceof Comment) {
      return this.mText === item.mText
    }
    return false
  }

  toString(): string {
    return this.mText
  }
}
