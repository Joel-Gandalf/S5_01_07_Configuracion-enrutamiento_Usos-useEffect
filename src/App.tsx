import './App.css'
import { Routes, Route } from 'react-router'
import { Layout } from './components/Layout'
import { Home } from './pages/Home'
import { BookList } from './pages/BookList'
import { BookDetails } from './pages/BookDetails'
import { NotFound } from './pages/NotFound'

export const App = () => {

  return (
      <Routes>
        <Route element={<Layout />}>
          <Route path="/" element={<Home />} />
          <Route path="/books" element={<BookList />} />
          <Route path="/books/:bookId" element={<BookDetails />} />
          <Route path="*" element={<NotFound />} />
        </Route>
      </Routes>
  );
}
