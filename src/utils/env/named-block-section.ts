import { BlockRow } from '@/utils/env/block-row'
import { BlockSection } from '@/utils/env/block-section'
import { StringBuilder } from '@/utils/string-builder'

export class NamedBlockSection<T extends BlockRow = BlockRow> extends BlockSection<T> {
  toString(): string {
    const builder = new StringBuilder()

    builder.appendLine(`###> ${this.mKey} ###`)
    builder.appendLine(super.toString())
    builder.appendLine(`###< ${this.mKey} ###`)

    return builder.toString().trim()
  }
}
