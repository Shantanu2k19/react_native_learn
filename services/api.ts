export const TMDB_CONFIG = {
    BASE_URL: "https://api.themoviedb.org/3",
    API_KEY: process.env.EXPO_PUBLIC_MOVIE_API_KEY,
    headers: {
        accept: 'application/json',
        Authorization: `Bearer ${process.env.EXPO_PUBLIC_MOVIE_API_KEY}`
    }
}

export const fetchPopularMovies = async({ query }:{ query: string}) => {
    const endpoint = query 
    ? `${TMDB_CONFIG.BASE_URL}/search/movie?query=${encodeURIComponent(query)}`
    : `${TMDB_CONFIG.BASE_URL}/discover/movie?sort_by=popularity.desc`;
    
    console.log(endpoint)
    const response = await fetch(endpoint, {
        method: 'GET',
        headers: TMDB_CONFIG.headers,
    });

    if (!response.ok) {
        // @ts-ignore
        console.log('error returned')
        throw new Error(`Error fetching movies: ${response.statusText}`);
    }
    
    const data = await response.json();
    console.log('data returned')
    return data.results;
}

export const fetchMovieDetails = async(movieId: string): Promise<MovieDetails> => {
    console.log('fetchMovieDetails called...')
    try{
        const response = await fetch(`${TMDB_CONFIG.BASE_URL}/movie/${movieId}?api_key=${TMDB_CONFIG.API_KEY}`,{
            method: 'GET',
            headers: TMDB_CONFIG.headers,
        });

        if (!response.ok) throw new Error("Failed t fetch movie details");
        
        const data = await response.json();
        console.log('fetchMovieDetails data fetched: ', data)

        return data;
    } catch(error){
        console.log("Error: ", error)
        throw error;
    }
}