// track the searched made by user 
import { Client, Databases, ID, Query } from 'react-native-appwrite';

const DATABASE_ID = process.env.EXPO_PUBLIC_APPWRITE_DB_ID || "";
const COLLECTION_ID = process.env.EXPO_PUBLIC_APPWRITE_COLLECTION_ID || "";
const ENDPOINT = process.env.EXPO_PUBLIC_APPWRITE_ENDPOINT || "";
const projet_id = process.env.EXPO_PUBLIC_APPWRITE_PROJECT_ID || "";

// Debug: Log environment variable status (remove in production)
console.log('Appwrite config loaded:', {
    hasDatabaseId: !!DATABASE_ID,
    hasCollectionId: !!COLLECTION_ID,
    hasEndpoint: !!ENDPOINT,
    hasProjectId: !!projet_id,
    endpoint: ENDPOINT || 'undefined'
});

// Validate environment variables
if (!DATABASE_ID || !COLLECTION_ID || !ENDPOINT || !projet_id) {
    console.error('Missing Appwrite environment variables:', {
        DATABASE_ID: !!DATABASE_ID,
        COLLECTION_ID: !!COLLECTION_ID,
        ENDPOINT: !!ENDPOINT,
        PROJECT_ID: !!projet_id
    });
}

const client = new Client()
    .setEndpoint(ENDPOINT)
    .setProject(projet_id)

const database = new Databases(client);

export const updateSearchCount = async (query: string, movie: Movie) => {
    console.log('updateSearchCount called..')

    // Validate environment variables before proceeding
    if (!DATABASE_ID || !COLLECTION_ID) {
        throw new Error('Appwrite configuration is incomplete');
    }

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

export const getTrendingMovies = async() => {
    // Validate environment variables before proceeding
    if (!DATABASE_ID || !COLLECTION_ID) {
        throw new Error('Appwrite configuration is incomplete');
    }

    try {
        const result = await database.listDocuments(DATABASE_ID, COLLECTION_ID, [
            Query.orderDesc('count'),
            Query.limit(10)
        ]);
        
        return result.documents;
    } catch (error) {
        console.error('Error fetching trending movies:', error);
        throw error;
    }
}