import { useEffect, useState } from "react";
import apiClient from "../services/api-client";
import { AxiosRequestConfig, CanceledError } from "axios";

interface FetchResponse<T> {
  results: T[];
}

const useData = <T>(
  endpoint: string,
  requestConfig?: AxiosRequestConfig,
  deps?: any[]
) => {
  const [data, setData] = useState<T[]>([]);
  const [error, setError] = useState("");
  const [isLoading, setLoading] = useState(false);

  useEffect(
    () => {
      const controller = new AbortController();
      const fetchData = async () => {
        setLoading(true);
        try {
          const response = await apiClient.get<FetchResponse<T>>(endpoint, {
            signal: controller.signal,
            ...requestConfig,
          });
          setData(response.data.results);
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

  return { data, error: { message: error }, isLoading };
};

export default useData;
