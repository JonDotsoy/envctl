import { flags, command, restArgumentsAt, flag, isStringAt } from "@jondotsoy/flags"
import { cwd } from "process"
import { pathToFileURL } from "url"
import { parse } from "dotenv"
import { readFile, writeFile } from "fs/promises"

const build = async (args: string[]) => {
  type Options = {
    context: string
  }

  const { context } = flags<Options>(args, {}, [
    [flag('--ctx', '-c'), isStringAt('context')]
  ])

  if (!context) throw new Error(`Missing flag --ctx`)

  const envSource = new URL(`.env.${context}`, pathToFileURL(`${cwd()}/`))
  const envTemplate = new URL('.env.template', pathToFileURL(`${cwd()}/`))
  const envDestiny = new URL('.env', pathToFileURL(`${cwd()}/`))

  const envSourceParsed = parse(await readFile(envSource))
  const envTemplateParsed = new TextDecoder().decode(await readFile(envTemplate))
    .replace(/^((?:\w|_)*)=(.*)/mg, (_: string, varName: string) => {
      return `${varName}=${envSourceParsed[varName] ?? ''}`
    })

  await writeFile(envDestiny, new TextEncoder().encode(envTemplateParsed))
}

const main = (args: string[]) => {
  type Options = {
    build: string[]
  }

  const parsed = flags<Options>(args, {}, [
    [command('build'), restArgumentsAt('build')],
  ])

  if (parsed.build) return build(parsed.build)

  throw new Error(`Usage: envctl build --ctx=<ctx>`)
}

await main(process.argv.slice(2))
