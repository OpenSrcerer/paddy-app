export type CreateDaemonResponse = Daemon & { jwt: string }

export type Daemon = {
  id: string,
  on: boolean,
  lastPing: number
}
