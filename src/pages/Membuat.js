import { useEffect, useState, React } from "react"
import { useParams, useNavigate } from "react-router-dom"
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
      if (!nama || !keanggotaan) {
        setFormError('Data is not complete.');
        return;
      } else {
        try {
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
              // Don't use setImg1 here
            }
          }
    
        } catch (error) {
          console.error("Error:", error);
        }
    
        // Use file1.name directly in the listquery object
        var listquery = { nama, keanggotaan, kelamin, img1: file1.name };
      }
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
  
          <button>Membuat Data Pelayanan</button>
  
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

            <label htmlFor="file1">Gambar 1 : </label>
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

}
export default Membuat