export interface ProviderUserData {
  accountId: string
  email: string
  name: string
  image: string
}

export abstract class BaseProvider {
  protected abstract provider: unknown

  protected abstract readonly API_URL: string
  protected abstract readonly SCOPES: string[]

  abstract createAuthorizationURL(
    state: string,
    codeVerifier: string | null,
  ): URL

  abstract fetchUserData(
    code: string,
    codeVerifier: string | null,
  ): Promise<ProviderUserData>

  protected createCallbackUrl(provider: string) {
    let baseUrl = `http://localhost:${process.env.PORT ?? 3000}`
    if (typeof window !== 'undefined') baseUrl = window.location.origin
    if (process.env.APP_URL) baseUrl = `https://${process.env.APP_URL}`
    return `${baseUrl}/api/auth/${provider}/callback`
  }
}
