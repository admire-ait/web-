"use client";

import dynamic from "next/dynamic";

const WakaTimeStatsClient = dynamic(
  () =>
    import("./wakatime-stats-client").then((mod) => ({
      default: mod.WakaTimeStatsClient,
    })),
  {
    ssr: false,
    loading: () => (
      <div className="bg-gradient-to-r from-purple-500 to-pink-500 py-6">
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-center">
            <div className="text-black text-sm font-medium">
              ⚡ 加载编程统计中...
            </div>
          </div>
        </div>
      </div>
    ),
  }
);

export function WakaTimeStats() {
  return <WakaTimeStatsClient />;
}
