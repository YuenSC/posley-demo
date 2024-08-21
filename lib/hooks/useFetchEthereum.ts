import axios from "axios";
import queryString from "query-string";
import useSWR from "swr";
import { ProviderType } from "../ProviderType";

export const useFetchEthereum = (options: {
  address?: string;
  providerType?: ProviderType;
}) => {
  return useSWR<string, Error>(
    options.address ? [`/api/token/eth`, options] : null,
    async ([url]) =>
      (await axios.get(`${url}?${queryString.stringify(options)}`)).data
  );
};
