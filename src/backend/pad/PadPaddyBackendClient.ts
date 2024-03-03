import { AbstractBackendClient } from 'src/backend/AbstractBackendClient';
import { PadRoute } from 'src/backend/pad/PadRoute.enum';
import { Pad } from 'src/backend/pad/dto/Pad';
import { PaddyRes } from 'src/backend/PaddyRes';

class PadPaddyBackendClient extends AbstractBackendClient {

  constructor() { super(); }

  async getAllUserPads(): Promise<Array<Pad>> {
    const res = await this.request<Array<Pad>>("GET", PadRoute.GET_ALL_USER_PADS)
    return res.body ?? []
  }

  async toggle(id: string) {
    await this.request("PATCH", PadRoute.TOGGLE_PAD, { id: id.toString() })
  }
}

const pad = new PadPaddyBackendClient()
export default pad
