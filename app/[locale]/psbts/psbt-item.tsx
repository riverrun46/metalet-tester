'use client'

import { Psbt } from 'bitcoinjs-lib'
import Btcjs from 'bitcoinjs-lib'

export default async function PsbtItem({ psbtWrapper }: { psbtWrapper: any }) {
  // 初始化bitcoinjs
  const bitcoinjs = await import('bitcoinjs-lib')
  const secp256k1 = await import('tiny-secp256k1')
  bitcoinjs.initEccLib(secp256k1)

  const psbt: Psbt = bitcoinjs.Psbt.fromHex(psbtWrapper.txHex, { network: bitcoinjs.networks.testnet })
  const tx = psbt.extractTransaction(true)
  const dummySize = 600

  const buy = async () => {
    const buyPsbt = new bitcoinjs.Psbt({ network: bitcoinjs.networks.testnet })
    const psbtTx = psbt.extractTransaction(true)

    // sellerInput
    const sellerInput: any = {
      hash: psbtTx.ins[0].hash,
      index: psbtTx.ins[0].index,
      nonWitnessUtxo: psbt.data.inputs[0].nonWitnessUtxo,
      witnessUtxo: psbt.data.inputs[0].witnessUtxo,
    }
    buyPsbt.addInput(sellerInput)

    // sellerOutput
    const sellerOutput: any = psbtTx.outs[0]
    buyPsbt.addOutput(sellerOutput)

    // broadcast

    // add 2 dummy inputs
    // buyPsbt.addInput({
    // const input: any = {
    //   hash: dummyUtxo.txid,
    //   index: dummyUtxo.vout,
    //   nonWitnessUtxo: dummyUtxo.tx.toBuffer(),
    // }

    const neededAmount = tx.outs.reduce((acc, output) => acc + output.value, 0)
  }

  return (
    <li key={psbtWrapper.id} className="p-8 rounded-xl bg-white shadow-lg">
      <a href={`/psbts/${psbtWrapper.id}`} className="text-indigo-700 hover:underline">
        {psbtWrapper.id}
      </a>

      <div className="space-y-4">
        <h3>Outputs</h3>
        {tx.outs.map((output) => (
          <div key={output.value} className="flex flex-col space-y-2">
            <p className="text-gray-500 break-all">{output.value}</p>
          </div>
        ))}
      </div>

      <button className="px-6 py-1 shadow-lg bg-indigo-100 rounded-md my-2" onClick={buy}>
        Buy
      </button>
    </li>
  )
}
