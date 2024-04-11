import { AbstractBackendClient } from 'src/backend/AbstractBackendClient';
import { PowerStatistic } from 'src/backend/stats/dto/PowerStatistic';
import { StatsRoute } from 'src/backend/stats/StatsRoute';

export type PowerTemporal =
  'MINUTE' | 'HOUR' | 'DAY' | 'WEEK' | 'MONTH' | 'QUARTER' | 'HALF_YEAR' | 'YEAR'

class StatsPaddyBackendClient extends AbstractBackendClient {

  constructor() { super(); }

  async getTotalPower(
    daemonId: string,
    opt: {
      before?: number,
      after?: number
    } = {}
  ): Promise<PowerStatistic | undefined> {
    const queryParams = Object.assign({},
      !opt.before ? null : { before: `${opt.before}` },
      !opt.after ? null : { after: `${opt.after}` });

    const res = await this.request<PowerStatistic>(
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
  ): Promise<Array<PowerStatistic>> {
    const queryParams = Object.assign({},
      !opt.temporal ? null : { temporal: `${opt.temporal}` },
      !opt.before ? null : { before: `${opt.before}` },
      !opt.after ? null : { after: `${opt.after}` },
      !opt.limit ? null : { limit: `${opt.limit}` });

    const res = await this.request<Array<PowerStatistic>>(
      "GET", StatsRoute.AVERAGE_POWER, { daemonId }, queryParams)
    return res.body ?? []
  }

  async getRollingAveragePower(
    daemonId: string,
    opt: {
      temporal?: PowerTemporal,
      before?: number,
      after?: number,
      limit?: number
    }
  ): Promise<Array<PowerStatistic>> {
    const queryParams = Object.assign({},
      !opt.temporal ? null : { temporal: `${opt.temporal}` },
      !opt.before ? null : { before: `${opt.before}` },
      !opt.after ? null : { after: `${opt.after}` },
      !opt.limit ? null : { limit: `${opt.limit}` });

    const res = await this.request<Array<PowerStatistic>>(
      "GET", StatsRoute.ROLLING_POWER, { daemonId }, queryParams)
    return res.body ?? []
  }
}

const stats = new StatsPaddyBackendClient()
export default stats
