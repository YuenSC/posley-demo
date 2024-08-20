import axios from "axios";
import queryString from "query-string";
import useSWR from "swr";

export const useFetchUSDC = (address?: string) => {
  return useSWR<string, Error>(
    address ? [`/api/token/usdc?${queryString.stringify({ address })}`] : null,
    async ([url]) => (await axios.get(url)).data
  );
};
