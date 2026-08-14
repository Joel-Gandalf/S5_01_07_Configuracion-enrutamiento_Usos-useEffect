import { Outlet, NavLink } from 'react-router'
import { TabCounter } from './TabCounter'
import { useTheme } from '../hooks/useTheme'

export const Layout = () => {

  const { theme, toggleTheme } = useTheme();

  const navStyle = ({ isActive }: { isActive: boolean }) => ({
    fontWeight: isActive ? 'bold' : 'normal',
    color: theme === 'light' ? '#000' : '#fff'
  })

  
  
  return (
    <div>
      <header style={{
        background: theme === 'light' ? '#f5f5f5' : '#333',
        color: theme === 'light' ? '#000' : '#fff'
      }}>
        <nav>
          <NavLink to="/" style={navStyle}>Inici</NavLink>
          <NavLink to="/books" style={navStyle}>Llibres</NavLink>
        </nav>
        <button onClick={toggleTheme}>
          {theme === 'light' ? '🌙 Fosc' : '☀️ Llum'}
        </button>
      </header>
      
      <main>
        <TabCounter />
        <Outlet />
      </main>
      
      <footer>
        <p>© 2025 Biblioteca Digital</p>
      </footer>
    </div>
  )
}