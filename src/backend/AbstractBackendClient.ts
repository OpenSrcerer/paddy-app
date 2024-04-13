import axios, { isAxiosError, Method } from 'axios';
import { isRetriesExceeded, RetriesExceededError } from 'src/backend/RetriesExceededError';
import { PaddyRes } from 'src/backend/PaddyRes';
import { LocalStorage } from 'quasar';
import { LoginCredential } from 'src/backend/session/dto/LoginCredential';
import { LoginResponseDto } from 'src/backend/session/dto/LoginResponseDto';
import { SessionRoute } from 'src/backend/session/SessionRoute.enum';
import { Router } from 'src/router';

export abstract class AbstractBackendClient {

  private static API_BASE_URL = 'https://mqtt.danielstefani.online/api/v1'
  private static API_BACKOFF_TIME_MS = 1000
  private static API_MAX_RETRIES = 3

  // ---- Update this JWT periodically as it expires quickly (300s) ----
  protected static jwt: string | null = null

  protected async request<T>(
    verb: Method,
    path: string,
    pathParams: Record<string, string> | null = null,
    queryParams: Record<string, string> | null = null,
    body: Record<string, any> | null = null,
    retryCounter = 0,
    retry = true
  ): Promise<PaddyRes<T>> {
    const requestConfig = {
      method: verb,
      headers: AbstractBackendClient.jwt ?
        { "Content-Type": "application/json", Authorization: AbstractBackendClient.jwt } :
        { "Content-Type": "application/json" },
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

      console.log(
        `[BACKEND] Response ${verb}@/${path}\n---------------------------------------\nCode:`,
        `${res?.status}\nHeaders:`,
        !!res?.headers ? `${JSON.stringify(res?.headers)}\nBody:` : "<empty>\nBody:",
        !!res?.data ? JSON.stringify(res?.data) : "<empty>")

      return { code: res.status, body: res.data }

    } catch (error: unknown) {

      if (isRetriesExceeded(error)) {
        throw new RetriesExceededError("[BACKEND] Max retries exceeded: 3/3")
      }

      if (isAxiosError(error)) {
        console.log(
          `[BACKEND] Error on /${path} <${retryCounter + 1}/${AbstractBackendClient.API_MAX_RETRIES}>\n---------------------------------------\nCode:`,
          `${error?.response?.status}\nHeaders:`,
          !!error?.response?.headers ? `${JSON.stringify(error?.response?.headers)}\nBody:` : "<empty>\nBody:",
          !!error?.response?.data ? JSON.stringify(error?.response?.data) : "<empty>")

        // Refresh JWT
        if (error?.response?.status === 401 && retry) {
          await this.doRefresh()

          // Try again
          return this.request(verb, path, pathParams,
            queryParams, body, retryCounter + 1)
        }

        return { code: error?.response?.status ?? 0, body: undefined }
      }

      return this.request(verb, path, pathParams,
        queryParams, body, retryCounter + 1)
    }
  }

  // Retrieves a short-lived generic token for application access
  private async doRefresh() {
    const refreshToken = LocalStorage.getItem(LoginCredential.REFRESH_TOKEN)
    if (!refreshToken) {
      await Router.replace("/")
      throw new Error("Refresh token missing... cannot retrieve jwt! Going back to login page.")
    }

    // Replace JWT for subsequent refresh call
    AbstractBackendClient.jwt = refreshToken as string

    // Retrieves the jwt
    const res = await this.request<LoginResponseDto>("POST", SessionRoute.REFRESH, null, null, null, 0, false)

    // Handle expired refresh token
    if (res.code != 200) {
      await Router.replace("/")
      LocalStorage.remove(LoginCredential.REFRESH_TOKEN)
      throw new Error("Refresh token is probably expired... cannot retrieve jwt! Going back to login page.")
    }

    if (!res.body) {
      await Router.replace("/")
      LocalStorage.remove(LoginCredential.REFRESH_TOKEN)
      throw new Error("Uh oh, server returned an invalid login response. Try again later.")
    }

    // Inject the real JWT
    AbstractBackendClient.jwt = res.body.jwt
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
}
