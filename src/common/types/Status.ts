export const enum Status {
  None,
  Censored,
  NSFW,
}

export interface CensorStatus {
  type: Status
}

export default Status
