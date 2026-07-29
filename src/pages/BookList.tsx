import { Link } from 'react-router'

const books = [
    { id: '1', title: 'React Essentials' },
    { id: '2', title: 'TypeScript in Practice' },
    { id: '3', title: 'Advanced Web Routing' }
]

export const BookList = () => {
    return (
        <div>
            <h1>Llistat de Llibres</h1>
            <ul>
                {books.map(book => (
                    <li key={book.id}>
                        <Link to={`/books/${book.id}`}>
                            {book.title}
                        </Link>
                    </li>
                ))}
            </ul>
        </div>
    );
}