import { useEffect, useState } from 'react';
import supabase from "../config/supabaseClient"

function Test() {
  const [nama, setNama] = useState('')

  const [ukuranOptions, setUkuranOptions] = useState([]);
  const [namapelayananOption, setNamaPelayananOptions] = useState([]);
  const [pengerjaanOptions, setPengerjaanOptions] = useState([]);
  const [kategoriOptions, setKategoriOptions] = useState([]);
  const [hargaOptions, setHargaOptions] = useState([]);

  const [formFields, setFormFields] = useState([
    // Menambah variabel array sesuai field pada table
    { nama: '', ukuran: '', pengerjaan: '', jml: '', berat: '', harga: '', total: ''}
  ]);

  useEffect(() => {
    // Ambil data ukuran dari tabel pelayanan di Supabase
    async function fetchNamaPelayananOptions() {
      const { data, error } = await supabase
        .from('pelayanan')
        .select('nama'); // Ganti dengan kolom yang sesuai di tabel pelayanan
  
      if (error) {
        console.error('Error fetching ukuran options:', error);
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
        .select('kategori'); // Ganti dengan kolom yang sesuai di tabel pelayanan
  
      if (error) {
        console.error('Error fetching kategori options:', error);
      } else {
        // Ambil unik kategori dan set ke state kategoriOptions
        const uniqueKategori = [...new Set(data.map(item => item.kategori))];
        setKategoriOptions(uniqueKategori);
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
  
    fetchNamaPelayananOptions()
    fetchHargaOptions();
    fetchKategoriOptions();
    fetchUkuranOptions();
    fetchPengerjaanOptions();
  }, []);

  const handleFormChange = (event, index) => {
  const newData = [...formFields];
  newData[index][event.target.name] = event.target.value;
  
    // Ambil nama pelayanan, ukuran, dan pengerjaan dari form
    const selectedNamaPelayanan = newData[index].nama;
    const selectedUkuran = newData[index].ukuran;
    const selectedPengerjaan = newData[index].pengerjaan;
  
    console.log("Selected:", selectedNamaPelayanan, selectedUkuran, selectedPengerjaan);
  
    // Cari harga yang sesuai dari tabel pelayanan
    const hargaData = hargaOptions.find(
      item =>
        item.nama === selectedNamaPelayanan &&
        item.ukuran === selectedUkuran &&
        item.pengerjaan === selectedPengerjaan
    );
  
    console.log("Harga Data:", hargaData);
  
    // Jika harga ditemukan, set nilai harga di newData
    if (hargaData) {
      newData[index].harga = hargaData.harga;
    }
  
    console.log("New Data:", newData);
  
    setFormFields(newData);
  }
  

  const submit = async (e) => {
    e.preventDefault();

    // Prepare the list of queries
    const queries = formFields.map(item => ({
      nama: item.nama,
      ukuran: item.ukuran,
      pengerjaan: item.pengerjaan,
      jml: item.jml,
      berat: item.berat,
      harga: item.harga,
      total: item.total
    }));

    const { data, error } = await supabase
    .from('new_bon')
    .insert(queries);

    if (error) {
      console.error('Error inserting data:', error);
    } else {
      console.log('Data inserted:', data);
    }
  }

  const addFields = () => {
    const object = { 
      nama: '',
      ukuran: '', 
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

  return (
    <div className="App">
      <form onSubmit={submit}>

        <h2 align="center">Konsumen</h2>
        <h1>=========================</h1>

        {/* Data pertama nama konsumen */}
        <label htmlFor="nama">Nama Konsumen : </label>
        <input 
          type="text" 
          id="nama"
          value={nama}
          onChange={(e) => setNama(e.target.value)}
        />

        {formFields.map((form, index) => (
          <div key={index}>

            <h2 align="center" >Pelayanan : {index + 1}</h2>
            <h1>=========================</h1>

            {/* Data kedua nama pelayanan */}
            <p>Nama Pelayanan</p>
            <select className="form-control"
              id={`sel1`}
              name="nama" // Tambahkan name sesuai field yang ingin diubah
              value={form.nama} // Tambahkan value dari state formFields
              onChange={(event) => handleFormChange(event, index)}
            >
              {namapelayananOption.map((namapelayanan, optionIndex) => (
                <option key={optionIndex} value={namapelayanan}>
                  {namapelayanan}
                </option>
              ))}
            </select>


            {/* Data ketiga ukuran */}
            <br></br>
            <p>Ukuran</p>
            <select className="form-control"
              id={`sel1`}
              name="ukuran" // Tambahkan ukuran sesuai field yang ingin diubah
              value={form.ukuran} // Tambahkan value dari state formFields
              onChange={(event) => handleFormChange(event, index)}
            >
              {ukuranOptions.map((ukuran, optionIndex) => (
                <option key={optionIndex} value={ukuran}>
                  {ukuran}
                </option>
              ))}
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
            />

            {/* Data keenam berat */}

            <label htmlFor={`berat${index}`}>Berat : </label>
            <input 
              type="number" 
              id={`berat${index}`}
              name="berat"
              value={form.berat}
              onChange={event => handleFormChange(event, index)}
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

            <button type="button" onClick={() => removeFields(index)}>Remove</button>
          </div>
        ))}
      </form>
      <button onClick={addFields}>Add more</button>
      <br />
      <button onClick={submit}>Submit</button>
    </div>
  );
}

export default Test;
