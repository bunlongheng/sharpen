import { useFont } from './FontContext'

// Output captured from a real run of the lesson (see scripts/record-python.mjs). Labeled as
// recorded so the panel never pretends the browser executed the code.
export default function RecordedOutput({ output }: { output: string }) {
  const { size: fontSize } = useFont()
  return (
    <div className="ts-output-wrap">
      <div className="ts-output-head">expected output (recorded from a real run)</div>
      <pre className="ts-output" style={{ fontSize, lineHeight: 1.5 }}>
        {output.trimEnd() || '(no output)'}
      </pre>
    </div>
  )
}
