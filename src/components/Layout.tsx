import { Outlet, NavLink } from 'react-router'
import { TabCounter } from './TabCounter'

export const Layout = () => {
  const navStyle = ({ isActive }: { isActive: boolean }) => ({
    fontWeight: isActive ? 'bold' : 'normal'
  })
  
  return (
    <div>
      <header>
        <nav>
          <NavLink to="/" style={navStyle}>Inici</NavLink>
          <NavLink to="/books" style={navStyle}>Llibres</NavLink>
        </nav>
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