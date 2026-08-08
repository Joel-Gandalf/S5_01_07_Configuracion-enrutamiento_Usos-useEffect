import { useState } from 'react'
import { Link, useSearchParams } from 'react-router'
import type { SubmitEvent, ChangeEvent } from 'react'

const books = [
  { id: '1', title: 'React Essentials', category: 'Tecnologia' },
  { id: '2', title: 'TypeScript in Practice', category: 'Programació' },
  { id: '3', title: 'Advanced Web Routing', category: 'Web' },
  { id: '4', title: 'Modern CSS Design', category: 'Disseny' }
]

export const BookList = () => {
  const [searchParams, setSearchParams] = useSearchParams()
  const [searchTerm, setSearchTerm] = useState('')
  
  const categoryFilter = searchParams.get('category') || ''
  
  // Mirar abajo ---1---
  const activeSearch = searchParams.get('search') || ''
  
  // const handleSearch = (e: SubmitEvent) => {
  //   e.preventDefault()
  //   setSearchParams({ search: searchTerm })
  // }

  // Mirar abajo ---2---
  const handleSearch = (e: SubmitEvent) => {
    e.preventDefault()
    setSearchParams(prev => {
      const newParams = new URLSearchParams(prev)
      newParams.set('search', searchTerm)
      return newParams
    })
  }
  
  // const handleCategoryChange = (e: ChangeEvent<HTMLSelectElement>) => {
  //   setSearchParams({ category: e.target.value })
  // }

  // Mirar abajo ---2---
  const handleCategoryChange = (e: ChangeEvent<HTMLSelectElement>) => {
    setSearchParams(prev => {
      const newParams = new URLSearchParams(prev)
      newParams.set('category', e.target.value)
      return newParams
    })
  }
  
  const filteredBooks = books.filter(book => {
    // const matchesSearch = searchTerm 
    //   ? book.title.toLowerCase().includes(searchTerm.toLowerCase())
    //   : true

    // Mirar abajo ---1---
    const matchesSearch = activeSearch 
      ? book.title.toLowerCase().includes(activeSearch.toLowerCase())
      : true

      
    const matchesCategory = categoryFilter
      ? book.category === categoryFilter
      : true
      
    return matchesSearch && matchesCategory
  })
  
  return (
    <div>
      <h1>Llistat de Llibres</h1>
      
      <form onSubmit={handleSearch}>
        <input 
          type="text" 
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          placeholder="Cercar per títol..."
        />
        <button type="submit">Cercar</button>
      </form>
      
      <div>
        <label>Filtrar per categoria:</label>
        <select value={categoryFilter} onChange={handleCategoryChange}>
          <option value="">Totes</option>
          <option value="Tecnologia">Tecnologia</option>
          <option value="Programació">Programació</option>
          <option value="Web">Web</option>
          <option value="Disseny">Disseny</option>
        </select>
      </div>
      
      <ul>
        {filteredBooks.map(book => (
          <li key={book.id}>
            <Link to={`/books/${book.id}`}>
              {book.title} ({book.category})
            </Link>
          </li>
        ))}
      </ul>
    </div>
  )
}

// export const BookList = () => {
//     return (
//         <div>
//             <h1>Llistat de Llibres</h1>
//             <ul>
//                 {books.map(book => (
//                     <li key={book.id}>
//                         <Link to={`/books/${book.id}`}>
//                             {book.title}
//                         </Link>
//                     </li>
//                 ))}
//             </ul>
//         </div>
//     );
// }


// ---1---
// El filtro usa searchTerm (el useState), no lo que hay realmente en la URL. Esto significa que el dato que se ve en pantalla (los libros filtrados) no depende de la URL, aunque la URL diga que sí debería. Son dos copias del mismo valor que, en este ejercicio concreto, casualmente siempre coinciden — pero no hay ninguna garantía real de que lo hagan siempre.

// ¿Cuándo se nota el problema? Un caso muy concreto: si compartes o recargas la URL /books?search=react. Con el código original, al cargar la página de cero, searchTerm empieza vacío (useState('')), porque el useState no sabe leer la URL al iniciarse. El input se vería vacío y la lista NO estaría filtrada, aunque la URL diga claramente search=react. La URL "miente" — dice una cosa, pero la pantalla muestra otra.

// const activeSearch = searchParams.get('search') || ''

// const filteredBooks = books.filter(book => {
//   const matchesSearch = activeSearch  // ← ahora sí depende de la URL real
//     ? book.title.toLowerCase().includes(activeSearch.toLowerCase())
//     : true
//   ...
// })

// Ahora el filtrado siempre refleja lo que realmente hay en la URL, sin importar cómo se llegó a esa URL — ya sea escribiendo y dando submit, recargando la página, pegando un link compartido, o navegando con el botón "atrás" del navegador. La URL vuelve a ser la única fuente de verdad para lo que se muestra, que es justo la idea central de usar useSearchParams en primer lugar: que el estado de búsqueda viva en la URL (compartible, recargable, con historial), no solo en memoria.

// searchTerm se queda solo para una cosa: que el usuario pueda escribir libremente en el input sin que cada tecla dispare un cambio de URL — pero una vez confirmada la búsqueda (submit), quien manda para el filtrado real pasa a ser la URL, no la memoria local.

// Resumen corto: el cambio no aporta nada visible mientras usas la app normalmente clic a clic — aporta consistencia cuando la URL se recarga, se comparte, o se navega con atrás/adelante, que es precisamente el motivo de usar useSearchParams en vez de un simple useState para todo.


// ---2---
// handleSearch y handleCategoryChange ahora fusionan los parámetros existentes (new URLSearchParams(prev) + .set(...)) en vez de reemplazar todo el objeto, así category y search pueden coexistir en la URL a la vez.

// setSearchParams({ category: 'Web' })

// Esto no añade category a los parámetros existentes — reemplaza todos los query params por los que le pasas. Es decir, borra cualquier otro parámetro que hubiera antes.

// Por eso:
// Si primero buscas texto → setSearchParams({ search: 'react' }) → URL: /books?search=react.
// Luego cambias la categoría → setSearchParams({ category: 'Web' }) → esto sustituye por completo los params anteriores → URL: /books?category=Web — el search=react desaparece de la URL.

// ¿Cómo se arregla, para que ambos coexistan? Tienes que fusionar manualmente los parámetros existentes con el nuevo, en vez de reemplazar todo el objeto:

  // setSearchParams(prev => {
  //   const newParams = new URLSearchParams(prev)
  //   newParams.set('search', searchTerm)
  //   return newParams
  // })

// Aquí setSearchParams recibe una función en vez de un objeto — patrón parecido al updater function de useState (setState(prev => ...)). prev es el URLSearchParams actual; lo clonas con new URLSearchParams(prev), y sobre esa copia solo modificas la clave que te interesa con .set(...), dejando intactas las demás. Así, si ya había search=react y ahora cambias la categoría, el resultado sería /books?search=react&category=Web — ambos conviven.

// Así que resumiendo: no, la URL no debería perder un parámetro al fijar otro