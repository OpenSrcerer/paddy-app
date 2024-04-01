import { AbstractBackendClient } from 'src/backend/AbstractBackendClient';
import { ScheduleRoute } from 'src/backend/schedule/ScheduleRoute.enum';
import { Schedule } from 'src/backend/schedule/dto/Schedule';

class SchedulePaddyBackendClient extends AbstractBackendClient {

  constructor() { super(); }

  async getSchedule(id: string, daemonId: string): Promise<Schedule | undefined> {
    const res = await this.request<Schedule>("GET", ScheduleRoute.GET_SCHEDULE, { id, daemonId })
    return res.body ?? undefined
  }

  async getAllSchedules(daemonId: string): Promise<Array<Schedule>> {
    const res = await this.request<Array<Schedule>>("GET", ScheduleRoute.GET_ALL_SCHEDULES, { daemonId })
    return res.body ?? []
  }

  async createSchedule(id: string, daemonId: string): Promise<Schedule | undefined> {
    const res = await this.request<Schedule>
      ("POST", ScheduleRoute.CREATE_SCHEDULE, null, null, { id, daemonId })
    return res.body ?? undefined
  }

  async patchSchedule(id: string, daemonId: string) {
    await this.request("PATCH", ScheduleRoute.UPDATE_SCHEDULE, { id, daemonId })
  }

  async delete(id: string, daemonId: string) {
    await this.request("DELETE", ScheduleRoute.DELETE_SCHEDULE, { id, daemonId })
  }
}

const schedule = new SchedulePaddyBackendClient()
export default schedule
