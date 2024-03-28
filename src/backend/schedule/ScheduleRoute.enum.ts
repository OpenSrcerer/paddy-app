export enum ScheduleRoute {
  GET_SCHEDULE = "daemon/:daemonId/power/:id",
  GET_ALL_SCHEDULES = "daemon/:daemonId/power",
  CREATE_SCHEDULE = "daemon/:daemonId/power",
  UPDATE_SCHEDULE = "daemon/:daemonId/power/:id",
  DELETE_SCHEDULE = "daemon/:daemonId/power/:id"
}
