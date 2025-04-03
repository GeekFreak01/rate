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
    const day = today.getDate();
    const month = today.toLocaleString("en-US", { month: "long" });
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
    if (typeof value !== "number") return <span>—</span>;
    const isPositive = value >= 0;
    const Arrow = isPositive ? ArrowUp : ArrowDown;
    const color = isPositive ? "text-green-400" : "text-red-400";
    return (
      <span className={`flex items-center gap-1 text-xl ${color}`}>
        <Arrow size={20} />
        {Math.abs(value).toFixed(2)}%
      </span>
    );
  };

  const formatValue = (symbol: string, value: number): string => {
    if (symbol === "NOT") return value.toFixed(4);
    return value > 100 ? Math.round(value).toString() : value.toFixed(2);
  };

  const IconWithLabel = ({ symbol }: { symbol: string }) => (
    <div className="flex items-center gap-4">
      <img
        src={`https://rate-jade.vercel.app/icons/${symbol.toLowerCase()}.svg`}
        alt={symbol}
        className="w-20 h-20"
      />
      <span className="uppercase font-black text-4xl text-white">{symbol}</span>
    </div>
  );

  const renderCard = (
    symbol: string,
    value?: number,
    change?: number,
    isDate = false
  ) => (
    <div
      key={symbol}
      className="bg-[#00d2ff20] border border-[#00f0ff40] backdrop-blur-sm flex flex-col justify-center px-6 py-4 rounded-xl w-[500px] h-[160px]"
    >
      {isDate ? (
        <div className="flex items-center gap-4">
          <img
            src="https://www.svgrepo.com/show/354301/calendar.svg"
            alt="calendar"
            className="w-10 h-10"
          />
          <span className="text-white text-4xl font-black">{date}</span>
        </div>
      ) : (
        <div className="flex items-center justify-between w-full">
          <IconWithLabel symbol={symbol} />
          <div className="flex flex-col items-end text-white gap-2 leading-tight">
            <span className="text-4xl font-black">${formatValue(symbol, value!)}</span>
            <ChangeIndicator value={change} />
          </div>
        </div>
      )}
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
          <div className="relative" style={{ width: 1080, height: 1080 }}>
            <div
              ref={ref}
              className="rounded-3xl border border-[#00d2ff]/10 bg-[#0a0f1c] w-full h-full p-6"
            >
              {!rates ? (
                <div className="text-white text-xl text-center mt-40">Загрузка данных...</div>
              ) : (
                <div className="grid grid-cols-2 gap-x-6 gap-y-6">
                  {renderCard("BTC", rates.btc, rates.changes.btc)}
                  {renderCard("TON", rates.ton, rates.changes.ton)}
                  {renderCard("ETH", rates.eth, rates.changes.eth)}
                  {renderCard("NOT", rates.not, rates.changes.not)}
                  {renderCard("SOL", rates.sol, rates.changes.sol)}
                  {renderCard("Дата", undefined, undefined, true)}
                </div>
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
