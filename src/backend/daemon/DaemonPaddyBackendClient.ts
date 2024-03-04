import { AbstractBackendClient } from 'src/backend/AbstractBackendClient';
import { DaemonRoute } from 'src/backend/daemon/DaemonRoute.enum';
import { Daemon } from 'src/backend/daemon/dto/Daemon';
class DaemonPaddyBackendClient extends AbstractBackendClient {

  constructor() { super(); }

  async getAllUserDaemons(): Promise<Array<Daemon>> {
    const res = await this.request<Array<Daemon>>("GET", DaemonRoute.GET_ALL_USER_DAEMONS)
    return res.body ?? []
  }

  async toggle(id: string) {
    await this.request("PATCH", DaemonRoute.TOGGLE_DAEMON, { id: id.toString() })
  }
}

const daemon = new DaemonPaddyBackendClient()
export default daemon
