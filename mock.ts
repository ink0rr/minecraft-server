// deno-lint-ignore-file no-explicit-any

/**
 * A proxy that always returns itself.
 */
export const mock = new Proxy(() => {}, {
  get: () => mock,
}) as any;
