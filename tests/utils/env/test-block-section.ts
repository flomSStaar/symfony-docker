import { BlockSection } from '@/utils/env/block-section'
import { TestBlockRow } from './test-block-row'

export class TestBlockSection extends BlockSection<TestBlockRow> {
  constructor(key: string, ...args: TestBlockRow[]) {
    super(key, ...args)
  }
}
