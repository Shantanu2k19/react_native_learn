//fetchMovies, 
// fetchMovieDetails,
import { useEffect, useState } from 'react';

const usefetch = <T>(fetchFunction: () => Promise<T>, autoFetch = true) => {
    const [data, setData] = useState<T | null>(null);
    const [loading, setLoading] = useState<boolean>(false);
    const [error, setError] = useState<string | null>(null);

    const fetchData = async () => {
        try {
            setLoading(true);
            setError(null);
            
            // Validate fetchFunction
            if (typeof fetchFunction !== 'function') {
                throw new Error('Invalid fetch function provided');
            }
            
            const result = await fetchFunction();
            setData(result);
        } catch (err) {
            const errorMessage = err instanceof Error ? err.message : 'An unexpected error occurred';
            console.error('useFetch error:', err);
            setError(errorMessage);
        } finally {
            setLoading(false);
        }
    };

    const reset = () => {
        setData(null);
        setLoading(false);
        setError(null);
    }

    useEffect(() => {
        if (autoFetch) {
            fetchData();
        }
    }, []);

    return { data, loading, error, refetch: fetchData, reset };
}

export default usefetch;