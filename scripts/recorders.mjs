// How each recorded track is executed. Shared by record-lessons.mjs (writes .out.txt) and
// src/__tests__/recordedLessons.test.ts (proves the recordings still match a fresh run).
import { execFileSync } from 'node:child_process'
import { readdirSync, mkdirSync, copyFileSync, existsSync } from 'node:fs'
import { join, basename } from 'node:path'
import { tmpdir, homedir } from 'node:os'

const tmp = (name) => {
  const d = join(tmpdir(), 'brushup-record', name)
  mkdirSync(d, { recursive: true })
  return d
}
const run = (cmd, args, opts = {}) =>
  execFileSync(cmd, args, {
    encoding: 'utf8',
    timeout: 120000,
    env: { ...process.env, DOTNET_CLI_TELEMETRY_OPTOUT: '1', DOTNET_NOLOGO: '1' },
    ...opts,
  })
// dotnet may live in ~/.dotnet (Microsoft's user-local installer) rather than on PATH
const dotnet = existsSync(join(homedir(), '.dotnet', 'dotnet'))
  ? join(homedir(), '.dotnet', 'dotnet')
  : 'dotnet'
const lessons = (root, dir, ext) =>
  readdirSync(join(root, dir))
    .filter((f) => f.endsWith(ext))
    .sort()
const compileAndRun = (compiler, flags) => (root, file) => {
  const bin = join(tmp(compiler), basename(file).replace(/\.[^.]+$/, ''))
  run(compiler, [...flags, join(root, file), '-o', bin])
  return run(bin, [])
}

export const RECORDERS = [
  {
    label: 'Python',
    dir: 'src/python',
    ext: '.py',
    tool: 'python3',
    toolCheck: ['--version'],
    files: (root) => lessons(root, 'src/python', '.py'),
    run: (root, file) => run('python3', [join(root, 'src/python', file)]),
  },
  {
    label: 'Rust',
    dir: 'src/rust',
    ext: '.rs',
    tool: 'rustc',
    toolCheck: ['--version'],
    files: (root) => lessons(root, 'src/rust', '.rs'),
    run: (root, file) => compileAndRun('rustc', ['-O'])(root, join('src/rust', file)),
  },
  {
    label: 'PHP',
    dir: 'src/php',
    ext: '.php',
    tool: 'php',
    toolCheck: ['--version'],
    files: (root) => lessons(root, 'src/php', '.php'),
    run: (root, file) => run('php', [join(root, 'src/php', file)]),
  },
  {
    label: 'C',
    dir: 'src/c',
    ext: '.c',
    tool: 'clang',
    toolCheck: ['--version'],
    files: (root) => lessons(root, 'src/c', '.c'),
    run: (root, file) =>
      compileAndRun('clang', ['-std=c17', '-Wall', '-Wextra', '-O2'])(root, join('src/c', file)),
  },
  {
    label: 'C++',
    dir: 'src/cpp',
    ext: '.cpp',
    tool: 'clang++',
    toolCheck: ['--version'],
    files: (root) => lessons(root, 'src/cpp', '.cpp'),
    run: (root, file) =>
      compileAndRun('clang++', ['-std=c++20', '-Wall', '-Wextra', '-O2'])(root, join('src/cpp', file)),
  },
  {
    label: 'C#',
    dir: 'src/csharp',
    ext: '.cs',
    tool: dotnet,
    toolCheck: ['--version'],
    files: (root) => lessons(root, 'src/csharp', '.cs'),
    run: (root, file) => {
      const proj = tmp('dotnet')
      if (!existsSync(join(proj, 'lesson.csproj')))
        run(dotnet, ['new', 'console', '-n', 'lesson', '-o', proj, '--force'])
      copyFileSync(join(root, 'src/csharp', file), join(proj, 'Program.cs'))
      run(dotnet, ['build', proj, '-c', 'Release', '-nologo', '-v', 'q'])
      const dll = join(proj, 'bin', 'Release', readdirSync(join(proj, 'bin', 'Release'))[0], 'lesson.dll')
      return run(dotnet, [dll])
    },
  },
]
