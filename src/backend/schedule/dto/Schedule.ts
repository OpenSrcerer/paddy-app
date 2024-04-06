export type Schedule = {
  id: number,
  type: string,
  timezone: string,
  single: number;
  periodic?: string,
  nextExecution: number,
  finish?: number
}
