"use client";

import { useEffect, useState, useRef } from "react";
import html2canvas from "html2canvas";
import { ArrowDown, ArrowUp, CalendarDays } from "lucide-react";
import "@fontsource/inter/900.css";

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
    const formattedDate = today.toLocaleDateString("en-GB", {
      day: "numeric",
      month: "long",
    });
    setDate(formattedDate);
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

  const formatValue = (value: number) => {
    if (value >= 100) return Math.round(value).toLocaleString();
    return value.toFixed(2);
  };

  const ChangeIndicator = ({ value }: { value?: number }) => {
    if (typeof value !== "number") return null;
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
          <ChangeIndicator value={change} />
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
        <Card
          icon={<img src="/icons/btc.svg" alt="BTC" className="w-10 h-10" />}
          label="BTC"
          value={rates ? formatValue(rates.btc) : undefined}
          change={rates?.changes.btc}
        />
        <Card
          icon={<img src="/icons/ton.svg" alt="TON" className="w-10 h-10" />}
          label="TON"
          value={rates ? formatValue(rates.ton) : undefined}
          change={rates?.changes.ton}
        />
        <Card
          icon={<img src="/icons/eth.svg" alt="ETH" className="w-10 h-10" />}
          label="ETH"
          value={rates ? formatValue(rates.eth) : undefined}
          change={rates?.changes.eth}
        />
        <Card
          icon={<img src="/icons/not.svg" alt="NOT" className="w-10 h-10" />}
          label="NOT"
          value={rates ? formatValue(rates.not) : undefined}
          change={rates?.changes.not}
        />
        <Card
          icon={<img src="/icons/sol.svg" alt="SOL" className="w-10 h-10" />}
          label="SOL"
          value={rates ? formatValue(rates.sol) : undefined}
          change={rates?.changes.sol}
        />
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
