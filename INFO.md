# Aquí tienes un ejemplo con los datos en un archivo aparte, y BookList usando useEffect para "cargarlos" de forma simulada (como si fuera una llamada asíncrona, aunque sean datos locales):

```typescript
// data/books.ts
export type Book = {
  id: string
  title: string
  author: string
}

export const books: Book[] = [
  { id: '1', title: 'React Essentials', author: 'Alex Johnson' },
  { id: '2', title: 'TypeScript in Practice', author: 'Maria Garcia' },
  { id: '3', title: 'Advanced Web Routing', author: 'Sam Wilson' }
]
```

```typescript
// data/fetchBooks.ts
import { books, type Book } from './books'

export const fetchBooks = (): Promise<Book[]> => {
  return new Promise((resolve) => {
    setTimeout(() => resolve(books), 500) // simula latencia de red
  })
}
```

```typescript
// pages/BookList.tsx
import { useEffect, useState } from 'react'
import { Link } from 'react-router'
import { fetchBooks } from '../data/fetchBooks'
import type { Book } from '../data/books'

export const BookList = () => {
  const [books, setBooks] = useState<Book[]>([])
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    const loadBooks = async () => {
      const data = await fetchBooks()
      setBooks(data)
      setIsLoading(false)
    }

    loadBooks()
  }, [])

  if (isLoading) return <p>Carregant llibres...</p>

  return (
    <div>
      <h1>Llistat de Llibres</h1>
      <ul>
        {books.map(book => (
          <li key={book.id}>
            <Link to={`/books/${book.id}`}>{book.title}</Link>
          </li>
        ))}
      </ul>
    </div>
  )
}
```

Puntos clave de por qué está estructurado así:

fetchBooks devuelve una Promise, simulando el mismo contrato que tendría una llamada real a una API (fetch(...)), aunque por dentro solo lea el array local.
El useEffect con array de dependencias vacío ([]) se ejecuta una sola vez, al montar el componente — igual que harías con una llamada real a un endpoint.
El estado isLoading te permite mostrar un mensaje de carga, útil para cuando más adelante sustituyas fetchBooks por un fetch() real a una API — el resto del componente no necesitaría cambios.

Si quieres, podríamos aplicar el mismo patrón a BookDetails para que también "cargue" el libro concreto usando bookId con useEffect.


Aquí tienes el mismo patrón aplicado a BookDetails:

```typescript
// data/fetchBookById.ts
import { books, type Book } from './books'

export const fetchBookById = (bookId: string): Promise<Book | undefined> => {
  return new Promise((resolve) => {
    setTimeout(() => {
      const book = books.find(b => b.id === bookId)
      resolve(book)
    }, 500)
  })
}
```

```typescript
// pages/BookDetails.tsx
import { useEffect, useState } from 'react'
import { useParams, useNavigate } from 'react-router'
import { fetchBookById } from '../data/fetchBookById'
import type { Book } from '../data/books'

export const BookDetails = () => {
  const { bookId } = useParams()
  const navigate = useNavigate()
  const [book, setBook] = useState<Book | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    const loadBook = async () => {
      if (!bookId) return

      setIsLoading(true)
      const data = await fetchBookById(bookId)
      setBook(data ?? null)
      setIsLoading(false)
    }

    loadBook()
  }, [bookId])

  if (isLoading) return <p>Carregant llibre...</p>
  if (!book) return <div>Llibre no trobat</div>

  return (
    <div>
      <h1>{book.title}</h1>
      <p>Autor: {book.author}</p>
      <button onClick={() => navigate('/books')}>
        Tornar al llistat
      </button>
    </div>
  )
}
```

Detalle importante: aquí bookId sí va en el array de dependencias del useEffect. Esto es porque si el usuario navega de /books/1 a /books/2 (por ejemplo con dos Link dentro de la misma página de detalles, o con navigate), React Router no vuelve a montar el componente BookDetails — sigue siendo el mismo componente, solo cambia el parámetro. Sin bookId en las dependencias, el useEffect no se volvería a ejecutar y seguirías viendo los datos del libro anterior.

## Ahora los dos ejemplos con estados de carga, error y validación usando throw:

```typescript
// data/fetchBooks.ts
import { books, type Book } from './books'

export const fetchBooks = (): Promise<Book[]> => {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      if (!books || books.length === 0) {
        reject(new Error('No books available'))
        return
      }
      resolve(books)
    }, 500)
  })
}
typescript
// pages/BookList.tsx
import { useEffect, useState } from 'react'
import { Link } from 'react-router'
import { fetchBooks } from '../data/fetchBooks'
import type { Book } from '../data/books'

export const BookList = () => {
  const [books, setBooks] = useState<Book[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const loadBooks = async () => {
      try {
        setIsLoading(true)
        setError(null)
        const data = await fetchBooks()
        setBooks(data)
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Unknown error')
      } finally {
        setIsLoading(false)
      }
    }

    loadBooks()
  }, [])

  if (isLoading) return <p>Carregant llibres...</p>
  if (error) return <p>Error: {error}</p>

  return (
    <div>
      <h1>Llistat de Llibres</h1>
      <ul>
        {books.map(book => (
          <li key={book.id}>
            <Link to={`/books/${book.id}`}>{book.title}</Link>
          </li>
        ))}
      </ul>
    </div>
  )
}
typescript
// data/fetchBookById.ts
import { books, type Book } from './books'

export const fetchBookById = (bookId: string): Promise<Book> => {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      const book = books.find(b => b.id === bookId)

      if (!book) {
        reject(new Error(`Book with id ${bookId} not found`))
        return
      }

      resolve(book)
    }, 500)
  })
}
```

