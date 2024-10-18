import { BlockSection } from '@/utils/env/block-section'
import { Comment } from '@/utils/env/comment'
import { randomUUID } from 'node:crypto'

export class CommentBlockSection extends BlockSection<Comment> {
  constructor(...args: Comment[]) {
    super(randomUUID(), ...args)
  }
}
