import { BrowserRouter, Routes, Route, Link } from "react-router-dom"

// pages
import Home from "./pages/Home"
import Bon from "./pages/Bon"
import Pelayanan from "./pages/Pelayanan"
import Memperbarui from "./pages/Memperbarui"
import Membuat from "./pages/Membuat"
import Test from "./pages/Test"
import Transaksi from "./pages/Transaksi"

function App() {
  return (
    <BrowserRouter>
      <nav>
        <h1>Kamal Laundry</h1>
        <Link to="/laundry">Home</Link>
        <Link to="/bon">Bon</Link>
        <Link to="/pelayanan">Pelayanan</Link>
        <Link to="/test">Test</Link>
        <Link to="/transaksi">Transaksi</Link>
      </nav> 
      <Routes>
        <Route path="/laundry" element={<Home />} />
        <Route path="/bon" element={<Bon />} />
        <Route path="/pelayanan" element={<Pelayanan />} />
        <Route path="/test" element={<Test />} />
        <Route path="/transaksi" element={<Transaksi />} />

        <Route path="/:pages/membuat" element={<Membuat />} />
        <Route path="/:pages/memperbarui-:id" element={<Memperbarui />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
