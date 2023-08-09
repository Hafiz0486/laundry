import { useEffect, useState } from "react"
import { useParams, useNavigate } from 'react-router-dom'
import supabase from "../config/supabaseClient"

const Update = () => {
  const { id } = useParams()
  const navigate = useNavigate()

  const [nama, setNama] = useState('')
  const [pelayanan, setPelayanan] = useState('')
  const [tgl_datang, setTglDatang] = useState('')
  const [tgl_ambil, setTglAmbil] = useState('')
  const [jml, setJml] = useState('')
  const [kg, setKg] = useState('')
  const [harga, setHarga] = useState('')
  const [formError, setFormError] = useState(null)

  const handleSubmit = async (e) => {
    e.preventDefault()

    if (!nama || !pelayanan || !harga) {
      setFormError('Please fill in all the fields correctly.')
      return
    }

    const { data, error } = await supabase
      .from('bon')
      .update({ nama, pelayanan, tgl_datang, tgl_ambil, jml, kg, harga })
      .eq('id', id)

    if (error) {
      setFormError('Please fill in all the fields correctly.')
    }
    if (data) {
      setFormError(null)
      navigate('/')
    }
  }

  useEffect(() => {
    const fetchBon = async () => {
      const { data, error } = await supabase
        .from('bon')
        .select()
        .eq('id', id)
        .single()

      if (error) {
        navigate('/', { replace: true })
      }
      if (data) {
        setNama(data.nama)
        setPelayanan(data.pelayanan)
        setTglDatang(data.tgl_datang)
        setTglAmbil(data.tgl_ambil)
        setPelayanan(data.pelayanan)
        setJml(data.jml)
        setKg(data.kg)
        setHarga(data.harga)
      }
    }

    fetchBon()
  }, [id, navigate])

  return (
    <div className="page create">
      <form onSubmit={handleSubmit}>

        <label htmlFor="nama">Nama : </label>
        <input 
          type="text" 
          id="nama"
          value={nama}
          onChange={(e) => setNama(e.target.value)}
        />

        <label htmlFor="nama">Tanggal Masuk : </label>
        <input 
          type="text" 
          id="nama"
          value={nama}
          onChange={(e) => setNama(e.target.value)}
        />

        <label htmlFor="nama">Tanggal Ambil : </label>
        <input 
          type="text" 
          id="nama"
          value={nama}
          onChange={(e) => setNama(e.target.value)}
        />

        <label htmlFor="pelayanan">Pelayanan : </label>
        <textarea 
          id="pelayanan"
          value={pelayanan}
          onChange={(e) => setPelayanan(e.target.value)}
        />

        <label htmlFor="nama">Jumlah : </label>
        <input 
          type="text" 
          id="nama"
          value={nama}
          onChange={(e) => setNama(e.target.value)}
        />

        <label htmlFor="nama">Berat (Kg) : </label>
        <input 
          type="text" 
          id="nama"
          value={nama}
          onChange={(e) => setNama(e.target.value)}
        />

        <label htmlFor="harga">Harga : </label>
        <input 
          type="number"
          id="harga"
          value={harga}
          onChange={(e) => setHarga(e.target.value)}
        />

        <button>Update Bon</button>

        {formError && <p className="error">{formError}</p>}
      </form>
    </div>

  )
}

export default Update