import { BlockSection } from '@/utils/env/block-section'
import { Comment } from '@/utils/env/comment'

const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789'

function generateString(length: number) {
  let result = ' '
  const charactersLength = characters.length
  for (let i = 0; i < length; i++) {
    result += characters.charAt(Math.floor(Math.random() * charactersLength))
  }

  return result
}

export class CommentBlockSection extends BlockSection<Comment> {
  constructor(...args: Comment[]) {
    super(generateString(8), ...args)
  }
}
