import PsbtItem from './psbt-item'

export type Psbt = {
  id: string
  txHex: string
  createdAt: number
}

export default async function PsbtList() {
  // 将实例放入store
  const endpoint = `${
    process.env.VERCEL_ENV === 'development' ? 'http://localhost:3000' : 'https://ordex.riverrun.online'
  }/api/psbts`
  const psbts = await fetch(endpoint).then((res) => res.json())

  return (
    <main className="py-8 px-24 font-mono min-h-screen bg-indigo-50">
      <h1 className="font-bold text-xl text-indigo-700">Psbt List</h1>
      <ul className="flex flex-col mt-4 gap-4">
        {psbts.map((psbt: Psbt) => (
          <PsbtItem psbtWrapper={psbt} key={psbt.id} />
        ))}
      </ul>
    </main>
  )
}
