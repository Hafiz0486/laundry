// Koneksi
import { Link } from "react-router-dom"

import supabase from '../config/supabaseClient'
import { useEffect, useState } from 'react'

// components
import Kartu from '../components/Kartu'

const pages = 'transaksi'

const Transaksi = () => {
  const [fetchError, setFetchError] = useState(null)
  const [tables, setTables] = useState(null)
  const [orderBy, setOrderBy] = useState('dibuat')

  const handleDelete = (id) => {
    setTables(prevTables => {
      return prevTables.filter(sm => sm.id !== id)
    })
  }

  // Mengambil data dari table transaksi
  useEffect(() => {
    const fetchTables = async () => {
      const { data, error } = await supabase
        .from(pages)
        .select()
        .order(orderBy, {ascending: false})
      
      if (error) {
        setFetchError('Could not fetch the bon')
        setTables(null)
      }
      if (data) {
        
        setTables(data)
        setFetchError(null)
      }
    }

    fetchTables()

  }, [orderBy])

  

  return (
    <div className="page">
      {fetchError && (<p>{fetchError}</p>)}
      {tables && (
        
        <div className="transaksi">

          <p>Order By</p>
          <div className="order-by-transaksi" >
            <button onClick={() => setOrderBy('dibuat')}>Dibuat</button>
            <button onClick={() => setOrderBy('nama')}>Nama</button>
            <button onClick={() => setOrderBy('kg')}>Kg</button>
          </div>

          <div className="tombol-membuat ">
            <Link to={"/transaksi/membuattransaksi"} className="membuat-bon" pages={pages}>Mamebuat Baru</Link>
          </div>

          <div className="laundry-grid">
            {tables.map(table => (
              <Kartu key={table.id} table={table} pages={pages} onDelete={handleDelete} />
            ))}
          </div>

        </div>
      )}
    </div>
  )
}

export default Transaksi
