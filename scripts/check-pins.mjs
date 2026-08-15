import { readFileSync } from 'node:fs'
import { dirname, join } from 'node:path'
import { fileURLToPath } from 'node:url'

const root = join(dirname(fileURLToPath(import.meta.url)), '..')
const pkg = JSON.parse(readFileSync(join(root, 'package.json'), 'utf8'))
const deps = { ...pkg.dependencies, ...pkg.devDependencies }
const loose = []

for (const [name, version] of Object.entries(deps)) {
  if (typeof version !== 'string' || !/^\d+\.\d+\.\d+(?:-[0-9A-Za-z.-]+)?$/.test(version)) {
    loose.push(`${name}@${version}`)
  }
}

if (loose.length > 0) {
  console.error('Unpinned dependency ranges (use exact versions, no ^ ~ * or tags):\n')
  for (const spec of loose) console.error(`  ${spec}`)
  process.exit(1)
}

if (typeof pkg.packageManager !== 'string' || !pkg.packageManager.startsWith('pnpm@')) {
  console.error('package.json must pin packageManager to an exact pnpm version.')
  process.exit(1)
}

console.log(`Pinned ${Object.keys(deps).length} dependencies; packageManager ${pkg.packageManager}`)
