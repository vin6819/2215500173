
import Navbar from './Navbar';
import './App.css';

import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Feed from './Feed';
import TopUsers from './TopUsers';
import TrendingPosts from './TrendingPosts';

function App() {
  return (
    <>
    <Navbar />
    <Router>
      <Routes>
        <Route path="/" element={<Feed />} />
        <Route path="/top-users" element={<TopUsers />} />
        <Route path="/trending-posts" element={<TrendingPosts />} />
      </Routes>
    </Router>
    </>
  );
}

export default App
