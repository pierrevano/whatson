import { useState, useEffect } from "react";

function useFetchWithStatusCode(url) {
  const [data, setData] = useState(null);
  const [error, setError] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [statusCode, setStatusCode] = useState(null);

  useEffect(() => {
    if (!url) return;

    const fetchData = async () => {
      setIsLoading(true);

      try {
        const response = await fetch(url);
        setStatusCode(response.status);

        if (!response.ok) {
          throw new Error("Network response was not ok");
        }

        const result = await response.json();
        setData(result);
      } catch (error) {
        setError(error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, [url]);

  return { data, error, isLoading, statusCode };
}

export default useFetchWithStatusCode;
