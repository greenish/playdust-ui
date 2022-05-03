import { DateTime } from 'luxon'

function toRelative(time: number | null | undefined) {
  return time ? DateTime.fromMillis(time * 1000).toRelative() : ''
}

export default toRelative
