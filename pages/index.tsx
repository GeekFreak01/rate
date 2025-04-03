"use client";

import { useEffect, useRef, useState } from "react";
import html2canvas from "html2canvas";
import { ArrowUp, ArrowDown } from "lucide-react";
import "@fontsource/inter/900.css";
import Head from "next/head";

interface Rates {
  btc: number;
  eth: number;
  sol: number;
  ton: number;
  not: number;
  changes: {
    btc?: number;
    eth?: number;
    sol?: number;
    ton?: number;
    not?: number;
  };
}

export default function Home() {
  const [rates, setRates] = useState<Rates | null>(null);
  const [date, setDate] = useState("");
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const today = new Date();
    const day = today.getDate();
    const month = today.toLocaleDateString("en-US", { month: "long" });
    setDate(`${day} ${month}`);
    fetch("/api/crypto")
      .then((res) => res.json())
      .then((data) => setRates(data))
      .catch(() => setRates(null));
  }, []);

  const handleDownload = async () => {
    if (!ref.current) return;
    const canvas = await html2canvas(ref.current);
    const link = document.createElement("a");
    link.download = `курс_${date}.png`;
    link.href = canvas.toDataURL("image/png");
    link.click();
  };

  const ChangeIndicator = ({ value }: { value?: number }) => {
    if (typeof value !== "number") return null;
    const isPositive = value >= 0;
    const Arrow = isPositive ? ArrowUp : ArrowDown;
    const color = isPositive ? "text-green-400" : "text-red-400";
    return (
      <span className={`flex items-center gap-1 text-sm font-semibold ${color}`}>
        <Arrow size={12} />
        {Math.abs(value).toFixed(2)}%
      </span>
    );
  };

  const Card = ({
    children,
    highlight,
  }: {
    children: React.ReactNode;
    highlight?: boolean;
  }) => (
    <div
      className={`rounded-xl px-6 py-4 flex items-center justify-between ${
        highlight ? "bg-[#00f0ff20]" : "bg-[#03202e]"
      }`}
    >
      {children}
    </div>
  );

  const IconWithLabel = ({ symbol }: { symbol: string }) => (
    <div className="flex items-center gap-3">
      <img src={`/icons/${symbol.toLowerCase()}.svg`} alt={symbol} className="w-10 h-10" />
      <span className="text-white text-2xl font-black">{symbol}</span>
    </div>
  );

  return (
    <>
      <Head>
        <title>Курс криптовалют</title>
      </Head>
      <main className="min-h-screen bg-[#0a0f1c] flex items-center justify-center p-4 font-inter">
        <div className="space-y-4">
          <div
            ref={ref}
            className="rounded-3xl border border-[#00d2ff]/10 bg-[#0a0f1c] w-[1080px] h-[580px] px-6 py-4 grid grid-cols-2 gap-4"
          >
            {!rates ? (
              <div className="text-white text-xl">Загрузка...</div>
            ) : (
              <>
                {/* Левый столбец */}
                <div className="flex flex-col gap-4">
                  <Card>
                    <IconWithLabel symbol="BTC" />
                    <div className="text-right">
                      <p className="text-white text-xl font-black">
                        ${rates.btc.toLocaleString()}
                      </p>
                      <ChangeIndicator value={rates.changes.btc} />
                    </div>
                  </Card>
                  <Card>
                    <IconWithLabel symbol="ETH" />
                    <div className="text-right">
                      <p className="text-white text-xl font-black">
                        ${rates.eth.toLocaleString()}
                      </p>
                      <ChangeIndicator value={rates.changes.eth} />
                    </div>
                  </Card>
                  <Card>
                    <IconWithLabel symbol="SOL" />
                    <div className="text-right">
                      <p className="text-white text-xl font-black">
                        ${rates.sol.toLocaleString()}
                      </p>
                      <ChangeIndicator value={rates.changes.sol} />
                    </div>
                  </Card>
                </div>

                {/* Правый столбец */}
                <div className="flex flex-col gap-4">
                  <Card>
                    <IconWithLabel symbol="TON" />
                    <div className="text-right">
                      <p className="text-white text-xl font-black">${rates.ton.toFixed(2)}</p>
                      <ChangeIndicator value={rates.changes.ton} />
                    </div>
                  </Card>
                  <Card>
                    <IconWithLabel symbol="NOT" />
                    <div className="text-right">
                      <p className="text-white text-xl font-black">${rates.not.toFixed(4)}</p>
                      <ChangeIndicator value={rates.changes.not} />
                    </div>
                  </Card>
                  <Card highlight>
                    <div className="flex items-center gap-3">
                      <img src="/icons/calendar.svg" className="w-8 h-8" alt="calendar" />
                      <span className="text-white text-2xl font-black">{date}</span>
                    </div>
                    <span />
                  </Card>
                </div>
              </>
            )}
          </div>
          <button
            onClick={handleDownload}
            className="bg-white hover:bg-gray-100 px-6 py-3 rounded-xl text-black font-bold text-lg w-full"
          >
            Скачать изображение
          </button>
        </div>
      </main>
    </>
  );
}
