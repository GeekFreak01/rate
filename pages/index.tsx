"use client";

import React from "react";
import { useEffect, useState, useRef } from "react";
import html2canvas from "html2canvas";
import { ArrowUp, ArrowDown, CalendarDays } from "lucide-react";
import "@fontsource/inter/900.css";

interface CryptoItem {
  price: number;
  change: number;
  logo: string;
}

interface CryptoData {
  [symbol: string]: CryptoItem;
}

export default function Home() {
  const [data, setData] = useState<CryptoData | null>(null);
  const [date, setDate] = useState("");
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    fetch("/api/crypto")
      .then((res) => res.json())
      .then((res) => {
        setData(res.data);
        const d = new Date(res.date);
        setDate(d.toLocaleDateString("en-GB", { day: "numeric", month: "long" }));
      });
  }, []);

  const handleDownload = async () => {
    if (!ref.current) return;
    const canvas = await html2canvas(ref.current);
    const link = document.createElement("a");
    link.download = `курс_${date}.png`;
    link.href = canvas.toDataURL("image/png");
    link.click();
  };

  const format = (value: number, symbol: string) => {
    return value >= 100 ? Math.round(value).toLocaleString() : value.toFixed(symbol === "NOT" ? 4 : 2);
  };

  const ChangeIndicator = ({ value }: { value: number }) => {
    const isPositive = value >= 0;
    const Arrow = isPositive ? ArrowUp : ArrowDown;
    const color = isPositive ? "text-green-400" : "text-red-400";
    return (
      <div className={`flex items-center gap-1 text-base font-bold ${color}`}>
        <Arrow size={14} />
        {Math.abs(value).toFixed(2)}%
      </div>
    );
  };

  return (
    <main className="min-h-screen bg-[#0a0f1c] flex flex-col items-center justify-center p-4 font-inter">
      <div ref={ref} className="grid grid-cols-2 gap-4 w-[1080px] h-[580px] p-6 bg-[#0a0f1c] rounded-3xl">
        {data && (
          <>
            {[
              ["BTC", "TON"],
              ["ETH", "NOT"],
              ["SOL", "DATE"],
            ].map((row, rowIndex) => (
              <React.Fragment key={rowIndex}>
                {row.map((symbol) =>
                  symbol === "DATE" ? (
                    <div
                      key="date"
                      className="bg-[#003840] rounded-xl p-6 flex items-center justify-between"
                    >
                      <div className="flex items-center gap-4">
                        <CalendarDays size={32} className="text-cyan-400" />
                        <span className="text-white text-2xl font-black">{date}</span>
                      </div>
                    </div>
                  ) : (
                    <div
                      key={symbol}
                      className="bg-[#012631] rounded-xl p-6 flex items-center justify-between"
                    >
                      <div className="flex items-center gap-4">
                        <img
                          src={data[symbol].logo}
                          alt={symbol}
                          className="w-10 h-10 rounded-full"
                        />
                        <span className="text-white text-2xl font-black">{symbol}</span>
                      </div>
                      <div className="flex flex-col items-end text-white">
                        <span className="text-2xl font-black">
                          ${format(data[symbol].price, symbol)}
                        </span>
                        <ChangeIndicator value={data[symbol].change} />
                      </div>
                    </div>
                  )
                )}
              </React.Fragment>
            ))}
          </>
        )}
      </div>
      <button
        onClick={handleDownload}
        className="mt-4 bg-white text-black px-6 py-2 rounded-xl font-bold hover:bg-gray-200 transition"
      >
        Скачать изображение
      </button>
    </main>
  );
}
