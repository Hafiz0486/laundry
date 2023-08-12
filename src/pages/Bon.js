// Koneksi
import { Link } from "react-router-dom"

import supabase from '../config/supabaseClient'
import { useEffect, useState } from 'react'

// components
import Kartu from '../components/Kartu'

const pages = 'bon'

const Bon = () => {
  const [fetchError, setFetchError] = useState(null)
  const [tables, setTables] = useState(null)
  const [orderBy, setOrderBy] = useState('dibuat')

  const handleDelete = (id) => {
    setTables(prevTables => {
      return prevTables.filter(sm => sm.id !== id)
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
    <div className="page home">
      {fetchError && (<p>{fetchError}</p>)}
      {tables && (
        
        <div className="bon">

          <div className="order-by" >
            <p class="order-by">Order by:</p>
            <button onClick={() => setOrderBy('dibuat')}>Dibuat</button>
            <button onClick={() => setOrderBy('nama')}>Nama</button>
            <button onClick={() => setOrderBy('kg')}>Kg</button>
          </div>

          <div>
            <Link to={'/'+ pages +"/membuat"} className="create" pages={pages}>Mamebuat Baru</Link>
          </div>

          {/* <div>
            <Link className="create" 
            to={{
              pathname: ("/"+ pages +"/membuat"),
              state: pages,
              }}>
                Mamebuat Baru</Link>
          </div> */}

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

export default Bon
