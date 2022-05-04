import fg from 'fast-glob'
import { readFileSync } from 'fs'

const allowedDirs = [
  '_atoms',
  '_sharedComponents',
  '_hooks',
  '_types',
  '_helpers',
]

const run = async () => {
  const paths = await fg('src/App/**')

  paths.map((path) => {
    const errors = readFileSync(path, { encoding: 'utf-8' })
      .split('\n')
      .map((text, idx) => ({ text, lineNumber: idx + 1 }))
      .filter((entry) => entry.text.startsWith('import'))
      .map((entry) => ({
        ...entry,
        parsed: entry.text.slice(entry.text.indexOf("'") + 1, -1),
      }))
      .filter((entry) => entry.parsed.startsWith('../'))
      .map((entry) => {
        const split = entry.parsed.split('/').filter((y) => y !== '..')
        const [first] = split
        const startsWithNonAllowed = !allowedDirs.includes(first)
        const isComponent =
          split.length === 1 && first[0].toUpperCase() === first[0]

        return {
          ...entry,
          hasError: startsWithNonAllowed && !isComponent,
        }
      })
      .filter((entry) => entry.hasError)

    if (errors.length) {
      console.log(`Error at path: ${path}`)
      errors.map((entry) =>
        console.log(`line ${entry.lineNumber}: ${entry.text}`)
      )

      console.log('\n')
    }
  })
}

run()
