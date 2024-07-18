import { BlockRow } from '@/utils/env/block-row'
import { BlockSection } from '@/utils/env/block-section'
import { Comment } from '@/utils/env/comment'
import { CommentBlockSection } from '@/utils/env/comment-block-section'
import { NamedBlockSection } from '@/utils/env/named-block-section'
import { Variable } from '@/utils/env/variable'

function isNamedBlockSection(block: unknown): block is NamedBlockSection {
  return block instanceof NamedBlockSection
}

export function parseEnv(input: string): Map<string, BlockSection> {
  const lines = input.split('\n')
  const blocks = new Map<string, BlockSection>()

  let current: BlockSection | null = null

  function pushCurrentIfExists() {
    if (current) {
      blocks.set(current.key, current)
      current = null
    }
  }

  for (let i = 0; i < lines.length; i++) {
    const line = lines[i]

    if (line.startsWith('###>')) {
      // BEGINBLOCK
      pushCurrentIfExists()

      const blockName = line.replace('###>', '').replace('###', '').trim()
      current = new NamedBlockSection<BlockRow>(blockName)
    } else if (line.startsWith('###<')) {
      // ENDBLOCK
      if (isNamedBlockSection(current)) {
        blocks.set(current.key, current)
      } else {
        console.error('Invalid ENDBLOCK state')
      }
      current = null
    } else if (line.startsWith('#')) {
      // COMMENT
      if (current) {
        current.add(new Comment(line))
      } else {
        current = new CommentBlockSection(new Comment(line))
      }
    } else if (line.trim() === '') {
      // SPACE
      pushCurrentIfExists()
    } else if (line.search(/^[a-zA-Z]/) > -1) {
      // VARIABLE
      // Split each line into key-value pairs
      const [key, ...valueParts] = line.split('=')
      const value = valueParts.join('=').trim() // In case the value contains '='

      if (current) {
        current.add(new Variable(key.trim(), value))
      }
    } else {
      console.error(`index: ${i}`, `'${line}'`)
      throw new Error('unknown case')
    }
  }

  pushCurrentIfExists()

  return blocks
}
