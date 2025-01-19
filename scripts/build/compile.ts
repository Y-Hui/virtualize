import type { OutputOptions, RollupOptions } from 'rollup'
import { rollup } from 'rollup'

export async function compile(config: RollupOptions) {
  if (!config.output) {
    return Promise.reject(new Error('Not output.'))
  }
  const build = await rollup(config)

  const outputs: OutputOptions[] = Array.isArray(config.output)
    ? config.output
    : [config.output]

  return Promise.all(outputs.map((output) => build.write(output)))
}
