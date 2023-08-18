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
    <BrowserRouter basename="/laundry/">
      <nav>
        <h1>Kamal Laundry</h1>
        <Link to="">Home</Link>
        <Link to="konsumen">Konsumen</Link>
        <Link to="pelayanan">Pelayanan</Link>
        <Link to="transaksi">Transaksi</Link>
      </nav> 
      <Routes>
        <Route path="" element={<Home />} />
        <Route path="konsumen" element={<Konsumen />} />
        <Route path="pelayanan" element={<Pelayanan />} />
        <Route path="transaksi" element={<Transaksi />} />
        <Route path="transaksi-:id/bon" element={<Bon />} />
        
        <Route path="transaksi-:id_transaksi/bon/memperbarui-:id_bon" element={<Bon />} />

        <Route path=":pages/membuattransaksi" element={<MembuatTransaksi />} />
        <Route path=":pages/membuat" element={<Membuat />} />
        <Route path=":pages/memperbarui-:id" element={<Memperbarui />} />

      </Routes>
    </BrowserRouter>
  );
}

export default App;