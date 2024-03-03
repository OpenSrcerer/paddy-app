import { AbstractBackendClient } from 'src/backend/AbstractBackendClient';

class SessionPaddyBackendClient extends AbstractBackendClient {

  constructor() { super(); }

  async doLogin(usernameOrEmail: string, rawPassword: string) {
    await this.updateUserCredentials(usernameOrEmail, rawPassword)
  }
}

const session = new SessionPaddyBackendClient()
export default session
