"use client";

import React, { PropsWithChildren } from "react";
import { SWRConfig } from "swr";

const StoreProvider = ({ children }: PropsWithChildren) => {
  return (
    <SWRConfig
      value={{
        revalidateOnFocus: false,
        revalidateOnReconnect: false,
      }}
    >
      {children}
    </SWRConfig>
  );
};

export default StoreProvider;
