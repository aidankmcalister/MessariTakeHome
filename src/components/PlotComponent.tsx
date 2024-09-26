import { Plot } from "@observablehq/plot";

interface CryptoData {
  Date: string;
  Bitcoin: string;
  Etherum: string;
  Solana: string;
  USDC: string;
}

const PlotComponent = ({ data }: { data: CryptoData[] }) => {
  return <div>Plot {data.length}</div>;
};

export default PlotComponent;
