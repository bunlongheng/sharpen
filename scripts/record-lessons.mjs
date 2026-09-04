#!/usr/bin/env node
// Re-record the stdout of every lesson in the recorded tracks (Python, Rust, PHP, C, C++, C#):
// src/<track>/<lesson>.<ext> -> <lesson>.out.txt. The app shows these recordings because those
// languages cannot run in the browser; recordedLessons.test.ts fails when a recording drifts.
// Usage: npm run record:lessons [python|rust|php|c|cpp|csharp]
import { writeFileSync } from 'node:fs'
import { join } from 'node:path'
import { RECORDERS } from './recorders.mjs'

const root = new URL('..', import.meta.url).pathname
const only = process.argv[2]
for (const rec of RECORDERS) {
  if (only && rec.label.toLowerCase().replace('++', 'pp').replace('#', 'sharp') !== only) continue
  for (const file of rec.files(root)) {
    const out = rec.run(root, file)
    writeFileSync(join(root, rec.dir, file.replace(rec.ext, '.out.txt')), out)
    console.log(`${rec.label} ${file} -> ${out.split('\n').length - 1} lines`)
  }
}
