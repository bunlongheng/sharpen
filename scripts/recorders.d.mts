export interface Recorder {
  label: string
  dir: string
  ext: string
  tool: string
  toolCheck: string[]
  files(root: string): string[]
  run(root: string, file: string): string
}
export const RECORDERS: Recorder[]
