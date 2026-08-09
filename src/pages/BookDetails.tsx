import { useParams, useNavigate } from 'react-router'

import { useState, useEffect } from 'react';

type Book = {
    name: string
    height: number
    weight: number
    sprites: {
        front_default: string
    }
}

export const BookDetails = () => {
    const { bookId } = useParams()
    const navigate = useNavigate()

    const [book, setBook] = useState<Book | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        let ignore = false;

        const fetchBookData = async () => {
            setLoading(true);
            setError(null);

            try {
                const response = await fetch(
                    `https://pokeapi.co/api/v2/pokemon/${bookId}`
                );

                if (!response.ok) throw new Error(`Llibre no trobat (${response.status})`);

                const data = await response.json();
                if (!ignore) setBook(data);
            } catch (err) {
                if (!ignore) setError(err instanceof Error ? err.message : 'Error desconegut');
            } finally {
                if (!ignore) setLoading(false);
            }
        };

        fetchBookData();

        return () => {
            ignore = true;
        };
    }, [bookId]);

    if (loading) return <p>Carregant...</p>;
    if (error) return <p>Error: {error}</p>;
    if (!book) return <p>Llibre no trobat</p>;

    return (
        <div>
            <h1>{book.name}</h1>
            <img src={book.sprites.front_default} alt={book.name} />
            <p>Alçada: {book.height}</p>
            <p>Pes: {book.weight}</p>
            <button onClick={() => navigate('/books')}>
                Tornar al llistat
            </button>
        </div>
    );


    // const books = [
    //     { id: '1', title: 'React Essentials', author: 'Alex Johnson' },
    //     { id: '2', title: 'TypeScript in Practice', author: 'Maria Garcia' },
    //     { id: '3', title: 'Advanced Web Routing', author: 'Sam Wilson' }
    // ]

    // const book = books.find(book => book.id === bookId)

    // if (!book) return <div>Llibre no trobat</div>

    // return (
    //     <div>
    //         <h1>{book.title}</h1>
    //         <p>Autor: {book.author}</p>
    //         <button onClick={() => navigate('/books')}>
    //             Tornar al llistat
    //         </button>
    //     </div>
    // )
}

// Uniendo todo, el flujo completo paso a paso
// El componente BookDetails se monta (o bookId cambia). React ejecuta el useEffect.
// Se crea ignore = false.
// Se llama a fetchBookData() — como es async, se ejecuta pero no bloquea nada más.
// Dentro: setLoading(true) y setError(null) — preparas la UI para mostrar "Carregant...".
// await fetch(...) — se lanza la petición HTTP, la función se "pausa" aquí (sin bloquear el resto de la app) hasta tener respuesta.
// Si la respuesta llega y response.ok es false (ej. 404) → throw new Error(...) → salta al catch.
// Si todo va bien → await response.json() parsea los datos → setBook(data) (si ignore sigue en false).
// Pase lo que pase, finally ejecuta setLoading(false) (si ignore sigue en false).
// Cada set... (setBook, setLoading, setError) provoca que React vuelva a renderizar el componente con los nuevos valores, y por eso tus if (loading) return ... / if (error) return ... / renderizado final van cambiando lo que se ve en pantalla según el estado actual.


// EL PATRÓN IGNORE — por qué existe
// Este es el punto más sutil, y muy típico en peticiones asíncronas dentro de useEffect. El problema que resuelve se llama condición de carrera (race condition).

// Imagina esto:

// --El usuario está en /books/1. Se dispara el useEffect, empieza el fetch a la API pidiendo el Pokémon 1. Esto tarda, digamos, 2 segundos.
// --Antes de que termine, el usuario navega rápidamente a /books/2. Como bookId cambió, React vuelve a ejecutar el useEffect — se dispara un segundo fetch, pidiendo el Pokémon 2. Este tarda solo 0.5 segundos y termina antes que el primero.
// --El segundo fetch termina primero → setBook(pokemon2) — correcto, se muestra el Pokémon 2.
// --Pero luego, el primer fetch (el más lento) finalmente termina → setBook(pokemon1) — esto sobreescribe el estado con datos viejos, aunque el usuario ya está viendo (y quiere ver) la página del libro 2.

// Resultado sin protección: el usuario ve momentáneamente los datos equivocados, aunque esté en la URL correcta.