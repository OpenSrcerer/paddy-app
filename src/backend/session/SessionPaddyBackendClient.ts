import { AbstractBackendClient } from 'src/backend/AbstractBackendClient';
import { LocalStorage } from 'quasar';
import { LoginCredential } from 'src/backend/session/dto/LoginCredential';
import { LoginResponseDto } from 'src/backend/session/dto/LoginResponseDto';
import { SessionRoute } from 'src/backend/session/SessionRoute.enum';
import { pbkdf2 } from 'src/backend/WebCryptoPbkdf2';

class SessionPaddyBackendClient extends AbstractBackendClient {

  constructor() { super(); }

  // Retrieves a refresh token
  // THE RAW PASSWORD MUST NOT LEAVE THIS FUNCTION!!
  // If you want security, that is
  async doLogin(emailOrUsername: string, rawPassword: string) {
    const passwordHash = await pbkdf2(rawPassword) // Base64
    const res = await this.request<LoginResponseDto>("POST", SessionRoute.LOGIN, null, null,
      { emailOrUsername, passwordHash })

    if (res.code == 404) {
      throw new Error("User not found, please try again.")
    }

    if (res.code == 403) {
      throw new Error("Invalid password provided, please try again.")
    }

    if (!res.body) {
      throw new Error("Uh oh, server returned an invalid login response. Try again later.")
    }

    // Save refresh token in local storage
    LocalStorage.set(LoginCredential.REFRESH_TOKEN, res.body.jwt)
  }
}

const session = new SessionPaddyBackendClient()
export default session
