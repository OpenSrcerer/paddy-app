export enum ScheduleRoute {
  GET_SCHEDULE = "daemon/:daemonId/schedule/:id",
  GET_ALL_SCHEDULES = "daemon/:daemonId/schedule",
  CREATE_SCHEDULE = "daemon/:daemonId/schedule",
  UPDATE_SCHEDULE = "daemon/:daemonId/schedule/:id",
  DELETE_SCHEDULE = "daemon/:daemonId/schedule/:id"
}
