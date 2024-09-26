interface CryptoData {
  Date: string;
  Bitcoin: string;
  Etherum: string;
  Solana: string;
  USDC: string;
}

const Plot = ({ data }: { data: CryptoData[] }) => {
  return <div>Plot {data.length}</div>;
};

export default Plot;
