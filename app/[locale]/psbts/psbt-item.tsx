import type { Psbt } from './page'

export default function PsbtItem({ psbt }: { psbt: Psbt }) {
  // const tx = bitcoinjs.

  return (
    <li key={psbt.id} className="p-8 rounded-xl bg-white shadow-lg">
      <a href={`/psbts/${psbt.id}`} className="text-indigo-700 hover:underline">
        {psbt.id}
      </a>

      <p className="text-gray-500 break-all">{psbt.txHex}</p>

      <p className="mt-2 text-sm text-gray-300">{psbt.createdAt}</p>
    </li>
  )
}
