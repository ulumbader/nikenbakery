interface ChartDataPoint {
  dateLabel: string;
  rawDate: string;
  views: number;
  waClicks: number;
}

interface AnalyticsChartProps {
  data: ChartDataPoint[];
}

export function AnalyticsChart({ data }: AnalyticsChartProps) {
  // Hitung nilai maksimum untuk skala proporsional
  const maxVal = Math.max(
    ...data.map((d) => Math.max(d.views, d.waClicks)),
    5 // Minimal skala 5 agar grafik tetap memiliki tinggi saat data masih 0
  );

  return (
    <div className="space-y-4">
      {/* Legend */}
      <div className="flex flex-wrap items-center justify-between gap-3 text-xs">
        <span className="font-heading font-black uppercase text-ink">
          Tren Aktivitas 14 Hari Terakhir
        </span>
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-1.5">
            <span className="w-3 h-3 rounded-[3px] bg-butter border border-ink" />
            <span className="font-bold text-ink">Kunjungan Produk (View)</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="w-3 h-3 rounded-[3px] bg-mint border border-ink" />
            <span className="font-bold text-ink">Klik WhatsApp</span>
          </div>
        </div>
      </div>

      {/* Bar Chart Container */}
      <div className="relative pt-6 pb-2 overflow-x-auto">
        <div className="min-w-[500px] flex items-end justify-between gap-2 h-44 border-b-3 border-ink px-2">
          {data.map((point) => {
            const viewHeightPercent = Math.round((point.views / maxVal) * 100);
            const waHeightPercent = Math.round((point.waClicks / maxVal) * 100);

            return (
              <div
                key={point.rawDate}
                className="flex-1 flex flex-col items-center justify-end h-full group relative"
              >
                {/* Tooltip Hover */}
                <div className="opacity-0 group-hover:opacity-100 transition-opacity absolute -top-10 z-10 bg-ink text-white text-[10px] py-1 px-2 rounded font-bold pointer-events-none whitespace-nowrap shadow-sm">
                  {point.dateLabel}: {point.views} views, {point.waClicks} klik WA
                </div>

                {/* Bars Pair */}
                <div className="w-full flex items-end justify-center gap-1 h-full">
                  {/* View Bar */}
                  <div
                    style={{ height: `${Math.max(viewHeightPercent, 4)}%` }}
                    className={`w-1/2 max-w-[14px] rounded-t-[3px] border border-ink transition-all ${
                      point.views > 0 ? "bg-butter" : "bg-butter/20 border-dashed"
                    }`}
                    title={`Views: ${point.views}`}
                  />
                  {/* WA Click Bar */}
                  <div
                    style={{ height: `${Math.max(waHeightPercent, 4)}%` }}
                    className={`w-1/2 max-w-[14px] rounded-t-[3px] border border-ink transition-all ${
                      point.waClicks > 0 ? "bg-mint" : "bg-mint/20 border-dashed"
                    }`}
                    title={`Klik WA: ${point.waClicks}`}
                  />
                </div>

                {/* X-Axis Date Label */}
                <span className="text-[10px] font-bold text-ink/70 mt-2 truncate">
                  {point.dateLabel}
                </span>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}

