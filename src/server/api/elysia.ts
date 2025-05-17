import type { ElysiaConfig } from 'elysia'
import Elysia from 'elysia'

export const createElysia = <TPrefix extends string>(
  options?: ElysiaConfig<TPrefix>,
) =>
  new Elysia({
    ...options,
    aot: true,
  })
