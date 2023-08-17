import { useEffect, useState, React } from "react"
import { useParams, useNavigate } from "react-router-dom"
import supabase from "../config/supabaseClient"
import moment from "moment/moment"

const Membuat = () => { 

  const { pages } = useParams();

  const navigate = useNavigate()
  
  const [id_konsumen, setIdKonsumen] = useState('')
  const [id_pelayanan, setIdPelayanan] = useState('')
  const [nama, setNama] = useState('')
  const [pelayanan, setPelayanan] = useState('')
  const [tgl_masuk, setTglMasuk] = useState('')
  const [tgl_ambil, setTglAmbil] = useState('')
  const [jml, setJml] = useState('')
  const [kg, setKg] = useState('')
  const [harga, setHarga] = useState('')

  const [kategori, setKategori] = useState('')
  const [ukuran, setUkuran] = useState('')
  const [pengerjaan, setPengerjaan] = useState('')

  const [keanggotaan, setKeanggotaan] = useState('')
  const [tlp, setTelepon] = useState('')
  const [kelamin, setKelamin] = useState('')

  const [formError, setFormError] = useState(null)

  const handleSubmit = async (e) => {
    e.preventDefault()

     // jika pages adalah table bon
     if (pages === 'bon') {
      if ((!nama || !tgl_masuk || !pelayanan)) {
        setFormError('Data is not complete.')
        return
      }

      // data yang dimasukan di form akan di input ke dalam field dan field harus terisi semua
      var listquery = { nama, tgl_masuk, pelayanan  }

    }

    // jika pages adalah table pelayanan
    if (pages === 'pelayanan') {
      if (!nama || !harga || !ukuran) {
        setFormError('Data is not complete.')
        return
      }
      var listquery = { nama, keanggotaan, ukuran, pengerjaan, harga }
    }

    if (pages === 'konsumen') {
      if (!nama || !keanggotaan ) {
        setFormError('Data is not complete.')
        return
      }
      var listquery = { nama, keanggotaan}
    }

    const { data, error } = await supabase
      .from(pages)
      .insert([listquery])

    if (error) {
      console.log(error)
      setFormError('Error when input to database.')
    }
    if (data) {
      console.log(data)
      setFormError(nama+' ukuran '+ukuran+' pengerjaan '+pengerjaan+' Data Success Inserted')
      if (pages === 'pelayanan') {
        navigate('/'+ pages)
      }
      
      if (pages === 'bon'){
        navigate('/'+ pages)
      }

      if (pages === 'konsumen'){
        navigate('/'+ pages)
      }
    }
  }

  // page input pelayanan

  if (pages == 'pelayanan') {
    return (
      <div className="page membuat">
        <form onSubmit={handleSubmit}>
  
          <label htmlFor="nama">Nama : </label>
          <input 
            type="text" 
            id="nama"
            value={nama}
            onChange={(e) => setNama(e.target.value)}
          />

          <label htmlFor="kategori">Kategori : </label>
          <input 
            type="text" 
            id="kategori"
            value={kategori}
            onChange={(e) => setKategori(e.target.value)}
          />

          <label htmlFor="ukuran">Ukuran : </label>
          <input 
            type="text" 
            id="ukuran"
            value={ukuran}
            onChange={(e) => setUkuran(e.target.value)}
          />

          <label htmlFor="pengerjaan">Pengerjaan : </label>
          <input 
            type="text" 
            id="pengerjaan"
            value={pengerjaan}
            onChange={(e) => setPengerjaan(e.target.value)}
          />

          <label htmlFor="harga">Harga : </label>
          <input 
            type="number"
            id="harga"
            value={harga}
            onChange={(e) => setHarga(e.target.value)}
          />
  
          <button>Membuat Pelayanan</button>
  
          {formError && <p className="error">{formError}</p>}
        </form>
      </div>
      )
    }
  
    if (pages == 'konsumen') {
      return (
        <div className="page membuat">
          <form onSubmit={handleSubmit}>
    
            <label htmlFor="nama">Nama : </label>
            <input 
              type="text" 
              id="nama"
              value={nama}
              onChange={(e) => setNama(e.target.value)}
            />
  
            <label htmlFor="keanggotaan">Keanggotaan : </label>
            <input 
              type="text" 
              id="keanggotaan"
              value={keanggotaan}
              onChange={(e) => setKeanggotaan(e.target.value)}
            />
  
            <label htmlFor="tlp">No. Telepon : </label>
            <input 
              type="text" 
              id="tlp"
              value={tlp}
              onChange={(e) => setTelepon(e.target.value)}
            />
  
            <label htmlFor="kelamin">Jenis Kelamin : </label>
            <input 
              type="text" 
              id="kelamin"
              value={kelamin}
              onChange={(e) => setKelamin(e.target.value)}
            />
  
            <button>Membuat Konsumen</button>
    
            {formError && <p className="error">{formError}</p>}
          </form>
        </div>
        )
      }

}
export default Membuat