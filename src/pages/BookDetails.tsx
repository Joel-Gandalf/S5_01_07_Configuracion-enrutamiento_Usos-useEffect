import { useParams, useNavigate } from 'react-router'

export const BookDetails = () => {
    const { bookId } = useParams()
    const navigate = useNavigate()

    const books = [
        { id: '1', title: 'React Essentials', author: 'Alex Johnson' },
        { id: '2', title: 'TypeScript in Practice', author: 'Maria Garcia' },
        { id: '3', title: 'Advanced Web Routing', author: 'Sam Wilson' }
    ]

    const book = books.find(book => book.id === bookId)

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