import { useEffect, useState, React } from "react"
import { useParams, useNavigate, Link } from "react-router-dom"
import { createClient } from '@supabase/supabase-js';  // Import Supabase client
import supabase from "../config/supabaseClient"
import { v4 as uuidv4 } from 'uuid'
import moment from "moment/moment"

// insert bon, pelayanan

const Membuat = () => { 

  const { pages } = useParams();

  const navigate = useNavigate()
  
  const [id_konsumen, setIdKonsumen] = useState('')
  const [id_pelayanan, setIdPelayanan] = useState('')
  const [nama, setNama] = useState('')
  const [pelayanan, setPelayanan] = useState('')
  const [tgl_masuk, setTglMasuk] = useState('')
  const [tgl_ambil, setTglAmbil] = useState('')
  const [jumlah, setJumlah] = useState('')
  const [kg, setKg] = useState('')
  const [harga, setHarga] = useState('')

  const [kategori, setKategori] = useState('')
  const [ukuran, setUkuran] = useState('')
  const [pengerjaan, setPengerjaan] = useState('')

  const [keanggotaan, setKeanggotaan] = useState('')
  const [telepon, setTelepon] = useState('')
  const [kelamin, setKelamin] = useState('')

  const [formError, setFormError] = useState(null)

  const [file1, setFile1] = useState(null);
  const [img1, setImg1] = useState('');

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
      var listquery = { nama, kategori, ukuran, pengerjaan, harga, img1}
    }

    if (pages === 'konsumen') {
      // if (!nama || !keanggotaan) {
      //   setFormError('Data is not complete.');
      //   return;
      // } else {


        try {
          if (file1 == null) {
            img1 = "Gambar Kosong.png"
          } else {
            if (file1) {
              const { data, error } = await supabase
                .storage
                .from('img/konsumen')
                .upload(file1.name, file1);
      
              if (error) {
                if (error.message.includes("already exists")) {
                  setFormError('A file with the same name already exists.');
                } else {
                  console.error("Error inserting image into storage:", error);
                }
                return;
              }
      
              if (data) {
                console.log("Image uploaded successfully:", data.Key);
                img1 = file1.name
                // Don't use setImg1 here
              }
            }
          }

          
    
        } catch (error) {
          console.error("Error:", error);
        }
    
        // Use file1.name directly in the listquery object
        var listquery = { nama, keanggotaan, telepon, kelamin, img1 };
      // }
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
  if (pages == 'konsumen') {
    return (
      <div className="page membuat">

        <div className="tombol-kembali">
          <Link to={"/" + pages} className="membuat-pelayanan">Kembali</Link>
        </div> 

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
            id="file1"
            onChange={(e) => setFile1(e.target.files[0])}
          />

          <button>Membuat Data Konsumen</button>
  
          {formError && <p className="error">{formError}</p>}
        </form>
      </div>
      )
  }

  if (pages == 'pelayanan') {
    return (
      <div className="page membuat">

        <div className="tombol-kembali">
          <Link to={"/" + pages} className="membuat-pelayanan">Kembali</Link>
        </div> 

        <form onSubmit={handleSubmit}>
  
          <label className="membuat">Nama : </label>
          <input 
            type="text" 
            id="nama"
            value={nama}
            onChange={(e) => setNama(e.target.value)}
          />

          <p  className="membuat-option">Jenis Kelamin</p>
          <select
            className="membuat"
            id="kategori"
            value={kategori}
            onChange={(e) => setKategori(e.target.value)}
          >
            <option className="membuat" value="default">Pilih Kategori</option>
            <option className="membuat" value="Kiloan">Kiloan</option>
            <option className="membuat" value="Satuan">Satuan</option>
          </select>

          <br></br>
          <br></br>
          <p className="membuat">Ukuran : </p>
          <input 
            type="text" 
            id="ukuran"
            value={ukuran}
            onChange={(e) => setUkuran(e.target.value)}
          />

          <p  className="membuat-option">Jenis Pengerjaan</p>
          <select
            className="membuat"
            id="pengerjaan"
            value={pengerjaan}
            onChange={(e) => setPengerjaan(e.target.value)}
          >
            <option className="membuat" value="default">Jenis Pengerjaan</option>
            <option className="membuat" value="Normal">Normal</option>
            <option className="membuat" value="Express">Express</option>
          </select>
          <br></br>
          <br></br>

          <p className="membuat">Harga : </p>
          <input 
            type="number"
            id="harga"
            value={harga}
            onChange={(e) => setHarga(e.target.value)}
          />
  
          <button>Membuat Data Pelayanan</button>
  
          {formError && <p className="error">{formError}</p>}
        </form>
      </div>
      )
    }

}
export default Membuat