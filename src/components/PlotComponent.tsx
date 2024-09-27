import * as Plot from "@observablehq/plot";
import * as d3 from "d3";
import { useEffect, useRef, useState } from "react";

const parseValue = (value: string | number) =>
  typeof value === "string" ? parseFloat(value.replace(/,/g, "")) : value;

const PlotComponent = () => {
  const containerRef = useRef<HTMLDivElement>(null);
  const [data, setData] = useState<any[]>();
  const [cryptoStats, setCryptoStats] = useState<
    Array<{ name: string; value: string; color: string }>
  >([]);

  useEffect(() => {
    d3.csv("/cryptoData.csv", d3.autoType).then(setData);
  }, []);

  useEffect(() => {
    if (data === undefined) return;

    const plot = Plot.plot({
      marginLeft: 100,
      width: 1000,
      x: {
        tickFormat: (d) => {
          const date = new Date(d);
          return (
            date.toLocaleString("default", { month: "short" }) +
            "-" +
            date.getFullYear()
          );
        },
        ticks: "month",
      },
      y: {
        domain: d3
          .scaleLinear()
          .domain([
            0,
            d3.max(data, (d) =>
              Math.max(
                parseFloat(d.Etherum.replace(/,/g, "")),
                parseFloat(d.Solana),
                parseFloat(d.USDC),
                parseFloat(d.Bitcoin.replace(/,/g, ""))
              )
            ),
          ])
          .domain()
          .map((v, i) => (i === 1 ? v + 5e5 : v)),
        tickFormat: (value) => {
          const formatter = new Intl.NumberFormat("en-US", {
            style: "currency",
            currency: "USD",
            notation: "compact",
            maximumFractionDigits: value < 1e6 ? 0 : 1,
          });
          return formatter.format(value);
        },
        grid: true,
        label: "DEX Volume",
        labelAnchor: "center",
        labelOffset: 60,
      },

      marks: [
        Plot.areaY(data, {
          x: "Date",
          y: (d) => parseValue(d.Etherum),
          fill: "#1973EB",
          title: "Etherum",
        }),
        Plot.areaY(data, {
          x: "Date",
          y: (d) => parseValue(d.Solana),
          fill: "#B142EA",
          title: "Solana",
        }),
        Plot.areaY(data, {
          x: "Date",
          y: (d) => parseValue(d.USDC),
          fill: "#14C7F7",
          title: "USDC",
        }),
        Plot.areaY(data, {
          x: "Date",
          y: (d) => parseValue(d.Bitcoin),
          fill: "#841AE4",
          title: "Bitcoin",
        }),
        Plot.ruleY([0]),
      ],
    });

    const totalVolumes = {
      Ethereum: d3.sum(data, (d) => parseValue(d.Etherum)),
      Solana: d3.sum(data, (d) => parseValue(d.Solana)),
      USDC: d3.sum(data, (d) => parseValue(d.USDC)),
      Bitcoin: d3.sum(data, (d) => parseValue(d.Bitcoin)),
    };

    const cryptoColors = {
      Ethereum: "#1973EB",
      Solana: "#B142EA",
      USDC: "#14C7F7",
      Bitcoin: "#841AE4",
    };

    const stats = Object.entries(totalVolumes).map(([name, total]) => ({
      name,
      value: `$${total.toLocaleString()}`,
      color: cryptoColors[name as keyof typeof cryptoColors],
    }));

    setCryptoStats(stats);
    containerRef.current?.append(plot);
    return () => plot.remove();
  }, [data]);

  return (
    <div className="flex flex-row space-x-4 items-center justify-center">
      <div ref={containerRef} />
      <ul className="space-y-2">
        <h1 className="text-xl w-full text-center font-semibold border-b">
          Average Volume
        </h1>
        {cryptoStats.map((stat, index) => (
          <li key={index} className="flex flex-row space-x-2 items-center">
            <div
              className="h-10 w-6 rounded-full"
              style={{ backgroundColor: stat.color }}
            />
            <div className="flex flex-col w-full">
              <div className="flex text-lg flex-row justify-between space-x-10">
                <h1 className="font-semibold">{stat.name}</h1>
                <p>
                  {(() => {
                    const formatter = new Intl.NumberFormat("en-US", {
                      style: "currency",
                      currency: "USD",
                      notation: "compact",
                      maximumFractionDigits: 1,
                    });
                    return formatter.format(
                      parseFloat(stat.value.replace(/[^0-9.-]+/g, ""))
                    );
                  })()}
                </p>
              </div>
              <div className="flex flex-row justify-between space-x-4 text-xs">
                <p>QoQ Change</p>
                <p>#%</p>
              </div>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default PlotComponent;
