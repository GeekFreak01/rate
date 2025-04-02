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
      <span className={`flex items-center gap-1 text-sm ${color}`}>
        <Arrow size={14} />
        {Math.abs(value).toFixed(2)}%
      </span>
    );
  };

  const IconWithLabel = ({ src, alt }: { src: string; alt: string }) => (
    <div className="flex items-center gap-2">
      <img src={src} alt={alt} className="w-[16px] h-[16px] rounded-full" />
      <span className="uppercase font-black text-sm tracking-wide text-white">{alt}</span>
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
          <div className="bg-[#111827] p-6 rounded-3xl shadow-2xl border border-[#1f2937]">
            <div
              ref={ref}
              className="bg-gradient-to-br from-[#0a0f1c] to-[#111827] rounded-2xl p-8 w-[1080px] h-[1080px] flex flex-col justify-between"
            >
              {!rates ? (
                <div className="text-white text-xl text-center mt-40">Загрузка данных...</div>
              ) : (
                <>
                  <div className="space-y-4">
                    {[
                      { symbol: "BTC", value: rates.btc, change: rates.changes.btc },
                      { symbol: "ETH", value: rates.eth, change: rates.changes.eth },
                      { symbol: "TON", value: rates.ton, change: rates.changes.ton },
                      { symbol: "NOT", value: rates.not, change: rates.changes.not },
                      { symbol: "SOL", value: rates.sol, change: rates.changes.sol },
                    ].map(({ symbol, value, change }) => (
                      <Card
                        key={symbol}
                        className="bg-[#1c1f2a] flex items-center justify-between px-6 py-4 rounded-xl shadow-md border border-[#2a2e3a]"
                      >
                        <IconWithLabel src={`/icons/${symbol.toLowerCase()}.svg`} alt={symbol} />
                        <span className="text-xl text-white font-black">${value.toFixed(symbol === "NOT" ? 4 : 2)}</span>
                        <ChangeIndicator value={change} />
                      </Card>
                    ))}
                  </div>

                  <div className="text-center pt-8 text-white text-4xl font-black tracking-wider">
                    {date}
                  </div>
                </>
              )}
            </div>
          </div>
          <Button onClick={handleDownload} className="w-full hover:brightness-110 transition">
            Скачать изображение
          </Button>
        </div>
      </main>
    </>
  );
}
