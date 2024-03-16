export type CreateDaemonResponse = Daemon & { jwt: string }

export type Daemon = {
  id: string
}
