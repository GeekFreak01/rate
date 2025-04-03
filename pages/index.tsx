"use client";

import { useEffect, useState, useRef } from "react";
import html2canvas from "html2canvas";
import { ArrowDown, ArrowUp } from "lucide-react";
import Head from "next/head";

interface Rates {
  btc: number;
  eth: number;
  ton: number;
  not: number;
  sol: number;
  changes: {
    btc?: number;
    eth?: number;
    ton?: number;
    not?: number;
    sol?: number;
  };
}

export default function Home() {
  const [rates, setRates] = useState<Rates | null>(null);
  const [date, setDate] = useState("");
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const today = new Date();
    const formatted = `${today.getDate()} ${today.toLocaleString("en", {
      month: "long",
    })}`;
    setDate(formatted);

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
      <div className={`flex items-center justify-end gap-1 ${color} text-base font-bold`}>
        <Arrow size={14} />
        {Math.abs(value).toFixed(2)}%
      </div>
    );
  };

  const IconWithLabel = ({ src, alt }: { src: string; alt: string }) => (
    <div className="flex items-center gap-4">
      <img src={src} alt={alt} className="w-10 h-10" />
      <span className="text-white text-2xl font-extrabold">{alt}</span>
    </div>
  );

  const formatPrice = (value: number, symbol: string) => {
    if (value >= 100) return `$${Math.round(value).toLocaleString()}`;
    return `$${value.toFixed(symbol === "NOT" ? 4 : 2)}`;
  };

  return (
    <>
      <Head>
        <link
          rel="preload"
          href="https://fonts.googleapis.com/css2?family=Inter:wght@900&display=swap"
          as="style"
        />
        <link
          href="https://fonts.googleapis.com/css2?family=Inter:wght@900&display=swap"
          rel="stylesheet"
        />
      </Head>

      <main className="min-h-screen bg-[#0a0f1c] flex items-center justify-center p-4 font-inter">
        <div className="w-[1080px] h-[580px] bg-[#0a0f1c] p-6 rounded-3xl" ref={ref}>
          {!rates ? (
            <div className="text-white text-center text-xl mt-20">Загрузка данных...</div>
          ) : (
            <div className="grid grid-cols-2 gap-4 h-full">
              {[
                { symbol: "BTC", value: rates.btc, change: rates.changes.btc },
                { symbol: "TON", value: rates.ton, change: rates.changes.ton },
                { symbol: "ETH", value: rates.eth, change: rates.changes.eth },
                { symbol: "NOT", value: rates.not, change: rates.changes.not },
                { symbol: "SOL", value: rates.sol, change: rates.changes.sol },
              ].map(({ symbol, value, change }, idx) => (
                <div
                  key={symbol}
                  className="flex flex-col justify-center bg-[#002733] px-6 py-4 rounded-xl"
                >
                  <div className="flex items-center justify-between">
                    <IconWithLabel src={`/icons/${symbol.toLowerCase()}.svg`} alt={symbol} />
                    <div className="text-white text-2xl font-extrabold text-right">
                      {formatPrice(value, symbol)}
                    </div>
                  </div>
                  <ChangeIndicator value={change} />
                </div>
              ))}

              {/* Date Block */}
              <div className="flex flex-col justify-center bg-[#003840] px-6 py-4 rounded-xl">
                <div className="flex items-center gap-4">
                  <img src="/icons/calendar.svg" alt="calendar" className="w-10 h-10" />
                  <span className="text-white text-2xl font-extrabold">{date}</span>
                </div>
              </div>
            </div>
          )}
        </div>
        <button
          onClick={handleDownload}
          className="text-white border mt-4 px-6 py-2 rounded-md border-white hover:bg-white hover:text-black transition"
        >
          Скачать изображение
        </button>
      </main>
    </>
  );
}
