import axios from "axios";
import queryString from "query-string";
import useSWR from "swr";

export const useFetchUSDT = (address?: string) => {
  return useSWR<string, Error>(
    address ? [`/api/token/usdt?${queryString.stringify({ address })}`] : null,
    async ([url]) => (await axios.get(url)).data
  );
};
