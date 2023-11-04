import { Link, LoaderFunctionArgs, Outlet } from "react-router-dom";
import { StoreContextData } from './StoreProvider';

const loader = ({ query }: StoreContextData) => async ({ }: LoaderFunctionArgs) => {
  return query("SELECT * from cards", []);
}

function App() {
  return (
    <>
      <header className="navbar">
        <nav>
          <Link to="/">memothon</Link>
        </nav>
      </header>
      <main>
        <Outlet />
      </main>
    </>
  )
}

export { App, loader };
