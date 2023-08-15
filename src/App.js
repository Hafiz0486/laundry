import { BrowserRouter, Routes, Route, Link } from "react-router-dom"

// pages
import Home from "./pages/Home"
import Bon from "./pages/Bon"
import Pelayanan from "./pages/Pelayanan"
import Memperbarui from "./pages/Memperbarui"
import Membuat from "./pages/Membuat"
import Test from "./pages/Test"
import Transaksi from "./pages/Transaksi"
import MembuatTransaksi from "./pages/MembuatTransaksi"

function App() {
  return (
    <BrowserRouter>
      <nav>
        <h1>Kamal Laundry</h1>
        <Link to="/laundry">Home</Link>
        <Link to="/laundry/bon">Bon</Link>
        <Link to="/laundry/pelayanan">Pelayanan</Link>
        <Link to="/laundry/test">Test</Link>
        <Link to="/laundry/transaksi">Transaksi</Link>
      </nav> 
      <Routes>
        <Route path="/laundry" element={<Home />} />
        <Route path="/laundry/bon" element={<Bon />} />
        <Route path="/laundry/pelayanan" element={<Pelayanan />} />
        <Route path="/laundry/test" element={<Test />} />
        <Route path="/laundry/transaksi" element={<Transaksi />} />

        <Route path="/laundry/:pages/membuattransaksi" element={<MembuatTransaksi />} />
        <Route path="/laundry/:pages/membuat" element={<Membuat />} />
        <Route path="/laundry/:pages/memperbarui-:id" element={<Memperbarui />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
