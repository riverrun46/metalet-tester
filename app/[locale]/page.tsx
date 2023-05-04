'use client'

import { useEffect, useState } from 'react'
import { useLocale, useTranslations } from 'next-intl'
import Link from 'next/link'

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
    console.log({ params })
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
    if (typeof res === 'object') {
      const resStr = JSON.stringify(res)
      setConsoleMessages((prev) => [...prev, resStr])
    } else if (typeof res === 'boolean') {
      const resStr = res ? 'OK' : 'FALSE'
      setConsoleMessages((prev) => [...prev, resStr])
    } else {
      setConsoleMessages((prev) => [...prev, res])
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

  const tryBroadcast = async (rawTx: string) => {
    const res = await fetch('https://testnet.mvcapi.com/tx/broadcast', {
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
            <button className="btn muted" disabled>
              {t('getPublicKey')}
            </button>
            <button className="btn" onClick={() => command('getBalance')}>
              {t('getBalance')}
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
            <button className="btn" onClick={() => command('eciesDecrypt')}>
              {t('eciesDecrypt')}
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
