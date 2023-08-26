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

  const [harga, setHarga] = useState(0)
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

  const [pelayananOptions, setPelayananOptions] = useState([]);
  // fungsi untuk submit data
  const handleSubmit = async (e) => {
    e.preventDefault()

    if (pages === 'konsumen') {
      var listquery = { nama, keanggotaan, telepon, kelamin }
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
      var listquery = { nama, ttl_keseluruhan, pembayaran, jns_pembayaran, kembalian, update}
    }

    update = update.toISOString().split('T')[0]

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

      if (pages === 'konsumen'){
        navigate('/konsumen')
      }

      if (pages === 'transaksi'){
        navigate('/transaksi')
      }
    
    }
  }

  useEffect(() => {
    // Calculate kembalian whenever pembayaran or ttl_keseluruhan changes
    const calculatedKembalian = parseFloat(pembayaran) - parseFloat(ttl_keseluruhan);
    
    // Update kembalian state
    setKembalian(calculatedKembalian); // Rounding to 2 decimal places
  }, [pembayaran, ttl_keseluruhan]);

  useEffect(() => {
    const fetchPelayananOptions = async () => {
      const { data, error } = await supabase
      .from('pelayanan')
      .select('nama', 'kategori', 'ukuran', 'pengerjaan');
      if (data) {
        setPelayananOptions(data);
      }
    };
    fetchPelayananOptions();

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
        }

        if (pages === 'pelayanan') {
          setNama(data.nama)
          setKategori(data.kategori)
          setHarga(data.harga)
          setUkuran(data.ukuran)
        }

        if (pages === 'transaksi') {
          setNama(data.nama)
          setTotalKeseluruhan(data.ttl_keseluruhan)
          setPembayaran(data.pembayaran)
          setJenisPembayaran(data.jns_pembayaran)
          setKembalian(data.kembalian)
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
            disabled = {true}
          />

          <label htmlFor="pembayaran">Pembayaran : </label>
          <input 
            type="number" 
            id="pembayaran"
            value={pembayaran}
            onChange={(e) => setPembayaran(e.target.value)}
          />    

          <p  className="create-bon-fc">Jenis Pembayaran</p>
          <select
            id="jns_pembayaran"
            value={jns_pembayaran}
            onChange={(e) => setJenisPembayaran(e.target.value)}
          >
            <option value="default">Jenis Pembayaran</option>
            <option value="Cash">Cash</option>
            <option value="Transfer">Transfer</option>
          </select>

          <p></p>

          <label htmlFor="kembalian">Kembalian : </label>
          <input
            type="number"
            id="kembalian"
            value={kembalian}
            onChange={(e) => setKembalian(e.target.value)}
            className={parseFloat(kembalian) < 0 ? "red-text" : parseFloat(kembalian) > 0 ? "green-text" : ""}
          />

          <button>Memperbarui Data Transaksi</button>
  
          {formError && <p className="error">{formError}</p>}
        </form>
      </div>
      )
    }
}
  

export default Memperbarui