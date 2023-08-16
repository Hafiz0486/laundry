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

  const [formError, setFormError] = useState(null)

  const handleSubmit = async (e) => {
    e.preventDefault()

     // jika pages adalah table bon
     if (pages === 'bon') {
      if ((!nama || !tgl_masuk || !pelayanan)) {
        setFormError('There is a data that wrong.')
        return
      }

      // data yang dimasukan di form akan di input ke dalam field dan field harus terisi semua
      var listquery = { nama, tgl_masuk, pelayanan  }

    }

    // jika pages adalah table pelayanan
    if (pages === 'pelayanan') {
      if (!nama || !harga || !ukuran) {
        setFormError('There is a data that wrong.')
        return
      }
      var listquery = { nama, kategori, ukuran, pengerjaan, harga }
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
        navigate('/laundry/'+ pages)
      }
      
      if (pages === 'bon'){
        navigate('/laundry/'+ pages)
      }
    }
  }

  if (pages === 'bon') {
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
  
          <label htmlFor="tgl_masuk">Tanggal Masuk : </label>
          <input 
            type="date" 
            id="tgl_masuk"
            value = {tgl_masuk}
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

          <div class="form-group">
            <label for="sel1">Select list:</label>
            <select class="form-control" id="sel1">
              <option>1</option>
              <option>2</option>
              <option>3</option>
              <option>4</option>
            </select>
          </div>
  
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

          <button>Membuat Bon</button>
  
          {formError && <p className="error">{formError}</p>}
        </form>
      </div>
  
    )
  }

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

}
export default Membuat