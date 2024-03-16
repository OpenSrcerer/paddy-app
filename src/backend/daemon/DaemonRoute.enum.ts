export enum DaemonRoute {
  GET_ALL_USER_DAEMONS = "daemon",
  CREATE_DAEMON = "daemon/:id",
  TOGGLE_DAEMON = "daemon/:id/toggle",
  DELETE_DAEMON = "daemon/:id"
}
