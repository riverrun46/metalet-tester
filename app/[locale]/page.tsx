'use client'

import { useEffect, useState } from 'react'
import { useLocale, useTranslations } from 'next-intl'
import Link from 'next/link'
// @ts-ignore
import mvc from 'mvc-lib'

import cases from '@/app/data/cases'

export default function Home() {
  const t = useTranslations('Index')
  const locale = useLocale()
  const theOther = locale === 'en' ? '中' : 'EN'
  const theOtherPath = locale === 'en' ? '/zh' : '/en'

  const [wallet, setWallet] = useState<any | null>(null)
  useEffect(() => {
    setWallet(window.metaidwallet)
  }, [])

  const [consoleMessages, setConsoleMessages] = useState<string[]>([])
  const [rawTxs, setRawTxs] = useState<string[]>([])

  const command = async (cmd: string, params?: any) => {
    // 打印命令到控制台消息
    const name = t(cmd)
    const newMessage = locale === 'en' ? `> ${name}...` : `> ${name}中……`
    setConsoleMessages((prev) => [...prev, newMessage])
    const res = await wallet[cmd](params)
    console.log({ res })

    // 先清除广播的生交易
    setRawTxs([])

    // 如果结果中具有未广播状态，将未广播的生交易放入 rawTxs
    if (typeof res === 'object' && res.hasOwnProperty('broadcasted') && !res.broadcasted) {
      for (const tx of res.res) {
        if (tx.hasOwnProperty('routeCheckTxHex')) {
          setRawTxs((prev) => [...prev, tx.routeCheckTxHex])
        }
        if (tx.hasOwnProperty('txHex')) {
          setRawTxs((prev) => [...prev, tx.txHex])
        }
      }
    }

    // 处理结果类型
    await printMessage(res)

    return res
  }

  const printMessage = async (msg: object | boolean | string) => {
    if (typeof msg === 'undefined') return

    // 处理结果类型
    if (typeof msg === 'object') {
      const resStr = JSON.stringify(msg)
      setConsoleMessages((prev) => [...prev, resStr])
    } else if (typeof msg === 'boolean') {
      const resStr = msg ? 'OK' : 'FALSE'
      setConsoleMessages((prev) => [...prev, resStr])
    } else {
      setConsoleMessages((prev) => [...prev, msg])
    }

    // 控制台滚动到底部
    const consoleEl = document.querySelector('#console')
    if (consoleEl) {
      consoleEl.scrollTop = consoleEl.scrollHeight
    }
    // 等待 0.1 秒
    await new Promise((resolve) => setTimeout(resolve, 100))
    // 再滚动一次
    if (consoleEl) {
      consoleEl.scrollTop = consoleEl.scrollHeight
    }
  }

  const transfer = async ({ caseIndex }: { caseIndex: number }) => {
    const chooseCase = cases[caseIndex]

    await command('transfer', {
      tasks: chooseCase.tasks,
      broadcast: chooseCase.broadcast,
    })
  }

  const callEciesDecrypt = async () => {
    // hello world
    await command('eciesDecrypt', {
      encrypted:
        '4249453102f09ef3517e9cea9e74b1a59588fe60f9b3afd3b5dd0b9343d36d945f004f0d08a6af2e608de2f40181e7aadd4edeb8021ca6cc1374f099e045741ee6fa01e77e8c5c41eb68f1f2c35e40b8741d0ab169',
    })
  }

  const createFirstTransaction = async () => {
    function getUnspentValue(tx: any) {
      const inputAmount = tx.inputs.reduce((pre: number, cur: any) => cur.output.satoshis + pre, 0)
      const outputAmount = tx.outputs.reduce((pre: number, cur: any) => cur.satoshis + pre, 0)

      let unspentAmount = inputAmount - outputAmount
      return unspentAmount
    }
    // 先创建一个交易
    const tx = new mvc.Transaction()
    const address = await command('getAddress')
    const { network } = await command('getNetwork')

    const utxo: {
      address: string
      txid: string
      outIndex: number
      value: number
    } = await command('getUtxos').then((utxos) => {
      // 返回最大的一个utxo
      const maxUtxo = utxos.reduce((prev: any, cur: any) => {
        if (cur.satoshis > prev.satoshis) {
          return cur
        } else {
          return prev
        }
      })

      return maxUtxo
    })

    const outputScript = mvc.Script.buildPublicKeyHashOut(utxo.address)
    // @ts-ignore
    const input = new mvc.Transaction.Input.PublicKeyHash({
      output: new mvc.Transaction.Output({
        script: outputScript,
        satoshis: utxo.value,
      }),
      prevTxId: utxo.txid,
      outputIndex: utxo.outIndex,
      script: mvc.Script.empty(),
    })
    tx.addInput(input)
    tx.addOutput(
      new mvc.Transaction.Output({
        script: new mvc.Script(new mvc.Address(address, network)),
        satoshis: 1000,
      }),
    )

    const unlockSize = tx.inputs.filter((v: any) => v.output!.script.isPublicKeyHashOut()).length * 107
    let fee = Math.ceil(tx.toBuffer().length + unlockSize + 62)

    let changeAmount = getUnspentValue(tx) - fee
    if (changeAmount >= 546) {
      tx.addOutput(
        new mvc.Transaction.Output({
          script: new mvc.Script(new mvc.Address(address, network)),
          satoshis: changeAmount,
        }),
      )
    }

    return {
      tx,
      address,
      outputScript,
      utxo,
    }
  }

  const signTransaction = async () => {
    const { tx, address, outputScript, utxo } = await createFirstTransaction()

    // 签名
    const { signature: signatureInfo } = await command('signTransaction', {
      transaction: {
        txHex: tx.toString(),
        address,
        inputIndex: 0,
        scriptHex: outputScript.toHex(),
        satoshis: utxo.value,
      },
    })

    const pureSig = mvc.crypto.Signature.fromTxFormat(Buffer.from(signatureInfo.sig, 'hex'))
    const signedScript = mvc.Script.buildPublicKeyHashIn(
      signatureInfo.publicKey,
      pureSig.toDER(),
      signatureInfo.sigtype,
    )
    tx.inputs[0].setScript(signedScript)

    // 推入生交易列表
    setRawTxs((prev) => [...prev, tx.toString()])
  }

  const previewTransaction = async () => {
    const { tx, address, outputScript, utxo } = await createFirstTransaction()

    await printMessage('> txid presigned:')
    await printMessage(tx.id)

    // 预览
    const { txid } = await command('previewTransaction', {
      transaction: {
        txHex: tx.toString(),
        address,
        inputIndex: 0,
        scriptHex: outputScript.toHex(),
        satoshis: utxo.value,
      },
    })

    await printMessage('> txid signed: ')
    await printMessage(txid)
  }

  const signTransactions = async () => {
    const { tx, address, outputScript, utxo } = await createFirstTransaction()
    // console

    // 构建链式交易2
    // const tx2 = new mvc.Transaction()
    // tx2.addInput(
    //   new mvc.Transaction.Input({
    //     prevTxId: tx.id,
    //     outputIndex: 0,
    //     script: mvc.Script.empty(),
    //   }),
    // )

    // 签名
    const { signatures: signaturesInfo } = await command('signTransactions', {
      transactions: [
        {
          txHex: tx.toString(),
          address,
          inputIndex: 0,
          scriptHex: outputScript.toHex(),
          satoshis: utxo.value,
        },
      ],
    })
    const signatureInfo = signaturesInfo[0]

    const pureSig = mvc.crypto.Signature.fromTxFormat(Buffer.from(signatureInfo.sig, 'hex'))
    const txSignature = mvc.Transaction.Signature.fromObject({
      publicKey: signatureInfo.publicKey,
      prevTxId: tx.inputs[0].prevTxId,
      outputIndex: tx.inputs[0].outputIndex,
      inputIndex: 0,
      signature: pureSig,
      sigtype: signatureInfo.sigtype,
    })
    const signedScript = mvc.Script.buildPublicKeyHashIn(
      txSignature.publicKey,
      txSignature.signature.toDER(),
      txSignature.sigtype,
    )
    tx.inputs[0].setScript(signedScript)

    // 推入生交易列表
    setRawTxs((prev) => [...prev, tx.toString()])
  }

  const tryBroadcast = async (rawTx: string) => {
    const res = await fetch('https://mainnet.mvcapi.com/tx/broadcast', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        hex: rawTx,
      }),
    }).then((res) => res.json())
    const txid = res.txid
    const newMessage = 'txid: ' + txid
    setConsoleMessages((prev) => [...prev, newMessage])

    // 控制台滚动到底部
    const consoleEl = document.querySelector('#console')
    if (consoleEl) {
      consoleEl.scrollTop = consoleEl.scrollHeight
    }
    // 等待 0.1 秒
    await new Promise((resolve) => setTimeout(resolve, 100))
    // 再滚动一次
    if (consoleEl) {
      consoleEl.scrollTop = consoleEl.scrollHeight
    }
  }

  const [showTransfer, setShowTransfer] = useState(true)

  return (
    <main className="flex min-h-screen items-center justify-center">
      <div className="h-[80vh] aspect-[1.4] mor-shadow rounded-xl p-8 grid grid-cols-2 gap-4">
        {/* 操作面板 */}
        <div className="col-span-1 overflow-y-auto px-4 pb-4">
          <h3 className="title col-span-3">{t('connect')}</h3>
          <div className="mt-4 grid grid-cols-3 gap-4">
            <button className="btn" onClick={() => command('connect')}>
              {t('connect')}
            </button>
            <button className="btn" onClick={() => command('disconnect')}>
              {t('disconnect')}
            </button>
            <button className="btn" onClick={() => command('isConnected')}>
              {t('isConnected')}
            </button>
            <button className="btn" onClick={() => command('getNetwork')}>
              {t('getNetwork')}
            </button>
            <button className="btn" onClick={() => command('switchNetwork')}>
              {t('switchNetwork')}
            </button>
          </div>

          <h3 className="title col-span-3 mt-8">{t('account')}</h3>
          <div className="mt-4 grid grid-cols-3 gap-4">
            <button className="btn" onClick={() => command('getAddress')}>
              {t('getAddress')}
            </button>
            <button className="btn" onClick={() => command('getAddress', { path: '0/2' })}>
              {t('getAddress') + ' 0/2'}
            </button>
            <button className="btn" onClick={() => command('getPublicKey')}>
              {t('getPublicKey')}
            </button>
            <button className="btn" onClick={() => command('getPublicKey', { path: '0/2' })}>
              {t('getPublicKey') + ' 0/2'}
            </button>
            <button className="btn" onClick={() => command('getXPublicKey')}>
              {t('getXPublicKey')}
            </button>
            <button className="btn" onClick={() => command('getBalance')}>
              {t('getBalance')}
            </button>
            <button className="btn" onClick={() => command('getUtxos')}>
              {t('getUtxos')}
            </button>
            <button className="btn" onClick={() => command('merge')}>
              {t('merge')}
            </button>
          </div>

          <h3 className="title col-span-3 mt-8">{t('encryption')}</h3>
          <div className="mt-4 grid grid-cols-3 gap-4">
            <button
              className="btn"
              onClick={() =>
                command('eciesEncrypt', {
                  message: 'hello world',
                })
              }
            >
              {t('eciesEncrypt')}
            </button>
            <button className="btn" onClick={callEciesDecrypt}>
              {t('eciesDecrypt')}
            </button>
            <button className="btn" onClick={previewTransaction}>
              {t('previewTransaction')}
            </button>
            <button className="btn" onClick={signTransaction}>
              {t('signTransaction')}
            </button>
            <button className="btn" onClick={signTransactions}>
              {t('signTransactions')}
            </button>
            <button className="btn" onClick={() => command('signMessage', { message: 'Hello World' })}>
              {t('signMessage')}
            </button>
          </div>

          <h3 className="title col-span-3 mt-8 flex items-center justify-between">
            <span>{t('transfer')}</span>
            <button
              className="rounded-full text-xs text-gray-500 py-1 px-4 mor-shadow-sm font-medium"
              onClick={() => setShowTransfer((prev) => !prev)}
            >
              {showTransfer ? t('collapse') : t('expand')}
            </button>
          </h3>
          {showTransfer && (
            <div className="mt-4 grid grid-cols-2 gap-4">
              {cases.map((c, i) => (
                <button
                  className={`btn col-span-1 !text-xs p-2 h-20 !rounded-2xl break-all ${c.disabled && 'muted'}`}
                  disabled={c.disabled}
                  key={i}
                  onClick={() => transfer({ caseIndex: i })}
                >
                  {c.name}
                </button>
              ))}
            </div>
          )}
        </div>

        <div className="col-span-1 flex flex-col overflow-y-hidden">
          <div className="flex justify-between items-center flex-wrap pt-4 gap-4">
            <div className="flex justify-start items-center px-4 gap-4 flex-wrap">
              {/* 广播按钮 */}
              {rawTxs.length > 0 &&
                rawTxs.map((rawTx, index) => (
                  <button
                    className="px-4 h-6 mor-shadow-sm font-medium text-gray-500 rounded-full text-xs flex items-center justify-center"
                    onClick={() => tryBroadcast(rawTx)}
                    key={index}
                  >
                    {t('broadcast') + ' ' + (index + 1)}
                  </button>
                ))}

              {/* 清除待广播按钮 */}
              {rawTxs.length > 0 && (
                <button
                  className="px-4 h-6 mor-shadow-sm font-medium text-gray-500 rounded-full text-xs flex items-center justify-center"
                  onClick={() => setRawTxs([])}
                >
                  {t('clearTx')}
                </button>
              )}
            </div>

            <div className="flex justify-end px-4 gap-x-4">
              {/* 切换语言 */}
              <Link
                href={theOtherPath}
                className="w-16 h-6 mor-shadow-sm font-medium text-gray-500 rounded-full text-xs flex items-center justify-center"
              >
                {theOther}
              </Link>

              {/* 清空按钮 */}
              <button
                className="w-16 h-6 mor-shadow-sm font-medium text-gray-500 rounded-full text-xs flex items-center justify-center"
                onClick={() => setConsoleMessages([])}
              >
                {t('clear')}
              </button>
            </div>
          </div>

          {/* 控制台 */}
          <div className="mor-inner rounded-xl p-4 text-gray-400 text-sm overflow-y-scroll mt-4 grow" id="console">
            {consoleMessages.map((msg, i) => (
              <p key={i} className={msg.startsWith('>') ? 'text-gray-400 mt-4 break-all' : 'break-all text-indigo-700'}>
                {msg}
              </p>
            ))}
          </div>
        </div>
      </div>
    </main>
  )
}
