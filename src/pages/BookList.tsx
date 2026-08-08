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
  
  const handleSearch = (e: SubmitEvent) => {
    e.preventDefault()
    setSearchParams({ search: searchTerm })
  }
  
  const handleCategoryChange = (e: ChangeEvent<HTMLSelectElement>) => {
    setSearchParams({ category: e.target.value })
  }
  
  const filteredBooks = books.filter(book => {
    const matchesSearch = searchTerm 
      ? book.title.toLowerCase().includes(searchTerm.toLowerCase())
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