import { View, Text, ScrollView } from 'react-native';
import BackButton from '../../src/components/BackButton';
import { useState, useEffect } from 'react';
import { useGame } from '../../src/store';

const TICKERS = ['AAPL','MSFT','NVDA','AMZN','META'] as const;
type Ticker = typeof TICKERS[number];

export default function Stocks() {
  const s = useGame();
  const [market, setMarket] = useState<Record<Ticker, { price: number; history: number[] }>>(
    TICKERS.reduce((acc, t) => ({ ...acc, [t]: { price: 100 + Math.random() * 400, history: [] } }), {} as any)
  );

  useEffect(() => {
    const update = () => {
      setMarket(m => {
        const next = { ...m };
        TICKERS.forEach(t => {
          const prev = next[t].price;
          const price = Math.max(1, prev * (1 + (Math.random() - 0.5) / 20));
          const history = [...next[t].history, price].slice(-20);
          next[t] = { price, history };
        });
        return next;
      });
    };
    update();
    const id = setInterval(update, 30000);
    return () => clearInterval(id);
  }, []);

  return (
    <ScrollView contentContainerStyle={{ padding: 16 }}>
      <BackButton label="Back" />
      <Text style={{ fontSize: 22, fontWeight: '900' }}>Stocks</Text>
      {TICKERS.map(t => {
        const data = market[t];
        const history = data.history;
        const prev = history[history.length - 2] || data.price;
        const pct = ((data.price - prev) / prev) * 100;
        const holding = s.stockPortfolio[t] || 0;
        return (
          <View
            key={t}
            style={{
              backgroundColor: '#fff',
              borderRadius: 12,
              borderWidth: 1,
              borderColor: '#e5e7eb',
              padding: 12,
              marginBottom: 8,
            }}
          >
            <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
              <Text style={{ fontWeight: '800' }}>{t}</Text>
              <Text style={{ fontWeight: '800', color: pct >= 0 ? '#16a34a' : '#dc2626' }}>
                ${data.price.toFixed(2)} ({pct >= 0 ? '+' : ''}{pct.toFixed(2)}%)
              </Text>
            </View>
            <View style={{ flexDirection: 'row', height: 30, marginTop: 4 }}>
              {history.map((p, i) => {
                const max = Math.max(...history, data.price);
                const h = (p / max) * 30;
                return (
                  <View
                    key={i}
                    style={{ width: 4, height: h, backgroundColor: '#2563eb', marginRight: 1, alignSelf: 'flex-end' }}
                  />
                );
              })}
            </View>
            <Text style={{ marginTop: 8 }}>Holding: {holding.toFixed(2)}</Text>
          </View>
        );
      })}
    </ScrollView>
  );
}

