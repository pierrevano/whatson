import { useState, useEffect } from "react";

function useFetchWithStatusCode(url) {
  const [data, setData] = useState(null);
  const [error, setError] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [statusCode, setStatusCode] = useState(null);

  useEffect(() => {
    if (!url) {
      setData(null);
      setError(null);
      setStatusCode(null);
      setIsLoading(false);
      return;
    }

    let ignore = false;

    const fetchData = async () => {
      if (!ignore) {
        setData(null);
        setError(null);
        setStatusCode(null);
        setIsLoading(true);
      }

      try {
        const response = await fetch(url);
        if (ignore) return;

        setStatusCode(response.status);

        if (!response.ok) {
          throw new Error("Network response was not ok");
        }

        const result = await response.json();
        if (ignore) return;

        setData(result);
        setError(null);
      } catch (error) {
        if (ignore) return;

        setError(error);
      } finally {
        if (!ignore) {
          setIsLoading(false);
        }
      }
    };

    fetchData();

    return () => {
      ignore = true;
    };
  }, [url]);

  return { data, error, isLoading, statusCode };
}

export default useFetchWithStatusCode;
