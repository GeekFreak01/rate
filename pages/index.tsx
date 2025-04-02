"use client";

import { useEffect, useState, useRef } from "react";
import html2canvas from "html2canvas";
import { Card } from "../components/ui/card";
import { Button } from "../components/ui/button";
import { ArrowUp, ArrowDown } from "lucide-react";

interface Rates {
  btc: number;
  eth: number;
  ton: number;
  usd: number;
  eur: number;
  changes: {
    btc?: number;
    eth?: number;
    ton?: number;
    usd?: number;
    eur?: number;
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
    link.href = canvas.toDataURL();
    link.click();
  };

  const ChangeIndicator = ({ value }: { value?: number }) => {
    if (typeof value !== "number") return <span>—</span>;
    const isPositive = value >= 0;
    const Arrow = isPositive ? ArrowUp : ArrowDown;
    const color = isPositive ? "text-green-400" : "text-red-400";
    return (
      <span className={`flex items-center gap-1 text-xl ${color}`}>
        <Arrow size={18} />
        {Math.abs(value).toFixed(2)}%
      </span>
    );
  };

  return (
    <main className="min-h-screen bg-[#0A0F1C] flex items-center justify-center p-4">
      <div className="space-y-4">
        <div
          ref={ref}
          className="bg-[#0A0F1C] p-8 rounded-xl text-white shadow-xl"
          style={{ width: 1080, height: 1080 }}
        >
          {!rates ? (
            <div className="text-white text-2xl text-center mt-40">Загрузка данных...</div>
          ) : (
            <div className="space-y-6">
              <Card className="bg-[#122742] flex items-center justify-between p-6 text-3xl">
                <span>₿</span>
                <span className="font-bold">${rates.btc.toLocaleString()}</span>
                <ChangeIndicator value={rates.changes.btc} />
              </Card>
              <Card className="bg-[#122742] flex items-center justify-between p-6 text-3xl">
                <span>Ξ</span>
                <span className="font-bold">${rates.eth.toLocaleString()}</span>
                <ChangeIndicator value={rates.changes.eth} />
              </Card>
              <Card className="bg-[#122742] flex items-center justify-between p-6 text-3xl">
                <span>TON</span>
                <span className="font-bold">${rates.ton.toFixed(2)}</span>
                <ChangeIndicator value={rates.changes.ton} />
              </Card>
              <Card className="bg-gradient-to-r from-[#0D3C6B] to-[#0A789C] text-white p-6 text-2xl">
                <div className="text-lg text-blue-200">КУРС ВАЛЮТ</div>
                <div className="flex justify-between mt-2">
                  <span>$ {rates.usd.toFixed(2)}</span>
                  <ChangeIndicator value={rates.changes.usd} />
                </div>
                <div className="flex justify-between">
                  <span>€ {rates.eur.toFixed(2)}</span>
                  <ChangeIndicator value={rates.changes.eur} />
                </div>
              </Card>
              <Card className="bg-[#0D3C6B] text-center py-12 text-white text-4xl font-semibold">
                {date}
              </Card>
            </div>
          )}
        </div>
        <Button onClick={handleDownload} className="w-full">
          Скачать изображение
        </Button>
      </div>
    </main>
  );
}
