import { BlockSection } from '@/utils/env/block-section'
import { NamedBlockSection } from '@/utils/env/named-block-section'
import { parseEnv } from '@/utils/env/parse-env'
import { Variable } from '@/utils/env/variable'
import { StringBuilder } from '@/utils/string-builder'

export class EnvBuilder {
  private readonly blocks: Map<string, BlockSection>

  constructor(blocks = new Map<string, BlockSection>()) {
    this.blocks = blocks
  }

  static from(text: string): EnvBuilder {
    return new EnvBuilder(parseEnv(text))
  }

  hasBlock(key: string): boolean {
    return this.blocks.has(key)
  }

  getBlock(key: string): BlockSection | undefined {
    return this.blocks.get(key)
  }

  addBlock(section: BlockSection): void {
    this.blocks.set(section.key, section)
  }

  removeBlock(key: string): void {
    this.blocks.delete(key)
  }

  addVariable(blockKey: string, key: string, value: string) {
    let block: BlockSection
    if (this.blocks.has(blockKey)) {
      block = this.blocks.get(blockKey)!
    } else {
      block = new NamedBlockSection(blockKey)
      this.blocks.set(blockKey, block)
    }

    block.add(new Variable(key, value))
  }

  removeVariable(blockKey: string, key: string) {
    let block: BlockSection
    if (this.blocks.has(blockKey)) {
      block = this.blocks.get(blockKey)!
    } else {
      return
    }

    const blockRow = block.get(new Variable(key, ''))
    if (blockRow) {
      block.remove(blockRow)
    }
  }

  toString(): string {
    if (this.blocks.size === 0) {
      return ''
    }

    const builder = new StringBuilder()
    for (const [, value] of this.blocks.entries()) {
      builder.appendLine(value.toString()).newLine()
    }
    return builder.toString().trim() + '\n'
  }
}
