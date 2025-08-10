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
        const result = await database.listDocuments(DATABASE_ID, COLLECTION_ID, [
            Query.equal('searchTerm', query)
        ])
        console.log("results: ", result)

        if(result.documents.length>0){
            const existingMovie = result.documents[0];

            await database.updateDocument(
                DATABASE_ID,
                COLLECTION_ID,
                existingMovie.$id,
                {
                    count: existingMovie.count +1 
                }
            )
        } else {
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
            Query.limit(5),
            Query.orderDesc('count')
        ])
        console.log("results: ", result)
        return result.documents as unknown as TrendingMovie[];

    } catch (error){
        console.log("Error: ", error)
        throw error;
    }
}