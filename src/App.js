import { BrowserRouter, HashRouter, Routes, Route, Link } from "react-router-dom"

// pages
import Home from "./pages/Home"

import Konsumen from "./pages/Konsumen"
import Pelayanan from "./pages/Pelayanan"
import Transaksi from "./pages/Transaksi"

import Bon from "./pages/Bon"

import Memperbarui from "./pages/Memperbarui"
import Membuat from "./pages/Membuat"

import MembuatTransaksi from "./pages/MembuatTransaksi"

function App() {
  return (
    <BrowserRouter>
      <nav>
        <h1>Kamal Laundry</h1>
        <Link to="/laundry">Home</Link>
        <Link to="/laundry/konsumen">Konsumen</Link>
        <Link to="/laundry/pelayanan">Pelayanan</Link>
        <Link to="/laundry/transaksi">Transaksi</Link>
      </nav> 
      <Routes>
        <Route path="/laundry" element={<Home />} />
        <Route path="/laundry/konsumen" element={<Konsumen />} />
        <Route path="/laundry/pelayanan" element={<Pelayanan />} />
        <Route path="/laundry/transaksi" element={<Transaksi />} />
        <Route path="/laundry/transaksi-:id/bon" element={<Bon />} />
        
        <Route path="/laundry/transaksi-:id_transaksi/bon/memperbarui-:id_bon" element={<Bon />} />

        <Route path="/laundry/:pages/membuattransaksi" element={<MembuatTransaksi />} />
        <Route path="/laundry/:pages/membuat" element={<Membuat />} />
        <Route path="/laundry/:pages/memperbarui-:id" element={<Memperbarui />} />

      </Routes>
    </BrowserRouter>
  );
}

export default App;