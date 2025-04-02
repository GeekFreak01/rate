"use client";

import { useEffect, useState, useRef } from "react";
import html2canvas from "html2canvas";
import { Card } from "../components/ui/card";
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
      <span className={`flex items-center gap-1 text-xs ${color}`}>
        <Arrow size={12} />
        {Math.abs(value).toFixed(2)}%
      </span>
    );
  };

  const IconWithLabel = ({ src, alt }: { src: string; alt: string }) => (
    <div className="flex items-center gap-2">
      <img src={src} alt={alt} className="w-[32px] h-[32px]" />
      <span className="uppercase font-black text-sm text-white">{alt}</span>
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
            style={{ width: 1080, height: 640 }}
          >
            {!rates ? (
              <div className="text-white text-xl text-center mt-20">Загрузка данных...</div>
            ) : (
              <div className="flex flex-col justify-end h-full p-6 pt-6 space-y-1.5">
                <div className="absolute left-6 top-4 text-white text-xl font-black">
                  {date}
                </div>
                {[
                  { symbol: "BTC", value: rates.btc, change: rates.changes.btc },
                  { symbol: "ETH", value: rates.eth, change: rates.changes.eth },
                  { symbol: "TON", value: rates.ton, change: rates.changes.ton },
                  { symbol: "NOT", value: rates.not, change: rates.changes.not },
                  { symbol: "SOL", value: rates.sol, change: rates.changes.sol },
                ].map(({ symbol, value, change }) => (
                  <Card
                    key={symbol}
                    className="bg-[#00d2ff20] border border-[#00f0ff40] backdrop-blur-sm flex items-center justify-between px-4 py-2 rounded-xl"
                  >
                    <div className="flex items-center gap-4">
                      <IconWithLabel src={`/icons/${symbol.toLowerCase()}.svg`} alt={symbol} />
                    </div>
                    <div className="flex flex-col items-end text-white leading-tight gap-0.5">
                      <span className="text-xl font-bold">
                        ${value.toFixed(symbol === "NOT" ? 4 : 2)}
                      </span>
                      <ChangeIndicator value={change} />
                    </div>
                  </Card>
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
