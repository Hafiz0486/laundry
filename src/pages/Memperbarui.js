import { useEffect, useState } from "react"
import { useParams, useNavigate } from 'react-router-dom'
import supabase from "../config/supabaseClient"
import ImageModal from "../components/ImageModal"

const CDNURL = "https://gomqdnsdzpqgypcdvbnt.supabase.co/storage/v1/object/public/img/konsumen/"

const Memperbarui = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
    const [modalImageUrl, setModalImageUrl] = useState('');

    // variable feth gambar
    const [img1, setImg1] = useState(null)
    const [img2, setImg2] = useState(null)

    // variable penampung inputan
    const [file1, setFile1] = useState(null);
    const [file2, setFile2] = useState(null);

    // variable prefill dan update gambar
    const [gambar1, setGambar1] = useState(null);
    const [gambar2, setGambar2] = useState(null);

    const handleImageClick = (imageUrl) => {
      setModalImageUrl(imageUrl);
      setIsModalOpen(true);
    };

    const handleCloseModal = () => {
      setIsModalOpen(false);
      setModalImageUrl('');
    };

  const { pages } = useParams()
  const { id } = useParams()

  const navigate = useNavigate()

  // variable penampung field
  const [nama, setNama] = useState('');
  const [pelayanan, setPelayanan] = useState('')
  const [tgl_masuk, setTglMasuk] = useState('')
  const [tgl_ambil, setTglAmbil] = useState('')

  const [harga, setHarga] = useState(0)
  const [update, setUpdate] = useState('')
  const [formError, setFormError] = useState(null)

  const [kategori, setKategori] = useState('')
  const [ukuran, setUkuran] = useState('')

  const [keanggotaan, setKeanggotaan] = useState('');
  const [telepon, setTelepon] = useState('');
  const [kelamin, setKelamin] = useState('');

  const [ttl_keseluruhan, setTotalKeseluruhan] = useState(0);
  const [pembayaran, setPembayaran] = useState(0);
  const [jns_pembayaran, setJenisPembayaran] = useState('');
  const [kembalian, setKembalian] = useState(0);

  

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
          setTelepon(data.telepon || '')
          setKelamin(data.kelamin)
          setImg1(data.img1)
          setImg2(data.img2)
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
    const gambar1 = img1 ? CDNURL + img1 : CDNURL + 'Gambar Kosong.png';
    const gambar2 = img2 ? CDNURL + img2 : CDNURL + 'Gambar Kosong.png';
    return (
      <div className="page membuat">
        <form onSubmit={handleSubmit}>

          <p className="membuat">Nama : </p>
          <input 
            type="text" 
            id="nama"
            value={nama}
            onChange={(e) => setNama(e.target.value)}
          />

          <p className="membuat">Keanggotaan : </p>
          <input 
            type="text" 
            id="keanggotaan"
            value={keanggotaan}
            onChange={(e) => setKeanggotaan(e.target.value)}
          />

          <p className="membuat">No. Telepon : </p>
          <input 
            type="number" 
            id="telepon"
            value={telepon}
            onChange={(e) => setTelepon(e.target.value)}
          />

          <p  className="membuat-option">Jenis Kelamin</p>
          <select
            className="membuat"
            id="kelamin"
            value={kelamin}
            onChange={(e) => setKelamin(e.target.value)}
          >
            <option className="membuat" value="default">Jenis Kelamin</option>
            <option className="membuat" value="Laki-laki">Laki-laki</option>
            <option className="membuat" value="Perempuan">Perempuan</option>
          </select>

          <br></br>
          <br></br>

          <p className="membuat">Gambar 1 : </p>
          <input
            type="file"
            id="file"
            onChange={(e) => setFile1(e.target.files[0])}
          />

          <img
            className="image-spacing"
            src={gambar1}
            width="48%"
            height="50%"
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