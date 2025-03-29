'use client'
import { QueryClientProvider, QueryClient } from "@tanstack/react-query";

const NewsLayout = ({ children }: { children: React.ReactNode }) => {
    const client = new QueryClient()
  return <QueryClientProvider client={client}>
    {children}
  </QueryClientProvider>;
};

export default NewsLayout;
