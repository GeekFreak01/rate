"use client";

import React, { useEffect, useState, useRef } from "react";
import html2canvas from "html2canvas";
import { CalendarDays, ArrowUp, ArrowDown } from "lucide-react";
import "@fontsource/inter/900.css";

const CMC_API_KEY = "f98cc435-c24c-4084-869b-b798beb262f9";
const SYMBOLS = ["BTC", "ETH", "TON", "NOT", "SOL"];

interface Crypto {
  symbol: string;
  price: number;
  change: number;
  logo: string; // base64
}

export default function Home() {
  const [cryptos, setCryptos] = useState<Crypto[]>([]);
  const [date, setDate] = useState("");
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const today = new Date();
    setDate(
      today.toLocaleDateString("ru-RU", {
        day: "2-digit",
        month: "long",
      })
    );

    const fetchData = async () => {
      try {
        const [priceRes, infoRes] = await Promise.all([
          fetch(
            `https://pro-api.coinmarketcap.com/v1/cryptocurrency/quotes/latest?symbol=${SYMBOLS.join(",")}`,
            { headers: { "X-CMC_PRO_API_KEY": CMC_API_KEY } }
          ),
          fetch(
            `https://pro-api.coinmarketcap.com/v1/cryptocurrency/info?symbol=${SYMBOLS.join(",")}`,
            { headers: { "X-CMC_PRO_API_KEY": CMC_API_KEY } }
          ),
        ]);

        const prices = await priceRes.json();
        const info = await infoRes.json();

        const withLogos: Crypto[] = await Promise.all(
          SYMBOLS.map(async (sym) => {
            const price = prices.data[sym]?.quote?.USD?.price || 0;
            const change = prices.data[sym]?.quote?.USD?.percent_change_24h || 0;
            const logoUrl = info.data[sym]?.logo;

            const logoBlob = await fetch(logoUrl).then((r) => r.blob());
            const logoBase64 = await new Promise<string>((resolve) => {
              const reader = new FileReader();
              reader.onloadend = () => resolve(reader.result as string);
              reader.readAsDataURL(logoBlob);
            });

            return {
              symbol: sym,
              price,
              change,
              logo: logoBase64,
            };
          })
        );

        setCryptos(withLogos);
      } catch (err) {
        console.error("Ошибка загрузки данных:", err);
      }
    };

    fetchData();
  }, []);

  const formatValue = (value: number) => {
    if (value >= 100) return Math.round(value).toLocaleString();
    return value.toFixed(2);
  };

  const handleDownload = async () => {
    if (!ref.current) return;
    const canvas = await html2canvas(ref.current);
    const link = document.createElement("a");
    link.download = `курс_${date}.png`;
    link.href = canvas.toDataURL("image/png");
    link.click();
  };

  const ChangeIndicator = ({ value }: { value: number }) => {
    const isPositive = value >= 0;
    const Arrow = isPositive ? ArrowUp : ArrowDown;
    const color = isPositive ? "text-green-400" : "text-red-400";
    return (
      <div className={`flex items-center gap-1 text-sm font-bold ${color}`}>
        <Arrow size={14} />
        {Math.abs(value).toFixed(2)}%
      </div>
    );
  };

  const Card = ({
    icon,
    label,
    value,
    change,
    isDate = false,
  }: {
    icon?: JSX.Element;
    label: string;
    value?: string;
    change?: number;
    isDate?: boolean;
  }) => (
    <div className="bg-[#012631] rounded-xl p-6 flex items-center justify-between h-full w-full">
      <div className="flex items-center gap-3">
        {icon}
        <span className="text-white text-2xl font-black">{label}</span>
      </div>
      {!isDate && value && (
        <div className="flex flex-col items-end text-white">
          <span className="text-2xl font-black">${value}</span>
          <ChangeIndicator value={change ?? 0} />
        </div>
      )}
    </div>
  );

  return (
    <main className="min-h-screen bg-[#0a0f1c] flex flex-col items-center justify-center p-4 font-inter">
      <div
        ref={ref}
        className="grid grid-cols-2 gap-4 bg-[#0a0f1c] rounded-3xl w-[1080px] h-[580px] p-6"
      >
        {cryptos.map((c) => (
          <Card
            key={c.symbol}
            icon={
              <img
                src={c.logo}
                alt={c.symbol}
                className="w-10 h-10 object-contain"
              />
            }
            label={c.symbol}
            value={formatValue(c.price)}
            change={c.change}
          />
        ))}

        <Card
          icon={<CalendarDays size={32} className="text-cyan-400" />}
          label={date}
          isDate
        />
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
