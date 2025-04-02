import { useEffect, useState, useRef } from "react";
import html2canvas from "html2canvas";
import { Card } from "../components/ui/card";
import { Button } from "../components/ui/button";

interface Rates {
  btc: number;
  eth: number;
  ton: number;
  usd: number;
  eur: number;
  changes: {
    btc: number;
    eth: number;
    ton: number;
    usd: number;
    eur: number;
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
      .then((data) => setRates(data));
  }, []);

  const handleDownload = async () => {
    if (!ref.current) return;
    const canvas = await html2canvas(ref.current);
    const link = document.createElement("a");
    link.download = `курс_${date}.png`;
    link.href = canvas.toDataURL();
    link.click();
  };

  return (
    <main className="min-h-screen bg-neutral-900 flex items-center justify-center p-4">
      <div className="space-y-4">
        <div
          ref={ref}
          className="bg-neutral-800 p-8 rounded-xl text-white"
          style={{ width: 1080, height: 1080 }}
        >
          <div className="space-y-6">
            <Card className="bg-neutral-700 flex items-center justify-between p-6 text-3xl">
              <span>₿</span>
              <span className="font-bold">${rates?.btc.toLocaleString()}</span>
              <span className="text-green-500 text-xl">
                ↑ {rates?.changes.btc.toFixed(2)}%
              </span>
            </Card>
            <Card className="bg-neutral-700 flex items-center justify-between p-6 text-3xl">
              <span>Ξ</span>
              <span className="font-bold">${rates?.eth.toLocaleString()}</span>
              <span className="text-green-500 text-xl">
                ↑ {rates?.changes.eth.toFixed(2)}%
              </span>
            </Card>
            <Card className="bg-neutral-700 flex items-center justify-between p-6 text-3xl">
              <span>TON</span>
              <span className="font-bold">${rates?.ton.toFixed(2)}</span>
              <span className="text-green-500 text-xl">
                ↑ {rates?.changes.ton.toFixed(2)}%
              </span>
            </Card>
            <Card className="bg-neutral-900 text-white p-6 text-2xl">
              <div className="text-lg text-gray-400">КУРС ВАЛЮТ</div>
              <div className="flex justify-between mt-2">
                <span>$ {rates?.usd.toFixed(2)}</span>
                <span className="text-green-400">↑</span>
              </div>
              <div className="flex justify-between">
                <span>€ {rates?.eur.toFixed(2)}</span>
                <span className="text-green-400">↑</span>
              </div>
            </Card>
            <Card className="bg-neutral-700 text-center py-12 text-white text-4xl font-semibold">
              {date}
            </Card>
          </div>
        </div>
        <Button onClick={handleDownload} className="w-full">
          Скачать изображение
        </Button>
      </div>
    </main>
  );
}
