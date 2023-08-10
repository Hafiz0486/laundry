import { useEffect, useState } from "react"
import { useParams, useNavigate } from 'react-router-dom'
import supabase from "../config/supabaseClient"

const Memperbarui = () => {
  const { pages } = useParams()
  const { id } = useParams()
  const navigate = useNavigate()

  // variable penampung field
  const [nama, setNama] = useState('')
  const [pelayanan, setPelayanan] = useState('')
  const [ukuran, setUkuran] = useState('')
  const [tgl_masuk, setTglMasuk] = useState('')
  const [tgl_ambil, setTglAmbil] = useState('')
  const [jml, setJml] = useState('')
  const [kg, setKg] = useState('')
  const [harga, setHarga] = useState('')
  const [update, setUpdate] = useState('')
  const [formError, setFormError] = useState(null)

  // fungsi untuk submit data
  const handleSubmit = async (e) => {
    e.preventDefault()

    // jika pages adalah table bon
    if (pages === 'bon') {
      if ((!nama || !tgl_masuk || !tgl_ambil || !pelayanan || !harga) && (!jml || !kg)) {
        setFormError('Please fill in all the fields correctly.')
        return
      }
      var listquery = { nama, pelayanan, tgl_masuk, tgl_ambil, jml, kg, harga }
    }

    // jika pages adalah table pelayanan
    if (pages === 'pelayanan') {
      if (!nama || !harga || !ukuran) {
        setFormError('Please fill in all the fields correctly.')
        return
      }
      var listquery = { nama, harga, ukuran }
    }


    const { data, error } = await supabase
      .from(pages)
      .update(listquery)
      .eq('id', id)

    if (error) {
      setFormError('Please fill in all the fields correctly.')
    }
    if (data) {
      setFormError(null)
      if (pages === 'pelayanan') {
        navigate('/service')
      }

      if (pages === 'bon'){
        navigate('/bon')
      }
    
    }
  }

  useEffect(() => {
    const fetchTableQuery = async () => {
      const { data, error } = await supabase
        .from(pages)
        .select()
        .eq('id', id)
        .single()

      if (error) {
        if (pages === 'pelayanan') {
          navigate('/'+ pages +'/memperbarui-', { replace: true })
        }
        
        if (pages === 'bon'){
          navigate('/'+ pages +'/memperbarui-', { replace: true })
        }
      }
      if (data) {
        if (pages === 'bon') {
          setNama(data.nama)
          setTglMasuk(data.tgl_masuk)
          setTglAmbil(data.tgl_ambil)
          setPelayanan(data.pelayanan)
          setJml(data.jml)
          setKg(data.kg)
          setHarga(data.harga)
          setUpdate(Date.now())
        }

        if (pages === 'pelayanan') {
          setNama(data.nama)
          setHarga(data.harga)
          setUkuran(data.ukuran)
          setUpdate(Date.now())
        }
      }
    }

    fetchTableQuery()
  }, [id, navigate])

  const [dateComponents, timeComponents] = tgl_masuk.split(' ')

  if (pages === 'bon') {
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
  
          <label htmlFor="tgl_masuk">Tanggal Masuk : </label>
          <input 
            type="date" 
            id="tgl_masuk"
            value={dateComponents}
            onChange={(e) => setTglMasuk(e.target.value)}
          />
  
          <label htmlFor="tgl_ambil">Tanggal Ambil : </label>
          <input 
            type="date" 
            id="tgl_ambil"
            value={tgl_ambil}
            onChange={(e) => setTglAmbil(e.target.value)}
          />
  
          <label htmlFor="pelayanan">Pelayanan : </label>
          <textarea 
            id="pelayanan"
            value={pelayanan}
            onChange={(e) => setPelayanan(e.target.value)}
          />
  
          <label htmlFor="jml">Jumlah : </label>
          <input 
            type="text" 
            id="jml"
            value={jml}
            onChange={(e) => setJml(e.target.value)}
          />
  
          <label htmlFor="kg">Berat (Kg) : </label>
          <input 
            type="text" 
            id="kg"
            value={kg}
            onChange={(e) => setKg(e.target.value)}
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

  if (pages == 'pelayanan') {
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

          <label htmlFor="harga">Harga : </label>
          <input 
            type="number"
            id="harga"
            value={harga}
            onChange={(e) => setHarga(e.target.value)}
          />

          <label htmlFor="ukuran">Ukuran : </label>
          <input 
            type="text" 
            id="ukuran"
            value={ukuran}
            onChange={(e) => setUkuran(e.target.value)}
          />
  
          <button>Update Service</button>
  
          {formError && <p className="error">{formError}</p>}
        </form>
      </div>
  
    )
  }
}
  

export default Memperbarui