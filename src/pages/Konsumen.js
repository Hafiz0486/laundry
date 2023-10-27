import { Link } from "react-router-dom"

import supabase from '../config/supabaseClient'
import { useEffect, useState } from 'react'

// components
import Kartu from "../components/Kartu"

const pages = 'konsumen'

const Konsumen = () => {
  const [fetchError, setFetchError] = useState(null)
  const [tables, setTables] = useState(null)
  const [telepon, setTelepon] = useState()

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
        //   .order('nama')
        
        if (error) {
          setTables(null)
          setFetchError('Could not fetch the service')
        }
        if (data) {
          setTables(data)
          setFetchError(null)
          if (data.telepon != '' ) {
            setTelepon("******")
          }
        }
      }
      fetchTables()

      
    
  }, [])

  return (
    <div className="page">
      {fetchError && (<p>{fetchError}</p>)}
      {tables && (
        <div className="services">
          <div className="tombol-membuat">
            <Link to={"/laundry/"+ pages +"/membuat"} pages={pages} className="membuat-pelayanan">Membuat Baru</Link>
          </div> 

          <div className="laundry-grid">
            {tables.map(table => (
              <Kartu key={table.id} table={table} pages={pages} telepon={telepon} onDelete={handleDelete} />
            ))}
          </div>
          
        </div>
      )}
    </div>
  )
}

export default Konsumen
