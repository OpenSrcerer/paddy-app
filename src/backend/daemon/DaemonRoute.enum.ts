export enum DaemonRoute {
  GET_DAEMON           = "daemon/:id",
  GET_ALL_USER_DAEMONS = "daemon",
  CREATE_DAEMON        = "daemon",
  UPDATE_DAEMON        = "daemon/:id",
  TOGGLE_DAEMON        = "daemon/:id/toggle",
  RESET_DAEMON         = "daemon/:id/reset",
  DELETE_DAEMON        = "daemon/:id"
}
