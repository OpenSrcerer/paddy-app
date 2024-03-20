export enum DaemonRoute {
  GET_DAEMON           = "daemon/:id",
  GET_ALL_USER_DAEMONS = "daemon",
  CREATE_DAEMON        = "daemon",
  TOGGLE_DAEMON        = "daemon/:id/toggle",
  DELETE_DAEMON        = "daemon/:id"
}
