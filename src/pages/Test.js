import { useEffect, useState } from 'react';
import supabase from "../config/supabaseClient"

const Test = () => {
  const [nama, setNama] = useState('')
  const [ttl_keseluruhan, setTotalKeseluruhan] = useState('')
  const [bayar, setBayar] = useState('')
  const [jns_pembayaran, setJenisPembyaran] = useState('')
  const [kembalian, setKembalian] = useState('')

  const [ukuranOptions, setUkuranOptions] = useState([]);
  const [namapelayananOption, setNamaPelayananOptions] = useState([]);
  const [kategoriOptions, setKategoriOptions] = useState([]);
  const [pengerjaanOptions, setPengerjaanOptions] = useState([]);
  const [hargaOptions, setHargaOptions] = useState([]);

  const [formFields, setFormFields] = useState([
    { nama: '', kategori: '', ukuran: '', pengerjaan: '', jml: '', berat: '', harga: '', total: '' }
  ]);

  const [defaultHarga, setDefaultHarga] = useState(0); // State untuk menyimpan harga default
  const [jenisSatuan, setJenisSatuan] = useState(''); // State untuk menyimpan jenis satuan

  useEffect(() => {
    async function fetchNamaPelayananOptions() {
      const { data, error } = await supabase
        .from('pelayanan')
        .select('nama');
      if (error) {
        console.error('Error fetching nama pelayanan options:', error);
      } else {
        const uniqueNamaPelayanan = [...new Set(data.map(item => item.nama))];
        setNamaPelayananOptions(uniqueNamaPelayanan);
      }
    }

    // Ambil data ukuran dari tabel pelayanan di Supabase
    async function fetchUkuranOptions() {
      const { data, error } = await supabase
        .from('pelayanan')
        .select('ukuran'); // Ganti dengan kolom yang sesuai di tabel pelayanan
  
      if (error) {
        console.error('Error fetching ukuran options:', error);
      } else {
        const uniqueUkuran = [...new Set(data.map(item => item.ukuran))];
        setUkuranOptions(uniqueUkuran);
      }
    }

    // Ambil data pengerjaan dari tabel pelayanan di Supabase
    async function fetchPengerjaanOptions() {
      const { data, error } = await supabase
        .from('pelayanan')
        .select('pengerjaan'); // Ganti dengan kolom yang sesuai di tabel pelayanan
  
      if (error) {
        console.error('Error fetching pengerjaan options:', error);
      } else {
        const uniquePengerjaan = [...new Set(data.map(item => item.pengerjaan))];
        setPengerjaanOptions(uniquePengerjaan);
      }
    }

    // Ambil data kategori dari tabel pelayanan di Supabase
    async function fetchKategoriOptions() {
      const { data, error } = await supabase
        .from('pelayanan')
        .select('nama, kategori'); // Ganti dengan kolom yang sesuai di tabel pelayanan
    
      if (error) {
        console.error('Error fetching kategori options:', error);
      } else {
        setKategoriOptions(data);
      }
    }

    // Ambil data kategori dari tabel pelayanan di Supabase
    async function fetchHargaOptions() {
      const { data, error } = await supabase
        .from('pelayanan')
        .select('nama, ukuran, pengerjaan, harga'); // Ganti dengan kolom yang sesuai di tabel pelayanan
  
      if (error) {
        console.error('Error fetching harga options:', error);
      } else {
        setHargaOptions(data);
      }
    }
  
    fetchNamaPelayananOptions();
    fetchHargaOptions();
    fetchKategoriOptions();
    fetchUkuranOptions();
    fetchPengerjaanOptions();
  }, []);

  const handleFormChange = (event, index) => {
    const newData = [...formFields];
    newData[index][event.target.name] = event.target.value;

    const selectedNamaPelayanan = newData[index].nama;
    const selectedUkuran = newData[index].ukuran;
    const selectedPengerjaan = newData[index].pengerjaan;
    const selectedBerat = newData[index].berat;
    const selectedJumlah = newData[index].jml;

    // Cari harga yang sesuai dari tabel pelayanan
    const hargaData = hargaOptions.find(
      item =>
        item.nama === selectedNamaPelayanan &&
        item.ukuran === selectedUkuran &&
        item.pengerjaan === selectedPengerjaan
    );

    const kategoriData = kategoriOptions.find(item => item.nama === selectedNamaPelayanan);

    // Set harga default dan jenis satuan berdasarkan pelayanan yang dipilih
    if (selectedNamaPelayanan) {
      const selectedPelayanan = hargaOptions.find(
        item =>
          item.nama === selectedNamaPelayanan &&
          item.ukuran === selectedUkuran &&
          item.pengerjaan === selectedPengerjaan
      );

      if (selectedPelayanan) {
        setDefaultHarga(selectedPelayanan.harga);
        setJenisSatuan(selectedPelayanan.jenis);
      }
    }

    if (hargaData) {
      newData[index].harga = hargaData.harga;
    }

    if (kategoriData) {
      newData[index].kategori = kategoriData.kategori;

      if (kategoriData.kategori === 'Kiloan') {
        newData[index].jml = '';
        newData[index].berat = selectedBerat;
        newData[index].ttl = defaultHarga * selectedBerat;
      } else {
        newData[index].berat = '';
        newData[index].jml = selectedJumlah;
        newData[index].ttl = defaultHarga * selectedJumlah;
      }
    }

    console.log("Selected:", selectedNamaPelayanan, selectedUkuran, selectedPengerjaan);
    console.log("Harga Data:", hargaData);
    console.log("New Data:", newData);
    setFormFields(newData);
  }

  const submit = async (e) => {
    e.preventDefault();

    const queriesBOn = formFields.map(item => ({
      nama_konsumen: nama,
      nama: item.nama,
      ukuran: item.ukuran,  
      jml: item.jml,
      berat: item.berat,
      total: item.total
    }));

    // var tgl_pembayaran
    // var kembali
    // var today = Date.now()

    // if (bayar != null || bayar != '') {
    //   tgl_pembayaran = Date.now()
    //   if (ttl_keseluruhan == bayar || ttl_keseluruhan > 0) {
    //     kembalian = 0
    //   } else if (bayar > ttl_keseluruhan) {
    //     kembalian = bayar - ttl_keseluruhan
    //   }
    // }
    
    // var queriesTransaksi = { id_konsumen, nama, today, ttl_keseluruhan, bayar, jns_pembayaran, tgl_pembayaran, kembalian }

    // const { dataTransaksi, errorTransaksi } = await supabase
    //   .from('transaksi')
    //   .insert(queriesTransaksi);

    // if (errorTransaksi) {
    //   console.error('Error inserting data:', errorTransaksi);
    // } else {
    //   console.log('Data inserted:', dataTransaksi);
    // }
    
    const { dataBon, errorBon } = await supabase
      .from('new_bon')
      .insert(queriesBOn);

    if (errorBon) {
      console.error('Error inserting data:', errorBon);
    } else {
      console.log('Data inserted:', dataBon);
    }
  }

  const addFields = () => {
    const object = {
      nama: '',
      kategori: '',
      ukuran: '', // Ganti dengan ukuran default yang diinginkan
      pengerjaan: '',
      jml: '',
      berat: '',
      harga: '',
      total: ''
    };
    setFormFields([...formFields, object]);
  }
  

  const removeFields = (index) => {
    const newData = [...formFields];
    newData.splice(index, 1);
    setFormFields(newData);
  }

  async function fetchUkuranOptions() {
    const { data, error } = await supabase
      .from('pelayanan')
      .select('ukuran, kategori');
  
    if (error) {
      console.error('Error fetching ukuran options:', error);
    } else {
      const uniqueUkuran = [...new Set(data.map(item => item.ukuran))];
      setUkuranOptions(uniqueUkuran);
      setKategoriOptions(data);
    }
  }
  
  
 
  return (
    <div className="transaksi">
      {/* onSubmit={submit} */}
      <form className="information">
      <h1 align="center">Informasi</h1>
      <label htmlFor="nama">Nama Konsumen : </label>
      <input 
        type="text" 
        id="nama"
        value={nama}
        onChange={(e) => setNama(e.target.value)}
      />

      <label htmlFor={`ttl_keseluruhan`}>Total Keseluruhan : </label>
      <input 
        type="number" 
        id={`ttl_keseluruhan`}
        name="ttl_keseluruhan"
        value={ttl_keseluruhan}
        onChange={(e) => setTotalKeseluruhan(e.target.value)}
      />

      <label htmlFor={`bayar`}>Bayar : </label>
      <input 
        type="number" 
        id={`bayar`}
        name="bayar"
        value={bayar}
        onChange={(e) => setBayar(e.target.value)}
      />

      <label htmlFor={`jns_pembayaran`}>Jenis Pembyaran : </label>
      <input 
        type="number" 
        id={`jns_pembayaran`}
        name="jns_pembayaran"
        value={jns_pembayaran}
        onChange={(e) => setJenisPembyaran(e.target.value)}
      />

      <label htmlFor={`kembalian`}>Kembalian : </label>
      <input 
        type="number" 
        id={`kembalian`}
        name="kembalian"
        value={kembalian}
        onChange={(e) => setKembalian(e.target.value)}
      />

      </form>
      {/* onSubmit={submit} */}
      <form className="create-bon" onSubmit={submit}>
        {formFields.map((form, index) => (
          <div key={index}>

            <h2 align="center" >Pelayanan : {index + 1}</h2>
            <h1>===========</h1>

            {/* Data kedua nama pelayanan */}
            <p>Nama Pelayanan</p>
            <select className="form-control"
              id={`sel1`}
              name="nama" // Tambahkan name sesuai field yang ingin diubah
              value={form.nama} // Tambahkan value dari state formFields
              onChange={(event) => handleFormChange(event, index)}
            >
              <option value="default">----- Pilih Pelayanan -----</option>
              {namapelayananOption.map((namapelayanan, optionIndex) => (
                <option key={optionIndex} value={namapelayanan}>
                  {namapelayanan}
                </option>
              ))}
            </select>

            <br></br>
            <label>Kategori : </label>
            <span> {form.kategori}</span>
            <br></br>


            {/* Data ketiga ukuran */}
            <br></br>
            <select className="form-control"
              id={`sel1`}
              name="ukuran"
              value={form.ukuran}
              onChange={(event) => handleFormChange(event, index)}
            >
              <option value="default">----- Pilih Ukuran -----</option>
              {ukuranOptions.map((ukuran, optionIndex) => {
                const selectedKategori = kategoriOptions.find(item => item.nama === form.nama);
                if (
                  (selectedKategori && selectedKategori.kategori === 'Kiloan' && ukuran === 'Normal') ||
                  (selectedKategori && selectedKategori.kategori === 'Satuan' && ukuran !== 'Normal')
                ) {
                  return (
                    <option key={optionIndex} value={ukuran}>
                      {ukuran}
                    </option>
                  );
                }
                return null;
              })}
            </select>



            {/* Data keempat pengerjaan */}
            <br></br>
            <p>Pengerjaan</p>
            <select className="form-control"
              id={`sel1`}
              name="pengerjaan" // Tambahkan pengerjaan sesuai field yang ingin diubah
              value={form.pengerjaan} // Tambahkan value dari state formFields
              onChange={(event) => handleFormChange(event, index)}
            >
              <option value="default">----- Pilih Pengerjaan -----</option>
              {pengerjaanOptions.map((pengerjaan, optionIndex) => (
                <option key={optionIndex} value={pengerjaan}>
                  {pengerjaan}
                </option>
              ))}
            </select>
            
            <br></br>
            {/* Data kelima jml */}
            <label htmlFor={`jml${index}`}>Jumlah : </label>
            <input 
              type="number" 
              id={`jml${index}`}
              name="jml"
              value={form.jml}
              onChange={event => handleFormChange(event, index)}
              disabled={form.kategori !== 'Satuan' || form.ukuran == '' || form.pengerjaan == ''}
            />

            {/* Data keenam berat */}
            <label htmlFor={`berat${index}`}>Berat : </label>
            <input 
              type="number" 
              id={`berat${index}`}
              name="berat"
              value={form.berat}
              onChange={event => handleFormChange(event, index)}
              disabled={form.kategori !== 'Kiloan' || form.ukuran == '' || form.pengerjaan == ''}
            />


            {/* Data ketujuh harga */}
            <label htmlFor={`harga${index}`}>Harga : </label>
            <input 
              type="number" 
              id={`harga${index}`}
              name="harga"
              value={form.harga}
              onChange={event => handleFormChange(event, index)}
            />

            {/* Data kedelapan total */}
            <label htmlFor={`ttl${index}`}>Total : </label>
            <input 
              type="number" 
              id={`ttl${index}`}
              name="ttl"
              value={form.ttl}
              onChange={event => handleFormChange(event, index)}
            />

            <button type="button" onClick={() => removeFields(index)} className="remove-button">Remove</button>
            <button onClick={addFields} className="add-button">Add more</button>
          </div>
        ))}
      </form>
      <button onClick={submit}>Submit</button>
    </div>
  );
}

export default Test
