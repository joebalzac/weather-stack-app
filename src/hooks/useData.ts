import { AxiosRequestConfig, CanceledError } from "axios";
import { useEffect, useState } from "react";
import apiClient from "../services/api-client";

const useData = <T>(
  endpoint: string,
  requestConfig?: AxiosRequestConfig,
  deps?: any[]
) => {
  const [data, setData] = useState<T>();
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setLoading] = useState(false);

  useEffect(
    () => {
      
      const controller = new AbortController();
      const fetchData = async () => {
        setLoading(true);
        try {
          const response = await apiClient.get<T>(endpoint, {
            signal: controller.signal,
            ...requestConfig,
          });
          setData(response.data);
        } catch (err: unknown) {
          if (err instanceof CanceledError) return;
          setError(
            err instanceof Error ? err.message : "An unknown error occurred"
          );
        } finally {
          setLoading(false);
        }
      };
      fetchData();
      return () => controller.abort();
    },
    deps ? [...deps] : []
  );

  return { data, error, isLoading };
};

export default useData;
