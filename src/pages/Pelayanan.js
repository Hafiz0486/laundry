import { Link } from "react-router-dom"

import supabase from '../config/supabaseClient'
import { useEffect, useState } from 'react'

// components
import Card from "../components/Kartu"

const pages = 'pelayanan'

const Pelayanan = () => {
  const [fetchError, setFetchError] = useState(null)
  const [tables, setTables] = useState(null)

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

  }, [])

  return (
    <div className="page home">
      {fetchError && (<p>{fetchError}</p>)}
      {tables && (
        <div className="services">

          <navcs>
            <Link pages={pages} to={"/"+ pages +"/membuat"} className="create">Membuat Baru</Link>
          </navcs> 

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