```typescript
// pages/BookDetails.tsx
import { useEffect, useState } from 'react'
import { useParams, useNavigate } from 'react-router'
import { fetchBookById } from '../data/fetchBookById'
import type { Book } from '../data/books'

export const BookDetails = () => {
  const { bookId } = useParams()
  const navigate = useNavigate()
  const [book, setBook] = useState<Book | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const loadBook = async () => {
      if (!bookId) {
        setError('No book id provided')
        setIsLoading(false)
        return
      }

      try {
        setIsLoading(true)
        setError(null)
        const data = await fetchBookById(bookId)
        setBook(data)
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Unknown error')
      } finally {
        setIsLoading(false)
      }
    }

    loadBook()
  }, [bookId])

  if (isLoading) return <p>Carregant llibre...</p>
  if (error) return <div>{error}</div>
  if (!book) return <div>Llibre no trobat</div>

  return (
    <div>
      <h1>{book.title}</h1>
      <p>Autor: {book.author}</p>
      <button onClick={() => navigate('/books')}>
        Tornar al llistat
      </button>
    </div>
  )
}
```

## `Aquí tienes el mismo BookDetails, pero sin usar Promise — los datos se leen de forma síncrona (directamente del array), y el useEffect solo se usa para disparar la lógica cuando bookId cambia, con try/catch simulando validación de errores igualmente:`

```typescript
// data/books.ts
export type Book = {
  id: string
  title: string
  author: string
}

export const books: Book[] = [
  { id: '1', title: 'React Essentials', author: 'Alex Johnson' },
  { id: '2', title: 'TypeScript in Practice', author: 'Maria Garcia' },
  { id: '3', title: 'Advanced Web Routing', author: 'Sam Wilson' }
]
```

```typescript
// data/getBookById.ts
import { books, type Book } from './books'

export const getBookById = (bookId: string): Book => {
  const book = books.find(b => b.id === bookId)

  if (!book) {
    throw new Error(`Book with id ${bookId} not found`)
  }

  return book
}
```

```typescript
// pages/BookDetails.tsx
import { useEffect, useState } from 'react'
import { useParams, useNavigate } from 'react-router'
import { getBookById } from '../data/getBookById'
import type { Book } from '../data/books'

export const BookDetails = () => {
  const { bookId } = useParams()
  const navigate = useNavigate()
  const [book, setBook] = useState<Book | null>(null)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    if (!bookId) {
      setError('No book id provided')
      setBook(null)
      return
    }

    try {
      const data = getBookById(bookId)
      setBook(data)
      setError(null)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Unknown error')
      setBook(null)
    }
  }, [bookId])

  if (error) return <div>{error}</div>
  if (!book) return <p>Carregant llibre...</p>

  return (
    <div>
      <h1>{book.title}</h1>
      <p>Autor: {book.author}</p>
      <button onClick={() => navigate('/books')}>
        Tornar al llistat
      </button>
    </div>
  )
}
```

Por qué no tiene mucho sentido en la práctica (como bien intuyes):

getBookById es una función completamente síncrona — se ejecuta al instante, sin esperar nada. Podrías llamarla directamente en el cuerpo del componente, sin useEffect ni useState para book:

```typescript
export const BookDetails = () => {
  const { bookId } = useParams()
  const navigate = useNavigate()

  if (!bookId) return <div>No book id provided</div>

  try {
    const book = getBookById(bookId)
    return (
      <div>
        <h1>{book.title}</h1>
        <p>Autor: {book.author}</p>
        <button onClick={() => navigate('/books')}>Tornar al llistat</button>
      </div>
    )
  } catch {
    return <div>Llibre no trobat</div>
  }
}
```

Este segundo enfoque es más simple y más correcto para datos síncronos: nada de useEffect, nada de estado, nada de re-render extra. useEffect solo aporta valor real cuando necesitas sincronizar con algo externo y asíncrono (una API, un timer, una suscripción) — que es justo el caso que viste en los ejemplos anteriores con Promise.


```bash
npm install -D vitest @testing-library/react @testing-library/jest-dom @testing-library/user-event jsdom
```

**Configura `vite.config.ts`:**
```typescript
import { defineConfig } from 'vitest/config';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  test: {
    globals: true,
    environment: 'jsdom',
    setupFiles: './src/setupTests.ts',
  },
});
```

**Crea `src/setupTests.ts`:**
```typescript
import '@testing-library/jest-dom';
```

**Actualiza `package.json`:**
```json
{
  "scripts": {
    "test": "vitest",
    "test:ui": "vitest --ui",
    "test:coverage": "vitest --coverage"
  }
}
```

```bash
npm install -D @vitest/coverage-v8
```

tailwindcss.com/docs/installation/using-vite