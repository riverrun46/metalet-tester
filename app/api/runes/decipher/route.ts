export const dynamic = 'force-dynamic'

import { isRunestone } from '@/runestone/artifact'
import { type Cenotaph } from '@/runestone/cenotaph'
import { Runestone } from '@/runestone/runestone'

export async function POST(request: Request) {
  const requestJson = await request.json()
  const script = requestJson.script
  let runestoneIndex = requestJson.runestoneIndex
  if (typeof runestoneIndex === 'undefined') {
    runestoneIndex = 2
  }

  if (!script) {
    return new Response('script is required', { status: 400 })
  }

  type Output = {
    scriptPubKey: {
      hex: string
    }
  }
  const placeholderOutput: Output = {
    scriptPubKey: {
      hex: '',
    },
  }
  const vout: Output[] = []
  for (let i = 0; i < runestoneIndex; i++) {
    vout.push(placeholderOutput)
  }
  vout.push({ scriptPubKey: { hex: script } })
  const runestoneTx = { vout }

  const artifact = Runestone.decipher(runestoneTx)
  if (artifact.isNone()) {
    return new Response('decipher failed', { status: 400 })
  }
  if (!isRunestone(artifact.unwrap())) {
    const cenotaph = artifact.unwrap() as Cenotaph
    return new Response(
      JSON.stringify({
        type: 'cenotaph',
        flaws: cenotaph.flaws,
      }),
      { status: 200 },
    )
  }

  // is runestone
  const runestone = artifact.unwrap() as Runestone
  const spec = {
    edicts: runestone.edicts.map((edict) => {
      return {
        id: {
          block: edict.id.block.toString(),
          tx: edict.id.tx.toString(),
        },
        amount: edict.amount.toString(),
        output: edict.output.toString(),
      }
    }),
    pointer: runestone.pointer.isNone() ? null : runestone.pointer.unwrap().toString(),
  }

  return new Response(
    JSON.stringify({
      type: 'runestone',
      spec,
    }),
    {
      headers: {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
        'Access-Control-Allow-Headers': 'Content-Type, Authorization',
      },
      status: 200,
    },
  )
}
