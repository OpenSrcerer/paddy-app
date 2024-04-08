export type Schedule = {
  id: number,
  type: ScheduleType,
  timezone: string,
  periodic?: string,
  nextExecution: number,
  finish?: number,
  secondsUntil: number,
  interval: number
}

export type ScheduleType = 'ON' | 'OFF' | 'TOGGLE'
