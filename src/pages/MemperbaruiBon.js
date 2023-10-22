import { useEffect, useState } from 'react';
import { useParams, useNavigate, Link } from "react-router-dom"
import supabase from "../config/supabaseClient"

const MemperbaruiBon = () => {
    // variable yng dibutuhkan
    const { pages, id_transaksi, id } = useParams();

    const [nama, setNama] = useState('')
    const [kategori, setKategori] = useState([])
    const [ukuran, setUkuran] = useState('')
    const [pengerjaan, setPengerjaan] = useState('')
    const [jumlah, setJumlah] = useState(0)
    const [berat, setBerat] = useState(0)
    const [harga, setHarga] = useState(0)
    const [total, setTotal] = useState(0)
    const [id_pelayanan, setIdPelayanan] = useState(0)

    const [namaOptions, setNamaOptions] = useState([]);
    const [perbandingan, setPerbandingan] =useState(0);
    const [ukuranOptions, setUkuranOptions] = useState([]); 

    const [hargaPerUnit, setHargaPerUnit] = useState(0);
    const [update, setUpdate] = useState('')

    const navigate = useNavigate()

    const [totalkeseluruhan, setTotalKeseluruhan] = useState(0)
    const [totalawal, setTotalAwal] = useState(0)

    
    useEffect(() => {

        setUpdate(
            ((new Date()).toISOString()).toLocaleString('id-ID')
          )
        
        async function fetchNamaOptions() {
            const { data, error } = await supabase
                .from('pelayanan')
                .select('nama')
                .order('id');
            if (error) {
                console.error('Error fetching nama pelayanan options:', error);
            } else {
                const uniqueNamaOptions = [...new Set(data.map(item => item.nama))]
                setNamaOptions(uniqueNamaOptions);
            }
            }

        async function fetchTotalKeseluruhan() {
            const { data, error } = await supabase
                .from('transaksi')
                .select('ttl_keseluruhan')
                .eq('id', id_transaksi)
                .single();
            if (error) {
                console.error('Error fetching nama pelayanan options:', error);
            } else {
                setTotalKeseluruhan(data.ttl_keseluruhan)
            }
        }

        fetchTotalKeseluruhan()
        fetchNamaOptions()
    }, [])
    
    useEffect(() => {
        
        // Fetch the hargaPerUnit based on selected nama, ukuran, and pengerjaan
        async function fetchHargaPerUnit() {
            if (nama && ukuran && pengerjaan) {
                const { data, error } = await supabase
                    .from('pelayanan')
                    .select('id, harga')
                    .eq('nama', nama)
                    .eq('ukuran', ukuran)
                    .eq('pengerjaan', pengerjaan);

                if (error) {
                    console.error('Error fetching harga per unit:', error);
                } else if (data.length > 0) {
                    setHargaPerUnit(data[0].harga);
                    setIdPelayanan(data[0].id); 
                } else {
                    // Set hargaPerUnit to 0 if no matching data found
                    setHargaPerUnit(0);
                    setIdPelayanan(0)
                }
            } else {
                // Set hargaPerUnit to 0 if any of the selection is missing
                setHargaPerUnit(0);
            }
        }

        fetchHargaPerUnit();
    }, [nama, ukuran, pengerjaan]);

    useEffect(() => {
        
        // Calculate the total based on selected kategori, harga/berat, and jumlah
        let calculatedTotal = 0;

        if (kategori === 'Satuan') {
            calculatedTotal = hargaPerUnit * jumlah;
        } else if (kategori === 'Kiloan') {
            calculatedTotal = hargaPerUnit * berat;
        }

        setTotal(calculatedTotal);
    }, [kategori, hargaPerUnit, jumlah, berat]);

    
    useEffect(() => {
        
        // Fetch ukuran options based on selected nama
        async function fetchUkuranOptions(selectedNama) {
            const { data, error } = await supabase
                .from('pelayanan')
                .select('ukuran')
                .eq('nama', selectedNama);
            if (error) {
                console.error('Error fetching ukuran options:', error);
            } else {
                const uniqueUkuranOptions = [...new Set(data.map(item => item.ukuran))];
                setUkuranOptions(uniqueUkuranOptions);
            }
            
        }

        async function fetchKategori(selectedNama) {
            const { data, error } = await supabase
                .from('pelayanan')
                .select('nama, kategori')
                .eq('nama', selectedNama)

            if (error) {
                console.error('Error fetching ukuran options:', error);
            } else {
                // setKategori(data.kategori);
                const uniqueCategories = [...new Set(data.map(item => item.kategori))];
                setKategori(uniqueCategories.length > 0 ? uniqueCategories[0] : ''); 
            }
        }

        // Update ukuran options when nama changes
        if (nama) {
            fetchUkuranOptions(nama)
            fetchKategori(nama);
        } else {
            // Reset ukuran options if no nama is selected
            setUkuranOptions([]);
            fetchKategori('');
        }
    }, [nama]); // Trigger when nama changes

    const handleSubmit = async (e) => {
    e.preventDefault()

    // Fungsi update bon
    // FUngsi update transaksi

    var queryBon = { id_pelayanan, jumlah, berat, total, update}

    async function updateBon() {
        const { data, error } = await supabase
        .from('bon')
        .update(queryBon)
        .eq('id', id)
    
        if (error) {
            console.error('Error inserting data:', error);
            } 
        if (data) {
            console.log('Data inserted:', data);
            console.log(queryBon)
            }
        }

    var ttl_keseluruhan = totalkeseluruhan - perbandingan

    var transaksiQuery = {ttl_keseluruhan}

    async function updateTransaksi() {
        
        const { dataTransaksi, errorTransaksi } = await supabase
        .from('transaksi')
        .update(transaksiQuery)
        .eq('id', id_transaksi)
        .single()

        if (errorTransaksi) {
            console.error('Error inserting data:', errorTransaksi);
            } 
            if (errorTransaksi) {
            console.log('Data inserted:', dataTransaksi);
            console.log(transaksiQuery)
            }
    }

    
    updateBon()
    updateTransaksi()
    {} 
    navigate("/transaksi-" + id_transaksi + "/bon", { replace: true })
    // Akhir dari fungsi submit
    }

    useEffect(() => {
        async function fetchBonData() {
            const { data, error } = await supabase
                .from('bon')
                .select('*')
                .eq('id', id)
                .single();

            if (error) {
                console.error('Error fetching bon data:', error);
            } 
            if (data) {

                setJumlah(data.jumlah)
                setBerat(data.berat)
                setTotal(data.total)
                setTotalAwal(data.total)

                const { data: pelayananData, error: pelayananError } = await supabase
                .from("pelayanan")
                .select()
                .eq("id", data.id_pelayanan)
                .single();

                if (pelayananError) {

                }

                if (pelayananData) {
                    setNama(pelayananData.nama)
                    setKategori(pelayananData.kategori)
                    setUkuran(pelayananData.ukuran)
                    setPengerjaan(pelayananData.pengerjaan)
                    setHarga(pelayananData.harga)
                }

            }
        }

        fetchBonData();
        
    }, [id_transaksi, id]);
    
    useEffect(() => {
        const difference = totalawal - total;
        setPerbandingan(difference);
        console.log(difference)
    }, [total]);

    return(
        
        <div className="transaksi">

        

            <div className="create-bon-card-container">
            <form className="create-bon-card" onSubmit={handleSubmit}>
            <div className="tombol-kembali">
            <Link to={"/transaksi-" + id_transaksi + "/bon"} className="membuat-pelayanan">Kembali</Link>
            </div>

            <p className="title">Pelayanan</p>

            <div className='title'>

            <h2 align="center" >Id Transaksi {id_transaksi} Id Bon {id} </h2>

            </div>

            <p  className="create-bon-fc">Nama Pelayanan</p>
            <select className={`form-control custom-select`}
            id={`sel1`}
            name="nama" // Tambahkan name sesuai field yang ingin diubah
            value={nama} // Tambahkan value dari state formFields
            onChange={(e) => {
                setNama(e.target.value);
                setJumlah(0)  // Set jumlah menjadi 0 saat nama berubah
                setBerat(0)
                setUkuran('default')
                setPengerjaan('default')   // Set berat menjadi 0 saat nama berubah
            }}
            >
            <option className="create-bon" value="default">Pilih Pelayanan</option>
            {namaOptions.map((option, index) => (  // Updated variable name here
                <option key={index} className="create-bon" value={option}>
                    {option}
                </option>
            ))}
            </select>

            <p className="create-bon-fc">Kategori : <span className="create-bon-fc"> {kategori}</span></p>

            <p  className="create-bon-fc">Ukuran</p>
            <select
                className={`form-control custom-select`}
                id={`sel1`}
                name="ukuran"
                value={ukuran}
                onChange={(e) => setUkuran(e.target.value)}
            >
                <option className="create-bon" value="default">Pilih Ukuran</option>
                {ukuranOptions.map((option, index) => (
                    <option key={index} className="create-bon" value={option}>
                        {option}
                    </option>
                ))}
            </select>

            <p  className="create-bon-fc">Nama Pengerjaan</p>
            <select className={`form-control custom-select`}
            id={`sel1`}
            name="pengerjaan" // Tambahkan name sesuai field yang ingin diubah
            value={pengerjaan} // Tambahkan value dari state formFields
            onChange={(e) => setPengerjaan(e.target.value)}
            >
            <option className="create-bon" value="default">Pilih Pengerjaan</option>
            <option className="create-bon" value="Normal">Normal</option>
            <option className="create-bon" value="Express">Express</option>
            </select>
            
            <br></br>
            <p className='create-bon' htmlFor={`jumlah`}>Jumlah : </p>
            <input 
            type="number" 
            id={`jumlah`}
            name="jumlah"
            value={jumlah}
            onChange={(e) => setJumlah(e.target.value)}
            disabled={kategori !== 'Satuan' || ukuran == '' || pengerjaan == ''}
            />

            <p className='create-bon' htmlFor={`berat`}>Berat : </p>
            <input 
            type="number" 
            id={`berat`}
            name="berat"
            value={berat}
            onChange={(e) => setBerat(e.target.value)}
            disabled={kategori !== 'Kiloan' || ukuran == '' || pengerjaan == ''}
            />

            <p className='create-bon' htmlFor={`harga`}>Harga : </p>
            <input 
                type="number" 
                id={`harga`}
                name="harga"
                value={hargaPerUnit}
                onChange={(e) => setHargaPerUnit(e.target.value)}
                disabled
            />

            <p className='create-bon' htmlFor={`total`}>Total : </p>
            <input 
            type="number" 
            id={`total`}
            name="total"
            value={total}
            onChange={(e) => setTotal(e.target.value)}
            />

            <button>Memperbarui Data Bon</button>
  

            </form>
            
            </div>
            
        </div>
    )

}

export default MemperbaruiBon