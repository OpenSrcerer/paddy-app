export type LoginRequestDto = {
  emailOrUsername: string,
  passwordHash: string // Base64
}
