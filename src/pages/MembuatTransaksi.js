    import { useEffect, useState } from 'react';
    import { useParams, useNavigate } from "react-router-dom"
    import supabase from "../config/supabaseClient"

    const MembuatTransaksi = () => {
        // variable yng dibutuhkan

        const { pages } = useParams();

        const navigate = useNavigate()

        const [nama, setNama] = useState('')
        const [ttl_keseluruhan, setTotalKeseluruhan] = useState('')
        const [pembayaran, setPembayaran] = useState('')
        const [jns_pembayaran, setJenisPembyaran] = useState('')
        const [kembalian, setKembalian] = useState('')

        const [idPelayananOptions, setIdPelayananOptions] = useState([]);
        const [ukuranOptions, setUkuranOptions] = useState([]);
        const [namapelayananOption, setNamaPelayananOptions] = useState([]);
        const [kategoriOptions, setKategoriOptions] = useState([]);
        const [pengerjaanOptions, setPengerjaanOptions] = useState([]);
        const [hargaOptions, setHargaOptions] = useState([]);

        // variable array
        const [formFields, setFormFields] = useState([
            { nama: '', kategori: '', ukuran: '', pengerjaan: '', jml: '', berat: '', harga: '', total: '' }
        ]);

        const [defaultHarga, setDefaultHarga] = useState(0); // State untuk menyimpan harga default
        const [jenisSatuan, setJenisSatuan] = useState(''); // State untuk menyimpan jenis satuan

        // pengambilan data dari tabel pelayanan yang dibutuhkan
        useEffect(() => {

            // pembuatan fungsi pengambilan data
            // Ambil data nama pelayanan dari tabel pelayanan di Supabase
            async function fetchNamaPelayananOptions() {
            const { data, error } = await supabase
                .from('pelayanan')
                .select('nama')
                .order('dibuat');
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
                    .select('id, nama, ukuran, pengerjaan, harga'); // Include the 'id' column
            
                if (error) {
                    console.error('Error fetching harga options:', error);
                } else {
                    setHargaOptions(data);
            
                    // Populate idPelayananOptions based on selected nama, ukuran, and pengerjaan
                    const idPelayananMap = {};
                    data.forEach(item => {
                        const key = `${item.nama}-${item.ukuran}-${item.pengerjaan}`;
                        idPelayananMap[key] = item.id;
                    });
                    setIdPelayananOptions(idPelayananMap);
                }
            }
            
        
            // pemanggiln atau menjalankan fungsi yang sudah dibuat
            fetchNamaPelayananOptions();
            fetchHargaOptions();
            fetchKategoriOptions();
            fetchUkuranOptions();
            fetchPengerjaanOptions();
        }, []);

        // fungsi agar pengguna dapat melakukan penginputan data
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

            const key = `${selectedNamaPelayanan}-${selectedUkuran}-${selectedPengerjaan}`;
            const idPelayanan = idPelayananOptions[key];

            if (idPelayanan) {
                newData[index].id_pelayanan = idPelayanan;
            }

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
                newData[index].jml = 0;
                newData[index].berat = selectedBerat;
                newData[index].ttl = defaultHarga * selectedBerat;
            } else {
                newData[index].berat = 0;
                newData[index].jml = selectedJumlah;
                newData[index].ttl = defaultHarga * selectedJumlah;
            }
            }

            newData[index].total = calculateRowTotal(newData[index]);

        // Calculate the overall "Total Keseluruhan"
        const totalKeseluruhan = newData.reduce((total, row) => total + row.total, 0);
        setTotalKeseluruhan(totalKeseluruhan);

            console.log("Selected:", selectedNamaPelayanan, selectedUkuran, selectedPengerjaan);
            console.log("Harga Data:", hargaData);
            console.log("New Data:", newData);
            setFormFields(newData);
        }

        const submit = async (e) => {
            e.preventDefault();
            
            var tgl_datang = new Date(Date.now())
            // var ttl_keseluruhan = 0
            var tgl_pembayaran = new Date()
            var jns_pembayaran
            var kembalian
            var dibuat = new Date(Date.now())

            if (pembayaran == null) {
            pembayaran = 0
            jns_pembayaran = null
            kembalian = 0
            tgl_pembayaran = null
            }
            
            const queriesTransaksi = {nama, tgl_datang, ttl_keseluruhan, tgl_pembayaran, jns_pembayaran, kembalian, dibuat}

            // console.log(queriesTransaksi)

            const { dataTransaksi, errorTransaksi } = await supabase
            .from('transaksi')
            .insert([queriesTransaksi]);

            if (errorTransaksi) {
            console.error('Error inserting data:', errorTransaksi);
            } else {
            console.log('Data inserted:', dataTransaksi);
            
            }
            
            async function fetchLastIdTransaction() {
            try {
                const { data, error } = await supabase
                .from('transaksi')
                .select('id')
                .order('id', { ascending: false })
                .limit(1);
                
                if (error) {
                throw error;
                }
                
                if (data.length > 0) {
                const id_transaksi = data[0].id;
                console.log('Last transaction ID:', id_transaksi);
                return id_transaksi;
                } else {
                console.log('No transactions found.');
                return null;
                }
            } catch (error) {
                console.error('Error fetching transaction data:', error);
                return null;
            }
            }
            

            async function createQueriesBOn() {
                const id_transaksi = await fetchLastIdTransaction();
            
                if (id_transaksi !== null) {
                    const queriesBOn = formFields.map(item => ({ 
                    id_pelayanan: item.id_pelayanan,
                    nama_konsumen: nama,
                    jml: item.jml,
                    berat: item.berat,
                    total: item.ttl,
                    id_transaksi: id_transaksi,
                    }));
                
                return queriesBOn;
                } else {
                    console.log('Unable to create queriesBOn due to missing transaction ID.');
                    return null;
                }
            }
            
            async function insertDataToSupabase() {
            const queriesBOn = await createQueriesBOn();
            
            if (queriesBOn !== null) {
                const { dataBon, errorBon } = await supabase
                .from('bon')
                .insert(queriesBOn);
            
                if (errorBon) {
                console.error('Error inserting data:', errorBon);
                } 
                if (dataBon) {
                console.log('Data inserted:', dataBon);
                
                }
            } else {
                console.log('No data to insert.');
            }

            }
            
            await insertDataToSupabase();
            navigate("/" + pages);
            
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
            const removedRow = newData.splice(index, 1)[0];
            setFormFields(newData);

            // Calculate the new total after removing the row
            const newTotalKeseluruhan = ttl_keseluruhan - removedRow.total;
            setTotalKeseluruhan(newTotalKeseluruhan);
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
    
        const calculateRowTotal = (row) => {
            if (row.kategori === 'Kiloan') {
              return row.berat * row.harga;
            } else {
              return row.jml * row.harga;
            }
          };
          
    return (
    <div className="transaksi">
        <form className="information">

        <h1 align="center">Informasi</h1>
        <p className="create-informasi" htmlFor="nama">Nama Konsumen : </p>
        <input 
            type="text" 
            id="nama"
            value={nama}
            onChange={(e) => setNama(e.target.value)}
        />
        
        <p className="create-informasi" htmlFor="ttl_keseluruhan">Total Keseluruhan : </p>
        <input 
            type="number" 
            id="ttl_keseluruhan"
            value={ttl_keseluruhan}
            onChange={(e) => setTotalKeseluruhan(e.target.value)}
        />

        <p className="create-informasi" htmlFor={`pembayaran`}>Pembayaran : </p>
        <input 
            type="number" 
            id={`pembayaran`}
            name="pembayaran"
            value={pembayaran}
            onChange={(e) => setPembayaran(e.target.value)}
        />

        <p className="create-informasi" htmlFor={`jns_pembayaran`}>Jenis Pembayaran : </p>
        <input 
            type="text" 
            id={`jns_pembayaran`}
            name="jns_pembayaran"
            value={jns_pembayaran}
            onChange={(e) => setJenisPembyaran(e.target.value)}
        />

        <p className="create-informasi" htmlFor={`kembalian`}>Kembalian : </p>
        <input 
            type="number" 
            id={`kembalian`}
            name="kembalian"
            value={kembalian}
            onChange={(e) => setKembalian(e.target.value)}
        />
        </form>
        
        {/* Form bon */}

        <div className="create-bon-grid" >
            {formFields.map((form, index) => (
                <div className="create-bon-card-container" key={index}>
                <form className="create-bon-card" onSubmit={(e) => submit(e, index)}>
            <div key={index}>

                <form className='title'>
                <h2 align="center" >Pelayanan : {index + 1}</h2>
                </form>

                {/* Data kedua nama pelayanan */}
                <p  className="create-bon-fc">Nama Pelayanan</p>
                <select className={`form-control custom-select`}
                id={`sel1`}
                name="nama" // Tambahkan name sesuai field yang ingin diubah
                value={form.nama} // Tambahkan value dari state formFields
                onChange={(event) => handleFormChange(event, index)}
                >
                <option className="create-bon" value="default">Pilih Pelayanan</option>
                {namapelayananOption.map((namapelayanan, optionIndex) => (
                    <option key={optionIndex} value={namapelayanan}>
                    {namapelayanan}
                    </option>
                ))}
                </select>

                <p className="create-bon-fc">Kategori : <span className="create-bon-fc"> {form.kategori}</span></p>
                


                {/* Data ketiga ukuran */}
                <p  className="create-bon-fc">Ukuran : </p>
                <select className={`form-control custom-select`}
                id={`sel1`}
                name="ukuran"
                value={form.ukuran}
                onChange={(event) => handleFormChange(event, index)}
                >
                <option className="create-bon" value="default">Pilih Ukuran</option>
                {ukuranOptions.map((ukuran, optionIndex) => {
                    const selectedKategori = kategoriOptions.find(item => item.nama === form.nama);
                    if (
                    (selectedKategori && selectedKategori.kategori === 'Kiloan' && ukuran === 'Berat') ||
                    (selectedKategori && selectedKategori.kategori === 'Satuan' && ukuran !== 'Berat')
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
                <p  className="create-bon-fc">Pengerjaan</p>
                <select className={`form-control custom-select`}
                id={`sel1`}
                name="pengerjaan"
                value={form.pengerjaan}
                onChange={(event) => handleFormChange(event, index)}
                >
                <option value="default">Pilih Pengerjaan </option>
                {pengerjaanOptions.map((pengerjaan, optionIndex) => (
                    <option key={optionIndex} value={pengerjaan}>
                    {pengerjaan}
                    </option>
                ))}
                </select>

                
                <br></br>
                <br></br>
                {/* Data kelima jml */}
                <p  className='create-bon' htmlFor={`jml${index}`}>Jumlah : </p>
                <input 
                type="number" 
                id={`jml${index}`}
                name="jml"
                value={form.jml}
                onChange={event => handleFormChange(event, index)}
                disabled={form.kategori !== 'Satuan' || form.ukuran == '' || form.pengerjaan == ''}
                />

                {/* Data keenam berat */}
                <p  className='create-bon' htmlFor={`berat${index}`}>Berat : </p>
                <input 
                type="number" 
                id={`berat${index}`}
                name="berat"
                value={form.berat}
                onChange={event => handleFormChange(event, index)}
                disabled={form.kategori !== 'Kiloan' || form.ukuran == '' || form.pengerjaan == ''}
                />


                {/* Data ketujuh harga */}
                <p className='create-bon' htmlFor={`harga${index}`}>Harga : </p>
                <input 
                type="number" 
                id={`harga${index}`}
                name="harga"
                value={form.harga}
                onChange={event => handleFormChange(event, index)}
                />

                {/* Data kedelapan total */}
                <p className='create-bon' htmlFor={`ttl${index}`}>Total : </p>
                <input 
                type="number" 
                id={`ttl${index}`}
                name="ttl"
                value={form.ttl}
                onChange={event => handleFormChange(event, index)}
                />

                <button type="button" onClick={() => removeFields(index)} className="remove-button">Remove</button>
                {index === formFields.length - 1 && (<button type="button" onClick={addFields} className="add-button">
                    Add more
                    </button>)}
            </div>
            </form>
        </div>
            ))}
        </div>
        <button className="submittransaksi" onClick={submit}>Submit</button>
    </div>
    );
}

export default MembuatTransaksi
