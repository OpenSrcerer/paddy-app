import { AbstractBackendClient } from 'src/backend/AbstractBackendClient';
import { PadRoute } from 'src/backend/pad/PadRoute.enum';

class PadPaddyBackendClient extends AbstractBackendClient {

  constructor() { super(); }

  async getAllUserPads() {
    const res = await this.request("GET", PadRoute.GET_ALL_USER_PADS)
    console.log(res)
  }

}

const pad = new PadPaddyBackendClient()
export default pad
