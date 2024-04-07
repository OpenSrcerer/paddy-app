export type Schedule = {
  id: number,
  type: string,
  timezone: string,
  periodic?: string,
  nextExecution: number,
  finish?: number,
  secondsUntil: number,
  interval: number
}
