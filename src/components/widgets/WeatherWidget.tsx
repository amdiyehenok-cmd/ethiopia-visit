"use client";

import { useWeather } from "@/hooks/useWeather";

function iconUrl(code: string) {
  return `https://openweathermap.org/img/wn/${code}@2x.png`;
}

export function WeatherWidget() {
  const { data, isLoading, isError } = useWeather();

  if (isLoading) {
    return (
      <div className="h-64 animate-pulse rounded-2xl border border-white/10 bg-white/5" />
    );
  }

  if (isError || !data) {
    return (
      <div className="rounded-2xl border border-white/10 bg-white/5 p-6 text-sm text-ivory/60">
        Weather unavailable.
      </div>
    );
  }

  return (
    <div className="rounded-2xl border border-white/10 bg-gradient-to-br from-ethiopia-green/20 to-dark-2/90 p-6 backdrop-blur-xl">
      <div className="flex items-start justify-between gap-4">
        <div>
          <p className="text-xs uppercase tracking-widest text-gold-primary/90">
            {data.city}
          </p>
          <p className="mt-1 font-display text-5xl text-ivory">{data.temp}°</p>
          <p className="text-sm capitalize text-ivory/70">{data.description}</p>
          <p className="mt-2 text-xs text-ivory/50">
            Feels {data.feelsLike}° · Humidity {data.humidity}% · Wind {data.wind} m/s
          </p>
        </div>
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src={iconUrl(data.icon)} alt="" width={80} height={80} className="opacity-90" />
      </div>
      {data.forecast?.length > 0 && (
        <div className="mt-6 grid grid-cols-5 gap-2 border-t border-white/10 pt-4">
          {data.forecast.map((f) => (
            <div
              key={f.date}
              className="rounded-xl border border-white/5 bg-white/5 px-2 py-2 text-center text-[10px] text-ivory/70"
            >
              <p className="truncate">{f.date}</p>
              <p className="mt-1 text-gold-light">
                {f.tempMax}° / {f.tempMin}°
              </p>
              <p className="mt-1 capitalize text-ivory/50">{f.description}</p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
