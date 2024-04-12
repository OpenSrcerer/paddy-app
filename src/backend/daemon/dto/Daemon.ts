import moment from 'moment/moment';

export type CreateDaemonResponse = Daemon & { jwt: string }

export type Daemon = {
  id: string,
  on: boolean
  recovery: boolean,
  lastRssi: number,
  lastPing: number
}

export function getDaemonStatus(daemon: Daemon) {
  if (!!daemon?.recovery) return 'Recovery'
  if (!daemon?.lastPing) return 'Unknown'
  if ((Date.now() / 1000) - daemon.lastPing < 60) return 'Online'
  return `${moment(daemon.lastPing * 1000).fromNow()}`
}

export function getBadgeColor(daemon: Daemon) {
  const status = getDaemonStatus(daemon)
  if (status === 'Recovery') return '#ff880e'
  return status === 'Online' ? '#81ff52' : '#a5a5a5'
}
