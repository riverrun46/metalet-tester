'use client'

import { Inter } from 'next/font/google'
import { useEffect, useState } from 'react'

const inter = Inter({ subsets: ['latin'] })

export default function Home() {
  const [wallet, setWallet] = useState<any | null>(null)
  useEffect(() => {
    setWallet(window.metaidwallet)
  }, [])

  const [consoleMessages, setConsoleMessages] = useState<string[]>([])

  const command = async (cmd: string, name: string) => {
    // 打印命令到控制台消息
    setConsoleMessages((prev) => [...prev, `> ${name}中……`])
    const res = await wallet[cmd]()

    console.log({ res })

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
    // 等待 1 秒
    await new Promise((resolve) => setTimeout(resolve, 100))
    // 再滚动一次
    if (consoleEl) {
      consoleEl.scrollTop = consoleEl.scrollHeight
    }
  }

  return (
    <main className="flex min-h-screen items-center justify-center">
      <div className="h-[80vh] aspect-square mor-shadow rounded-xl p-8 grid grid-cols-2 gap-8">
        {/* 操作面板 */}
        <div className="col-span-1">
          <h3 className="title col-span-3">连接</h3>
          <div className="mt-4 grid grid-cols-3 gap-4">
            <button className="btn" onClick={() => command('connect', '连接')}>
              连接
            </button>
            <button className="btn" onClick={() => command('disconnect', '断开连接')}>
              断开连接
            </button>
            <button className="btn" onClick={() => command('isConnected', '查看连接状态')}>
              查看连接状态
            </button>
          </div>

          <h3 className="title col-span-3 mt-8">获取账号信息</h3>
          <div className="mt-4 grid grid-cols-3 gap-4">
            <button className="btn" onClick={() => command('getAddress', '获取地址')}>
              获取地址
            </button>
            <button className="btn muted" disabled>
              获取公钥
            </button>
            <button className="btn" onClick={() => command('getBalance', '获取余额')}>
              获取余额
            </button>
          </div>

          <h3 className="title col-span-3 mt-8">交易</h3>
          <div className="mt-4 grid grid-cols-3 gap-4">
            <button className="btn muted" disabled onClick={() => command('getAddress', '获取地址')}>
              转账
            </button>
          </div>
        </div>

        {/* 控制台 */}
        <div className="col-span-1 mor-inner rounded-xl p-4 text-gray-400 text-sm overflow-y-scroll" id="console">
          {consoleMessages.map((msg, i) => (
            <p key={i} className={msg.startsWith('>') ? 'text-gray-400 mt-4 break-all' : 'break-all text-violet-700'}>
              {msg}
            </p>
          ))}
        </div>
      </div>
    </main>
  )
}
