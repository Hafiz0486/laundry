  import supabase from "../config/supabaseClient"
  import { Link } from 'react-router-dom'
  import { useEffect, useState } from 'react'

  // pages adalah table
  // tablequery adalah query table dari pages
  const Kartu = ({ table, pages, onDelete }) => {
    const [pelayananData, setPelayananData] = useState(null);
    const [fetchPelayananError, setFetchPelayananError] = useState(null);


    const [tables, setTables] = useState(null)
    const [fetchError, setFetchError] = useState(null)

    useEffect(() => {
      async function fetchPelayananData() {
        const { data, error } = await supabase
          .from('pelayanan')
          .select('id, nama, pengerjaan')
          .eq('id', table.id_pelayanan);
  
        if (error) {
          setPelayananData(null);
          setFetchPelayananError('Could not fetch the service data');
        }
        if (data) {
          setPelayananData(data[0]); // Ambil hanya data pertama karena menggunakan id unik
          setFetchPelayananError(null);
        }
      }
  
      fetchPelayananData();
    }, [table.id_pelayanan]);

    const handleDelete = async () => {
      const { data, error } = await supabase
        .from(pages)
        .delete()
        .eq('id', table.id)
      
      if (error) {
        console.log(error)
      }
      if (data) {
        console.log(data)
        onDelete(table.id)
      }

    }
    
    if (pages === 'pelayanan') {
      var idr = (table.harga).toLocaleString('en-IN', { 
        style: 'currency', 
        currency: 'IDR' 
      });
      return (
        <div className="laundry-card-pelayanan">
          <img src="https://jurnalpost.com/wp-content/uploads/2022/07/tips-beli-sepatu.jpg" alt="pelayanan" width="100%" height="50%"></img>
          <h4>Pelayanan : {table.nama}</h4>
          <p class="card-pelayanan">kategori : {table.kategori}</p>
          <p class="card-pelayanan">Ukuran : {table.ukuran}</p>
          <p class="card-pelayanan">Harga : {idr}</p>
          <div className="rating">{table.pengerjaan}</div>
          <div className="buttons">
            <Link to={"/laundry/" + pages + "/bon-" + table.id}>
              <i className="material-icons">edit</i>
            </Link>
            <i className="material-icons" onClick={handleDelete}>delete</i>
          </div>
        </div>
      )
    } 

    if (pages === 'transaksi') {
      var idr = (table.ttl_keseluruhan).toLocaleString('en-IN', { 
        style: 'currency', 
        currency: 'IDR' 
      });
      return (
        <div className="laundry-card-bon">
          <p>Nama : {table.nama}</p>
          <p>Tanggal Datang : {table.tgl_datang}</p>
          <p>Tanggal Ambil : {table.tgl_ambil}</p>
          <p>Total Keseluruhan : {idr}</p>
          <p>Pembayaran : {table.pembayaran}</p>
          <p>Jenis Pembayaran : {table.jns_pembayaran}</p>
          <p>Kembalian : {table.kembalian}</p>
          <div className="buttons">

            <Link to={"/laundry/transaksi-" + table.id+"/bon"}>
              <i className="material-icons">edit</i>
            </Link>

            <i className="material-icons" onClick={handleDelete}>delete</i>
          </div>
        </div>
      )
    }
    if (pages === 'bon') {
      var totalidr = (table.total).toLocaleString('en-IN', { 
        style: 'currency', 
        currency: 'IDR' 
      });
      if (table.tgl_ambil == null) {
        var progress = 'Belum Selesai'
      } else {
        var progress = table.tgl_ambil
      }
      return (
        <div className="laundry-card-bon">
          <div className={`progress ${progress === 'Belum Selesai' ? 'belum' : 'selesai'}`}>
          {progress}
          </div>
          <p>Status : </p>
          <p>Nama : {table.nama_konsumen}</p>
          {pelayananData && (
          <div>
            <p>Nama Pelayanan : {pelayananData.nama}</p>
            <div className={`rating ${pelayananData.pengerjaan === 'Express' ? 'Express' : 'Normal'}`}>
          {pelayananData.pengerjaan}
          </div>

          </div>
          )}
          <p>Jumlah : {table.jml}</p>
          <p>Tanggal ambil : {table.tgl_ambil}</p>
          <p>Berat : {table.berat}</p>
          <p>Total : {totalidr}</p>
          <p>Pembayaran : {table.pembayaran}</p>
          <p>Jenis Pembayaran : {table.jns_pembayaran}</p>
          <p>Kembalian : {table.kembalian}</p>
          
          <div className="buttons">
            <Link to={"/laundry/transaksi-" + table.id+"/bon"}>
              <i className="material-icons">edit</i>
            </Link>
            <i className="material-icons" onClick={handleDelete}>delete</i>
          </div>
        </div>
      );
    }
    
  }

  export default Kartu
