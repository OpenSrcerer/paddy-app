import { AbstractBackendClient } from 'src/backend/AbstractBackendClient';
import { Power } from 'src/backend/power/dto/Power';
import { PowerRoute } from 'src/backend/power/PowerRoute.enum';

class PowerPaddyBackendClient extends AbstractBackendClient {

  constructor() { super(); }

  async getAllDaemonPowers(
    daemonId: string,
    before?: number,
    after?: number,
    limit?: number,
  ): Promise<Array<Power>> {
    const queryParams = Object.assign({},
      !before ? null : { before: `${before}` },
      !after ? null : { after: `${after}` },
      !limit ? null : { limit: `${limit}` });

    const res = await this.request<Array<Power>>(
      "GET", PowerRoute.GET_ALL_POWERS, { daemonId }, queryParams)
    return res.body ?? []
  }
}

const power = new PowerPaddyBackendClient()
export default power
