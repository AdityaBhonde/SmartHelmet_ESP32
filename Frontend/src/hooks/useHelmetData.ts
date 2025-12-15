import { useState, useEffect } from "react";

interface HelmetState {
  wear: string;
  hr: number | null;
  spo2: number | null;
  crashStatus: string;
  crashActivity: Array<{
    time: string;
    wear: string;
    hr: string;
    spo2: string;
    status: string;
  }>;
  logs: string[];
}

export const useHelmetData = (apiUrl: string) => {
  const [data, setData] = useState<HelmetState>({
    wear: "unknown",
    hr: null,
    spo2: null,
    crashStatus: "normal",
    crashActivity: [],
    logs: [],
  });

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch(apiUrl);
        const result = await response.json();
        setData(result);
      } catch (error) {
        console.error("Error fetching helmet data:", error);
      }
    };

    // Initial fetch
    fetchData();

    // Poll every second
    const interval = setInterval(fetchData, 1000);

    return () => clearInterval(interval);
  }, [apiUrl]);

  return data;
};
