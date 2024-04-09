import { AbstractBackendClient } from 'src/backend/AbstractBackendClient';
import { TotalPower } from 'src/backend/stats/dto/TotalPower';
import { AveragePower } from 'src/backend/stats/dto/AveragePower';
import { StatsRoute } from 'src/backend/stats/StatsRoute';

export type PowerTemporal =
  'MINUTE' | 'HOUR' | 'DAY' | 'WEEK' |'FOUR_WEEKS' | 'QUARTER' | 'HALF_YEAR' | 'YEAR'

class StatsPaddyBackendClient extends AbstractBackendClient {

  constructor() { super(); }

  async getTotalPower(
    daemonId: string,
    opt: {
      before?: number,
      after?: number
    } = {}
  ): Promise<TotalPower | undefined> {
    const queryParams = Object.assign({},
      !opt.before ? null : { before: `${opt.before}` },
      !opt.after ? null : { after: `${opt.after}` });

    const res = await this.request<TotalPower>(
      "GET", StatsRoute.TOTAL_POWER, { daemonId }, queryParams)
    return res.body ?? undefined
  }

  async getAverageStatsPower(
    daemonId: string,
    opt: {
      temporal?: PowerTemporal,
      before?: number,
      after?: number,
      limit?: number
    }
  ): Promise<Array<AveragePower>> {
    const queryParams = Object.assign({},
      !opt.temporal ? null : { temporal: `${opt.temporal}` },
      !opt.before ? null : { before: `${opt.before}` },
      !opt.after ? null : { after: `${opt.after}` },
      !opt.limit ? null : { limit: `${opt.limit}` });

    const res = await this.request<Array<AveragePower>>(
      "GET", StatsRoute.AVERAGE_POWER, { daemonId }, queryParams)
    return res.body ?? []
  }
}

const stats = new StatsPaddyBackendClient()
export default stats
