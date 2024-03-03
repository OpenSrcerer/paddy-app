import axios, { isAxiosError, Method } from 'axios';
import crypto from 'crypto';
import { isRetriesExceeded, RetriesExceededError } from 'src/backend/RetriesExceededError';
import { SessionRoute } from 'src/backend/session/SessionRoute.enum';
import { LoginResponseDto } from 'src/backend/session/dto/LoginResponseDto';

export abstract class AbstractBackendClient {

  private static API_BASE_URL = 'https://mqtt.danielstefani.online/api/v1'
  private static API_BACKOFF_TIME_MS = 3000
  private static API_MAX_RETRIES = 3

  // ---- For password hashing ----
  private static PBKDF2_ALGORITHM = 'sha512'
  private static PBKDF2_ITERATIONS = 210000 // From OWASP
  private static PBKDF2_KEY_LENGTH = 256 // Bits

  // ---- User Credentials that should be updated every login/logout ----
  private static emailOrUsername: string | null = null
  private static passwordHash: string | null = null

  // ---- Update this JWT periodically as it expires quickly ----
  private static jwt: string | null = null

  protected async request<T>(
    verb: Method,
    path: string,
    pathParams: Record<string, string> | null = null,
    queryParams: Record<string, string> | null = null,
    body: Record<string, string> | null = null,
    retryCounter = 0
  ): Promise<T> {
    const requestConfig = {
      method: verb,
      headers: AbstractBackendClient.jwt ?
        { Authorization: AbstractBackendClient.jwt } : { },
      url: `${AbstractBackendClient.API_BASE_URL}/${this.replacePathParams(path, pathParams)}`,
      params: queryParams ?? {},
      data: body
    }

    try {

      // Max Retries
      if (retryCounter > 2) {
        throw new RetriesExceededError()
      }

      // Backoff
      if (retryCounter > 0) {
        await new Promise(res => setTimeout(res, AbstractBackendClient.API_BACKOFF_TIME_MS));
      }

      const res = await axios.request(requestConfig)
      return res.data

    } catch (error: unknown) {

      if (isRetriesExceeded(error)) {
        throw new RetriesExceededError("[BACKEND] Max retries exceeded: 3/3")
      }

      if (isAxiosError(error)) {
        console.log(
          `[BACKEND] Error on /${path} <${retryCounter + 1}/${AbstractBackendClient.API_MAX_RETRIES}>\n---------------------------------------\nCode:`,
          `${error?.response?.status}\nHeaders:`,
          !!error?.response?.headers ? `${error?.response?.headers}\nBody:` : "<empty>\nBody:",
          !!error?.response?.data ? error?.response?.data : "<empty>")

        if (error?.response?.status === 401) {
          await this.handleUnauthorized()
        }

        return this.request(verb, path, pathParams,
          queryParams, body, retryCounter + 1)
      }

      throw error // Weird scenario
    }
  }

  // Get a new JWT if the user credentials are set
  private async handleUnauthorized() {
    if (!AbstractBackendClient.emailOrUsername || !AbstractBackendClient.passwordHash) {
      throw new Error("Identifier or password missing... cannot retrieve jwt!")
    }

    // Retrieves the jwt
    const res = await this.request<LoginResponseDto>("POST", SessionRoute.LOGIN, null, null,
      {
        emailOrUsername: AbstractBackendClient.emailOrUsername,
        passwordHash: AbstractBackendClient.passwordHash
      }
    )

    AbstractBackendClient.jwt = res?.jwt ?? null
  }

  private replacePathParams(path: string, pathParams: Record<string, string> | null) {
    if (!pathParams) {
      return path
    }

    return Object.keys(pathParams).reduce((url, paramKey) => {
      const placeholder = `:${paramKey}`;
      const value = encodeURIComponent(pathParams[paramKey]);
      return url.replace(placeholder, value);
    }, path);
  }

  /*
  Updates this client's credentials with the given
  username and hashed password.
  Be careful with the user password, it should never
  leave this function un-hashed!
   */
  private updateUserCredentials(usernameOrEmail: string, rawPassword: string) {
    AbstractBackendClient.emailOrUsername = usernameOrEmail

    const onHashedPassword = (err: Error | null, derivedKey: Buffer) => {
      if (err) throw err;
      AbstractBackendClient.passwordHash = derivedKey.toString('base64')
    }

    crypto.pbkdf2(rawPassword, '' /* (salt on server) */,
      AbstractBackendClient.PBKDF2_ITERATIONS, AbstractBackendClient.PBKDF2_KEY_LENGTH / 8,
      AbstractBackendClient.PBKDF2_ALGORITHM, onHashedPassword)
  }
}
