'use client';

import { useEffect, useState, useRef } from 'react';
import html2canvas from 'html2canvas';
import { ArrowDown, ArrowUp, CalendarDays } from 'lucide-react';
import '@fontsource/inter/900.css';

interface Crypto {
  symbol: string;
  price: number;
  change: number;
  logo: string;
}

export default function Home() {
  const [cryptos, setCryptos] = useState<Crypto[]>([]);
  const [date, setDate] = useState('');
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const today = new Date();
    setDate(today.toLocaleDateString('ru-RU', { day: '2-digit', month: 'long' }));

    fetch('/api/crypto')
      .then((res) => res.json())
      .then((data) => setCryptos(data.cryptos))
      .catch(console.error);
  }, []);

  const handleDownload = async () => {
    if (!ref.current) return;
    const canvas = await html2canvas(ref.current, { useCORS: true });
    const link = document.createElement('a');
    link.download = `курс_${date}.png`;
    link.href = canvas.toDataURL('image/png');
    link.click();
  };

  const formatValue = (value: number) =>
    value >= 100 ? Math.round(value).toLocaleString() : value.toFixed(2);

  const ChangeIndicator = ({ value }: { value: number }) => {
    const isPositive = value >= 0;
    const Arrow = isPositive ? ArrowUp : ArrowDown;
    const color = isPositive ? 'text-green-400' : 'text-red-400';
    return (
      <div className={`flex items-center gap-1 text-lg font-bold ${color}`}>
        <Arrow size={20} />
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
      <div className="flex items-center gap-4">
        {icon && <div className="w-14 h-14 flex items-center justify-center">{icon}</div>}
        <span className="text-white text-[2.25rem] font-black">{label}</span>
      </div>
      {!isDate && value && (
        <div className="flex flex-col items-end text-white">
          <span className="text-[2.25rem] font-black">${value}</span>
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
              <img src={c.logo} alt={c.symbol} className="w-full h-full object-contain" />
            }
            label={c.symbol}
            value={formatValue(c.price)}
            change={c.change}
          />
        ))}
        <Card
          icon={<CalendarDays size={48} className="text-cyan-400" />}
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
