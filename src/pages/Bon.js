import { useEffect, useState } from "react"
import { useParams, useNavigate } from 'react-router-dom'
import supabase from "../config/supabaseClient"
import { Link } from "react-router-dom"

import KartuBon from "../components/KartuBon"

const Bon = () => {
  const { id } = useParams();

  
  const [fetchError, setFetchError] = useState(null)
  const [tables, setTables] = useState(null)

  const handleDelete = (id) => {
    setTables(prevTables => {
      return prevTables.filter(sm => sm.id !== id)
    })
  }

  useEffect(() => {
    const fetchTables = async () => {
      const { data, error } = await supabase
        .from('bon')
        .select('id_transaksi')
        .eq('id_transaksi', id); // Filter berdasarkan ID transaksi

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

  }, [id]) 

  return(
    <div className="page">
      {fetchError && (<p>{fetchError}</p>)}
      {tables && (
        <div className="services">

        <p>Test ID Transaksi: {id}</p>

          <div className="laundry-grid">
            {tables.map(table => (
              <KartuBon key={table.id_transaksi} table={table} onDelete={handleDelete} />
            ))}
          </div>
          
        </div>
      )}
    </div>
  )
}

export default Bon