import { AbstractBackendClient } from 'src/backend/AbstractBackendClient';
import { DaemonRoute } from 'src/backend/daemon/DaemonRoute.enum';
import { CreateDaemonResponse, Daemon } from 'src/backend/daemon/dto/Daemon';

class DaemonPaddyBackendClient extends AbstractBackendClient {

  constructor() { super(); }

  async getDaemon(id: string): Promise<Daemon | undefined> {
    const res = await this.request<Daemon>("GET", DaemonRoute.GET_DAEMON, { id })
    return res.body ?? undefined
  }

  async getAllUserDaemons(): Promise<Array<Daemon>> {
    const res = await this.request<Array<Daemon>>("GET", DaemonRoute.GET_ALL_USER_DAEMONS)
    return res.body ?? []
  }

  async createDaemon(id: string): Promise<CreateDaemonResponse | undefined> {
    const res = await this.request<CreateDaemonResponse>("POST", DaemonRoute.CREATE_DAEMON, null, null, { id })
    return res.body ?? undefined
  }

  async patchDaemon(id: string, name: string): Promise<Daemon | undefined> {
    const res = await this.request<Daemon>("PATCH", DaemonRoute.UPDATE_DAEMON, { id }, null, { name })
    return res.body ?? undefined
  }

  async toggle(id: string) {
    await this.request("PATCH", DaemonRoute.TOGGLE_DAEMON, { id })
  }

  async reset(id: string) {
    await this.request("PATCH", DaemonRoute.RESET_DAEMON, { id })
  }

  async delete(id: string) {
    await this.request("DELETE", DaemonRoute.DELETE_DAEMON, { id })
  }
}

const daemon = new DaemonPaddyBackendClient()
export default daemon
