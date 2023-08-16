import { useParams, Link } from "react-router-dom"

import supabase from '../config/supabaseClient'
import { useEffect, useState } from 'react'
// components
import Kartu from "../components/Kartu"

const pages = 'bon'

const Bon = () => {
  const { id } = useParams()
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
          .eq('id_transaksi', id)

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
    
  }, [id])

  return (
    <div className="page">
      {fetchError && (<p>{fetchError}</p>)}
      {tables && (
        <div className="services">

          <div className="tombol-membuat">
            <Link to={"/laundry/transaksi"} className="membuat-pelayanan">Kembali</Link>
          </div> 

          <div className="tombol-membuat">
            <Link to={"/laundry/"+ pages +"/membuat"} pages={pages} className="membuat-pelayanan">Membuat Baru</Link>
          </div> 

          <div className="laundry-grid">
            {tables.map(table => (
              <Kartu key={table.id} table={table} pages={pages} id_transaksi={id} onDelete={handleDelete} />
            ))}
          </div>
          
        </div>
      )}
    </div>
  )
}

export default Bon
