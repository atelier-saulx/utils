import { execSync } from 'child_process'

const args = process.argv.slice(2)

let command = 'ava --verbose --files "test/**/*.ts"'

if (args.length > 0) {
  const specificFile = args[0]
  command = `ava --verbose --files test/"${specificFile}"`
}

console.log(`Running: ${command}`)
execSync(command, { stdio: 'inherit' })
