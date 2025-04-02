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
        <Arrow size={18} />
        {Math.abs(value).toFixed(2)}%
      </span>
    );
  };

  const IconWithLabel = ({ src, alt }: { src: string; alt: string }) => (
    <div className="flex items-center gap-2">
      <img src={src} alt={alt} className="w-6 h-6 rounded-full shadow-sm" />
      <span className="uppercase font-black text-xl">{alt}</span>
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
      <main className="min-h-screen bg-gradient-to-br from-[#0A0F1C] to-[#0F1D2E] flex items-center justify-center p-4 font-inter">
        <div className="space-y-4">
          <div className="bg-[#0A0F1C] p-4 rounded-xl text-white shadow-xl">
            <div className="bg-white p-4 rounded-xl">
              <div
                ref={ref}
                className="bg-[#0A0F1C] p-8 rounded-xl"
                style={{ width: 1080, height: 1080 }}
              >
                {!rates ? (
                  <div className="text-white text-2xl text-center mt-40">Загрузка данных...</div>
                ) : (
                  <div className="space-y-6">
                    <Card className="bg-[#122742] flex items-center justify-between p-6 text-3xl font-black rounded-2xl shadow-lg ring-1 ring-blue-900">
                      <IconWithLabel src="/icons/btc.svg" alt="BTC" />
                      <span className="font-black">${rates.btc.toLocaleString()}</span>
                      <ChangeIndicator value={rates.changes.btc} />
                    </Card>
                    <Card className="bg-[#122742] flex items-center justify-between p-6 text-3xl font-black rounded-2xl shadow-lg ring-1 ring-blue-900">
                      <IconWithLabel src="/icons/eth.svg" alt="ETH" />
                      <span className="font-black">${rates.eth.toLocaleString()}</span>
                      <ChangeIndicator value={rates.changes.eth} />
                    </Card>
                    <Card className="bg-[#122742] flex items-center justify-between p-6 text-3xl font-black rounded-2xl shadow-lg ring-1 ring-blue-900">
                      <IconWithLabel src="/icons/ton.svg" alt="TON" />
                      <span className="font-black">${rates.ton.toFixed(2)}</span>
                      <ChangeIndicator value={rates.changes.ton} />
                    </Card>
                    <Card className="bg-gradient-to-r from-[#0D3C6B] to-[#0A789C] text-white p-6 text-2xl font-black rounded-2xl shadow-xl">
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
                    <Card className="bg-[#0D3C6B] text-center py-12 text-white text-4xl font-black rounded-2xl">
                      {date}
                    </Card>
                  </div>
                )}
              </div>
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
