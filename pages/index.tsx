"use client";

import React, { useEffect, useState, useRef } from "react";
import html2canvas from "html2canvas";

interface Crypto {
  symbol: string;
  price: number;
  logoUrl: string;
  logoSrc: string;
}

const API_KEY = "f98cc435-c24c-4084-869b-b798beb262f9";

export default function Home() {
  const [cryptoData, setCryptoData] = useState<Crypto[]>([]);
  const [date, setDate] = useState("");
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const symbols = ["BTC", "ETH", "TON", "NOT", "SOL"];
    const today = new Date();
    setDate(today.toLocaleDateString("ru-RU", { day: "2-digit", month: "long" }));

    const fetchData = async () => {
      try {
        const priceUrl = `https://pro-api.coinmarketcap.com/v1/cryptocurrency/quotes/latest?symbol=${symbols.join(",")}`;
        const infoUrl = `https://pro-api.coinmarketcap.com/v1/cryptocurrency/info?symbol=${symbols.join(",")}`;

        const [priceRes, infoRes] = await Promise.all([
          fetch(priceUrl, { headers: { "X-CMC_PRO_API_KEY": API_KEY } }),
          fetch(infoUrl, { headers: { "X-CMC_PRO_API_KEY": API_KEY } }),
        ]);

        const priceJson = await priceRes.json();
        const infoJson = await infoRes.json();

        const rawData = symbols.map((sym) => ({
          symbol: sym,
          price: priceJson.data[sym]?.quote?.USD?.price || 0,
          logoUrl: infoJson.data[sym]?.logo || "",
        }));

        const enriched = await Promise.all(
          rawData.map(async (item) => {
            try {
              const imgRes = await fetch(item.logoUrl);
              const blob = await imgRes.blob();
              const dataUrl = await new Promise<string>((resolve) => {
                const reader = new FileReader();
                reader.onloadend = () => resolve(reader.result as string);
                reader.readAsDataURL(blob);
              });
              return { ...item, logoSrc: dataUrl };
            } catch {
              return { ...item, logoSrc: "" };
            }
          })
        );

        setCryptoData(enriched);
      } catch (e) {
        console.error("Ошибка загрузки:", e);
      }
    };

    fetchData();
  }, []);

  const handleDownload = async () => {
    if (!ref.current) return;
    const canvas = await html2canvas(ref.current, { useCORS: true });
    const link = document.createElement("a");
    link.href = canvas.toDataURL("image/png");
    link.download = `crypto_rates_${date}.png`;
    link.click();
  };

  const formatPrice = (price: number) =>
    price >= 100 ? `$${Math.round(price)}` : `$${price.toFixed(4)}`;

  return (
    <main className="min-h-screen bg-[#0a0f1c] text-white font-inter flex flex-col items-center justify-center p-4">
      <div ref={ref} className="bg-[#0a0f1c] rounded-3xl p-6 w-[1080px] h-[580px]">
        <div className="text-xl font-bold mb-4">{date}</div>
        <div className="grid grid-cols-2 gap-4">
          {cryptoData.map((item) => (
            <div
              key={item.symbol}
              className="flex items-center justify-between p-4 bg-[#002b3a] rounded-xl shadow-sm"
            >
              <div className="flex items-center gap-3">
                <img
                  src={item.logoSrc}
                  alt={item.symbol}
                  className="w-10 h-10 rounded-full"
                />
                <span className="text-xl font-bold">{item.symbol}</span>
              </div>
              <div className="text-lg font-bold">{formatPrice(item.price)}</div>
            </div>
          ))}
        </div>
      </div>

      <button
        onClick={handleDownload}
        className="mt-6 bg-white text-black px-6 py-2 rounded-xl font-bold hover:bg-gray-200 transition"
      >
        Скачать изображение
      </button>
    </main>
  );
}
