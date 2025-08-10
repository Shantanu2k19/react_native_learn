// track the searched made by user 
import { Client, Databases, ID, Query } from 'react-native-appwrite';

const DATABASE_ID = process.env.EXPO_PUBLIC_APPWRITE_DB_ID!;
const COLLECTION_ID = process.env.EXPO_PUBLIC_APPWRITE_COLLECTION_ID!;
const ENDPOINT = process.env.EXPO_PUBLIC_APPWRITE_ENDPOINT!;
const projet_id = process.env.EXPO_PUBLIC_APPWRITE_PROJECT_ID!;

const client = new Client()
    .setEndpoint(ENDPOINT)
    .setProject(projet_id)

const database = new Databases(client);

export const updateSearchCount = async (query: string, movie: Movie) => {
    console.log('updateSearchCount called..')

    try {
        // First check if this movie already exists (regardless of search term)
        const existingMovieResult = await database.listDocuments(DATABASE_ID, COLLECTION_ID, [
            Query.equal('movie_id', movie.id)
        ])
        
        if(existingMovieResult.documents.length > 0) {
            // Movie already exists, just update the count
            const existingMovie = existingMovieResult.documents[0];
            await database.updateDocument(
                DATABASE_ID,
                COLLECTION_ID,
                existingMovie.$id,
                {
                    count: existingMovie.count + 1,
                    searchTerm: query // Update with latest search term
                }
            )
        } else {
            // Movie doesn't exist, create new entry
            await database.createDocument(
                DATABASE_ID, 
                COLLECTION_ID, 
                ID.unique(),
                {
                    searchTerm: query, 
                    movie_id: movie.id, 
                    title: movie.title, 
                    count: 1, 
                    poster_url: `https://image.tmdb.org/t/p/w500${movie.poster_path}`
                }
            )
        }
    } catch (error ){
        console.log("Error: ", error)
        throw error; 
    }
}

export const getTrendingMovies = async(): Promise<TrendingMovie[] | undefined> => {
    try{
        const result = await database.listDocuments(DATABASE_ID, COLLECTION_ID, [
            Query.limit(20), // Get more documents to filter from
            Query.orderDesc('count')
        ])
        // console.log("results: ", result)
        
        // Remove duplicates based on movie_id and return top 5
        const uniqueMovies = result.documents.reduce((acc: any[], current) => {
            const exists = acc.find(item => item.movie_id === current.movie_id);
            if (!exists) {
                acc.push(current);
            }
            return acc;
        }, []);
        
        // Return only top 5 unique movies
        return uniqueMovies.slice(0, 5) as unknown as TrendingMovie[];

    } catch (error){
        console.log("Error: ", error)
        throw error;
    }
}