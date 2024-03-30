import { AbstractBackendClient } from 'src/backend/AbstractBackendClient';
import { Power } from 'src/backend/power/dto/Power';
import { PowerRoute } from 'src/backend/power/PowerRoute.enum';

class PowerPaddyBackendClient extends AbstractBackendClient {

  constructor() { super(); }

  async getAllDaemonPowers(
    daemonId: string,
    opt: {
      before?: number,
      after?: number,
      limit?: number
    }
  ): Promise<Array<Power>> {
    const queryParams = Object.assign({},
      !opt.before ? null : { before: `${opt.before}` },
      !opt.after ? null : { after: `${opt.after}` },
      !opt.limit ? null : { limit: `${opt.limit}` });

    const res = await this.request<Array<Power>>(
      "GET", PowerRoute.GET_ALL_POWERS, { daemonId }, queryParams)
    return res.body ?? []
  }
}

const power = new PowerPaddyBackendClient()
export default power
