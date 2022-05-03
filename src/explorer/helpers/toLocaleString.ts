import { DateTime } from 'luxon'

function toLocaleString(time: number | null | undefined) {
  return time
    ? DateTime.fromMillis(time * 1000).toLocaleString(DateTime.DATETIME_FULL)
    : ''
}

export default toLocaleString
