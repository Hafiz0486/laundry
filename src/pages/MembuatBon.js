import { useEffect, useState } from 'react';
import { useParams, useNavigate, Link } from "react-router-dom"
import supabase from "../config/supabaseClient"

const MembuatBon = () => {
    // variable yng dibutuhkan

    const { pages, id_transaksi } = useParams();

    const navigate = useNavigate()
    const [tables, setTables] = useState(null)
    const [fetchError, setFetchError] = useState(null)

    const [ttl_awal, setTotalAwal] = useState()
    const [ttl_keseluruhan, setTotalKeseluruhan] = useState('')

    const [idPelayananOptions, setIdPelayananOptions] = useState([]);
    const [ukuranOptions, setUkuranOptions] = useState([]);
    const [namapelayananOption, setNamaPelayananOptions] = useState([]);
    const [kategoriOptions, setKategoriOptions] = useState([]);
    const [pengerjaanOptions, setPengerjaanOptions] = useState([]);
    const [hargaOptions, setHargaOptions] = useState([]);

    // Tambahkan state untuk opsi ukuran berdasarkan nama pelayanan
    const [ukuranOptionsByNama, setUkuranOptionsByNama] = useState({});

    // variable array
    const [formFields, setFormFields] = useState([
        { nama: '', kategori: '', ukuran: '', pengerjaan: '', jumlah: '', berat: '', harga: '', total: '' }
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

        async function fetchTransaksi() {
            const { data, error } = await supabase
                .from('transaksi')
                .select()
                .eq('id', id_transaksi);
            
            if (error) {
                setFetchError('Could not fetch the bon');
                setTables(null);
            }
            if (data) {
                setTables(data);
                setFetchError(null);
                setTotalAwal(data[0]?.ttl_keseluruhan || 0); // Set ttl_keseluruhan here
            }
        }
      
        // pemanggiln atau menjalankan fungsi yang sudah dibuat
        fetchTransaksi()
        fetchNamaPelayananOptions();
        fetchHargaOptions();
        fetchKategoriOptions();
        fetchUkuranOptions();
        fetchPengerjaanOptions();
    }, [id_transaksi]);

    async function fetchUkuranOptionsByNama(namaPelayanan) {
        const { data, error } = await supabase
            .from('pelayanan')
            .select('ukuran')
            .filter('nama', 'eq', namaPelayanan);

        if (error) {
            console.error(`Error fetching ukuran options for ${namaPelayanan}:`, error);
        } else {
            const uniqueUkuran = [...new Set(data.map(item => item.ukuran))];
            setUkuranOptionsByNama(prevState => ({ ...prevState, [namaPelayanan]: uniqueUkuran }));
        }
    }

    // fungsi agar pengguna dapat melakukan penginputan data
    const handleFormChange = (event, index) => {
        const newData = [...formFields];
        newData[index][event.target.name] = event.target.value;

        const selectedNamaPelayanan = newData[index].nama;
        const selectedUkuran = newData[index].ukuran;
        const selectedPengerjaan = newData[index].pengerjaan;
        const selectedBerat = newData[index].berat;
        const selectedJumlah = newData[index].jumlah;

        // Cari harga yang sesuai dari tabel pelayanan
        const hargaData = hargaOptions.find(
        item =>
            item.nama === selectedNamaPelayanan &&
            item.ukuran === selectedUkuran &&
            item.pengerjaan === selectedPengerjaan
        );

        if (selectedNamaPelayanan) {
            fetchUkuranOptionsByNama(selectedNamaPelayanan);
        }

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
            newData[index].jumlah = 0;
            newData[index].berat = selectedBerat;
            newData[index].total = defaultHarga * selectedBerat;
        } else {
            newData[index].berat = 0;
            newData[index].jumlah = selectedJumlah;
            newData[index].total = defaultHarga * selectedJumlah;
        }
        }

        newData[index].total = calculateRowTotal(newData[index]);

        // Calculate the overall "Total Keseluruhan"
        const totalKeseluruhan = newData.reduce((total, row) => total + row.total, 0);
        setTotalKeseluruhan(totalKeseluruhan);

        // var trydate = new Date

        // console.log("Selected:", selectedNamaPelayanan, selectedUkuran, selectedPengerjaan);
        // console.log("Harga Data:", hargaData);
        // console.log("New Data:", newData);
        // console.log("nama konsumen", nama, 
        // "total keseluruhan ", ttl_keseluruhan, 
        // "pembayaran", pembayaran, 
        // "jenis pembayaran", jns_pembayaran, 
        // "kembalian", kembalian,
        // "date", trydate.toISOString().split('T')[0])
        setFormFields(newData);
    }

    const submit = async (e) => {
        e.preventDefault();

        console.log("total awal", ttl_awal)
        console.log("total keseluruhan", ttl_keseluruhan)

        var ttl_akhir = ttl_keseluruhan + ttl_awal

        console.log("Total akhir", ttl_akhir)

        var queriesTransaksi = {ttl_keseluruhan : ttl_akhir}
        
        const { dataTransaksi, errorTransaksi } = await supabase
            .from('transaksi')
            .update([queriesTransaksi])
            .eq('id', id_transaksi)

            if (errorTransaksi) {
            console.error('Error inserting data:', errorTransaksi);
            } else {
            console.log('Data inserted:', dataTransaksi);
        
        }

        async function createQueriesBon() {
        
            const queriesBon = formFields.map(item => ({ 
            id_pelayanan: item.id_pelayanan,
            jumlah: item.jumlah,
            berat: item.berat,
            total: item.total,
            id_transaksi: id_transaksi,
            }));
        
        return queriesBon;
   
        }

        async function insertDataToSupabase() {
            const queriesBon = await createQueriesBon();
            
            if (queriesBon !== null) {
                const { dataBon, errorBon } = await supabase
                .from('bon')
                .insert(queriesBon);
            
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
            navigate("/transaksi-" + id_transaksi + "/bon");

    }

    const addFields = () => {
        const object = {
        nama: '',
        kategori: '',
        ukuran: '', // Ganti dengan ukuran default yang diinginkan
        pengerjaan: '',
        jumlah: '',
        berat: '',
        harga: '',
        total: ''
        };
        setFormFields([...formFields, object]);
    }  

const removeFields = (index) => {
    // Cek apakah ada lebih dari satu form sebelum mengizinkan penghapusan
    if (formFields.length > 1) {
        const newData = [...formFields];
        const removedRow = newData.splice(index, 1)[0];
        setFormFields(newData);

        // Calculate the new total after removing the row
        const newTotalKeseluruhan = ttl_keseluruhan - removedRow.total;
        setTotalKeseluruhan(newTotalKeseluruhan);
    }
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
            return row.jumlah * row.harga;
        }
        };
        

return (
    
<div className="transaksi">
    
    {/* Form bon */}

    <div className="create-bon-grid" >
        {formFields.map((form, index) => (
            <div className="create-bon-card-container" key={index}>
            <form className="create-bon-card" onSubmit={(e) => submit(e, index)}>
        <div key={index}>

            <div className='title'>
            <h2 align="center" >{id_transaksi} Pelayanan : {index + 1}</h2>
            </div>

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
            <select
            className={`form-control custom-select`}
            id={`sel1`}
            name="ukuran"
            value={form.ukuran}
            onChange={(event) => handleFormChange(event, index)}
            >
            <option value="default">Pilih Ukuran</option>
            {ukuranOptionsByNama[form.nama]?.map((ukuran, optionIndex) => (
                <option key={optionIndex} value={ukuran}>
                    {ukuran}
                </option>
            ))}
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
            {/* Data kelima jumlah */}
            <p  className='create-bon' htmlFor={`jumlah${index}`}>Jumlah : </p>
            <input 
            type="number" 
            id={`jumlah${index}`}
            name="jumlah"
            value={form.jumlah}
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
            <p className='create-bon' htmlFor={`total${index}`}>Total : </p>
            <input 
            type="number" 
            id={`total${index}`}
            name="total"
            value={form.total}
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

export default MembuatBon
