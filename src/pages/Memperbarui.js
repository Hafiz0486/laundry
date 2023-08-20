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
  const [tgl_masuk, setTglMasuk] = useState('')
  const [tgl_ambil, setTglAmbil] = useState('')
  const [jml, setJml] = useState('')
  const [kg, setKg] = useState('')
  const [harga, setHarga] = useState('')
  const [update, setUpdate] = useState('')
  const [formError, setFormError] = useState(null)

  const [kategori, setKategori] = useState('')
  const [ukuran, setUkuran] = useState('')

  const [keanggotaan, setKeanggotaan] = useState('')
  const [telepon, setTelepon] = useState('')
  const [kelamin, setKelamin] = useState('')

  const [ttl_keseluruhan, setTotalKeseluruhan] = useState(0)
  const [pembayaran, setPembayaran] = useState(0)
  const [jns_pembayaran, setJenisPembayaran] = useState('')
  const [kembalian, setKembalian] = useState(0)

  // fungsi untuk submit data
  const handleSubmit = async (e) => {
    e.preventDefault()

    if (pages === 'konsumen') {
      var listquery = { nama, keanggotaan, telepon, kelamin }
    }

    // jika pages adalah table bon
    if (pages === 'bon') {
      if ((!nama || !tgl_masuk || !tgl_ambil || !pelayanan || !harga) && (!jml || !kg)) {
        setFormError('Please fill in all the fields data bon correctly.')
        return
      }
      var listquery = { nama, pelayanan, tgl_masuk, tgl_ambil, jml, kg, harga }
    }

    // jika pages adalah table pelayanan
    if (pages === 'pelayanan') {
      if (!nama || !kategori || !harga || !ukuran) {
        setFormError('Please fill in all the fields data pelayanan correctly.')
        return
      }
      var listquery = { nama, kategori, ukuran, harga }
    }

    if (pages === 'transaksi') {
      var listquery = { nama, ttl_keseluruhan, pembayaran, jns_pembayaran, kembalian}
    }

    const { data, error } = await supabase
      .from(pages)
      .update(listquery)
      .eq('id', id)
      console.log(nama, ttl_keseluruhan, pembayaran, jns_pembayaran, kembalian)
      console.log(pages)
      console.log('Data:', data);
      console.log('Error:', error);

    if (error) {
      setFormError('Input to database error.')
    }
    if (data) {
      setFormError(null)
      if (pages === 'pelayanan') {
        navigate('/pelayanan')
      }

      if (pages === 'bon'){
        navigate('/bon')
      }

      if (pages === 'konsumen'){
        navigate('/konsumen')
      }

      if (pages === 'transaksi'){
        navigate('/transaksi')
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
        if (pages === 'konsumen'){
          navigate('/'+ pages +'/memperbarui-'+id, { replace: true })
        }

        if (pages === 'pelayanan') {
          navigate('/'+ pages +'/memperbarui-'+id, { replace: true })
        }
        
        if (pages === 'bon'){
          // navigate('/'+ pages +'/memperbarui-'+id, { replace: true })
        }

        if (pages === 'transaksi'){
          navigate('/'+ pages +'/memperbarui-'+id, { replace: true })
        }
      }
      
      if (data) {

        if (pages === 'konsumen') {
          setNama(data.nama)
          setKeanggotaan(data.keanggotaan)
          setTelepon(data.telepon)
          setKelamin(data.kelamin)
          setUpdate(Date.now())
        }

        if (pages === 'pelayanan') {
          setNama(data.nama)
          setKategori(data.kategori)
          setHarga(data.harga)
          setUkuran(data.ukuran)
          setUpdate(Date.now())
        }

        if (pages === 'transaksi') {
          setNama(data.nama)
          setTotalKeseluruhan(data.ttl_keseluruhan)
          setPembayaran(data.pembayaran)
          setJenisPembayaran(data.jns_pembayaran)
          setKembalian(data.kembalian)
          setUpdate(Date.now())
        }

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
      }
    }

    fetchTableQuery()
  }, [id, navigate])

  // const [dateComponents, timeComponents] = tgl_masuk.split(' ')
  
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

          <label htmlFor="telepon">No. Telepon : </label>
          <input 
            type="text" 
            id="telepon"
            value={telepon}
            onChange={(e) => setTelepon(e.target.value)}
          />

          <label htmlFor="kelamin">Jenis Kelamin : </label>
          <input 
            type="text" 
            id="kelamin"
            value={kelamin}
            onChange={(e) => setKelamin(e.target.value)}
          />

          <button>Memperbarui Data Konsumen</button>
  
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

          <label htmlFor="harga">Harga : </label>
          <input 
            type="number"
            id="harga"
            value={harga}
            onChange={(e) => setHarga(e.target.value)}
          />
  
          <button>Memperbarui Data Pelayanan</button>
  
          {formError && <p className="error">{formError}</p>}
        </form>
      </div>
  
    )
  }
  
  if (pages == 'transaksi') {
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

          <label htmlFor="ttl_keseluruhan">Total Keseluruhan : </label>
          <input 
            type="number" 
            id="ttl_keseluruhan"
            value={ttl_keseluruhan}
            onChange={(e) => setTotalKeseluruhan(e.target.value)}
          />

          <label htmlFor="pembayaran">Pembayaran : </label>
          <input 
            type="number" 
            id="pembayaran"
            value={pembayaran}
            onChange={(e) => setPembayaran(e.target.value)}
          />    

          <label htmlFor="jns_pembayaran">Jenis Pembayaran : </label>
          <select
            id="jns_pembayaran"
            value={jns_pembayaran}
            onChange={(e) => setJenisPembayaran(e.target.value)}
          >
            <option value="default">Pilih Jenis Pembayaran</option>
            <option value="cash">Cash</option>
            <option value="transfer">Transfer</option>
          </select>
          <p></p>


          <label htmlFor="kembalian">Kembalian : </label>
          <input 
            type="number" 
            id="kembalian"
            value={kembalian}
            onChange={(e) => setKembalian(e.target.value)}
          />

          <button>Memperbarui Data Transaksi</button>
  
          {formError && <p className="error">{formError}</p>}
        </form>
      </div>
      )
    }
  
    if (pages === 'bon') {

      return (

        <div className="page memperbarui">
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
              value={tgl_masuk}
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
    
            <button>Memperbarui Data Bon</button>
    
            {formError && <p className="error">{formError}</p>}
          </form>
        </div>
    
      )
    } 
}
  

export default Memperbarui