import { useState } from "react";
import { toast } from "sonner";

const useFetch = (cb) => {
  const [data, setData] = useState(undefined);
  const [loading, setLoading] = useState(null);
  const [error, setError] = useState(null);

  const fn = async (...args) => {
    setLoading(true);
    setError(null);

    try {
      const response = await cb(...args);
      setData(response);
      setError(null);
      return response;
    } catch (error) {
      setError(error);
     if (error.message && !error.message.includes("successfully")) {
        toast.error(error.message);
      }
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const reset = () => {
    setData(undefined);
    setLoading(false);
    setError(null);
  };

  return { data, loading, error, fn, setData, reset};
};

export default useFetch;