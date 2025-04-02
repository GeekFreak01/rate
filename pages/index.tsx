"use client";

import { useEffect, useState, useRef } from "react";
import html2canvas from "html2canvas";
import { Button } from "../components/ui/button";
import { ArrowUp, ArrowDown } from "lucide-react";
import "@fontsource/inter/900.css";
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
    setDate(
      today.toLocaleDateString("ru-RU", {
        day: "numeric",
        month: "long",
      })
    );
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
    if (typeof value !== "number") return <span>—</span>;
    const isPositive = value >= 0;
    const Arrow = isPositive ? ArrowUp : ArrowDown;
    const color = isPositive ? "text-green-400" : "text-red-400";
    return (
      <span className={`flex items-center gap-1 text-lg ${color}`}>
        <Arrow size={18} />
        {Math.abs(value).toFixed(2)}%
      </span>
    );
  };

  const IconWithLabel = ({ src, alt }: { src: string; alt: string }) => (
    <div className="flex items-center gap-3">
      <img src={src} alt={alt} className="w-9 h-9" />
      <span className="uppercase font-black text-2xl text-white">{alt}</span>
    </div>
  );

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
        <div className="space-y-4">
          <div
            className="relative rounded-3xl shadow-2xl border border-[#00d2ff]/10 bg-gradient-to-b from-[#081520] to-[#0a0f1c]"
            ref={ref}
            style={{ width: 1080, height: 1080 }}
          >
            {!rates ? (
              <div className="text-white text-xl text-center mt-40">Загрузка данных...</div>
            ) : (
              <div className="flex flex-col justify-between h-full p-6 pt-12 relative">
                <div className="absolute top-6 left-6 text-white text-xl font-black">
                  {date}
                </div>

                {[
                  { symbol: "BTC", value: rates.btc, change: rates.changes.btc },
                  { symbol: "ETH", value: rates.eth, change: rates.changes.eth },
                  { symbol: "TON", value: rates.ton, change: rates.changes.ton },
                  { symbol: "NOT", value: rates.not, change: rates.changes.not },
                  { symbol: "SOL", value: rates.sol, change: rates.changes.sol },
                ].map(({ symbol, value, change }) => (
                  <div
                    key={symbol}
                    style={{ height: 190 }}
                    className="bg-[#00d2ff20] border border-[#00f0ff40] backdrop-blur-sm flex items-center justify-between px-6 py-4 rounded-xl"
                  >
                    <IconWithLabel src={`/icons/${symbol.toLowerCase()}.svg`} alt={symbol} />
                    <div className="flex flex-col items-end text-white leading-tight gap-2">
                      <span className="text-4xl font-black">
                        ${value.toFixed(symbol === "NOT" ? 4 : 2)}
                      </span>
                      <ChangeIndicator value={change} />
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          <Button onClick={handleDownload} className="w-full hover:brightness-110 transition">
            Скачать изображение
          </Button>
        </div>
      </main>
    </>
  );
}
