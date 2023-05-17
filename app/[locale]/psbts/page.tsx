import PsbtItem from './psbt-item'

export type Psbt = {
  id: string
  txHex: string
  createdAt: string
}

export default async function PsbtList() {
  const endpoint = `${
    process.env.VERCEL_ENV === 'development' ? 'http://localhost:3000' : 'https://ordex.riverrun.online'
  }/api/psbts`
  const psbts = await fetch(endpoint).then((res) => res.json())

  return (
    <main className="py-8 px-24 font-mono min-h-screen bg-indigo-50">
      <h1 className="font-bold text-xl text-indigo-700">Psbt List</h1>
      <ul className="mt-4 gap-4">
        {psbts.map((psbt: Psbt) => (
          <PsbtItem psbt={psbt} key={psbt.id} />
        ))}
      </ul>
    </main>
  )
}
