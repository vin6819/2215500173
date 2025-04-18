import { Link } from 'react-router-dom';

function Navbar() {
  return (
    <nav className="bg-blue-600 text-white p-4">
      <div className="container mx-auto flex justify-between items-center">
        <h1 className="text-xl font-bold">My App</h1>
        <ul className="flex space-x-4">
          <li>
            <Link to="/" className="hover:underline">
              Feed
            </Link>
          </li>
          <li>
            <Link to="/top-users" className="hover:underline">
              Top Users
            </Link>
          </li>
          <li>
            <Link to="/trending-posts" className="hover:underline">
              Trending Posts
            </Link>
          </li>
        </ul>
      </div>
    </nav>
  );
}

export default Navbar;