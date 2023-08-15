import { Link } from "react-router-dom"

import supabase from '../config/supabaseClient'
import { useEffect, useState } from 'react'

// components
import Card from "../components/Kartu"

const pages = 'pelayanan'

const Pelayanan = () => {
  const [fetchError, setFetchError] = useState(null)
  const [tables, setTables] = useState(null)
  const [orderBy, setOrderBy] = useState('dibuat')

  const handleDelete = (id) => {
    setTables(prevTable => {
      return prevTable.filter(sm => sm.id !== id)
    })
  }

  // Mengambil data dari table bon
  useEffect(() => {
    const fetchTables = async () => {
      const { data, error } = await supabase
        .from(pages)
        .select()
        .order(orderBy, {ascending: false})
      
      if (error) {
        setTables(null)
        setFetchError('Could not fetch the service')
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
        <div className="services">

          <div className="order-by" >
            <p class="order-by">Order by:</p>
            <button onClick={() => setOrderBy('dibuat')}>Dibuat</button>
            <button onClick={() => setOrderBy('nama')}>Nama</button>
            <button onClick={() => setOrderBy('kg')}>Kg</button>
          </div>

          <div className="tombol-membuat">
            <Link to={"/laundry/"+ pages +"/membuat"} pages={pages} className="membuat-pelayanan">Membuat Baru</Link>
          </div> 

          <div className="laundry-grid">
            {tables.map(table => (
              <Card key={table.id} table={table} pages={pages} onDelete={handleDelete} />
            ))}
          </div>
          
        </div>
      )}
    </div>
  )
}

export default Pelayanan
