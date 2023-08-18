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

    // useEffect(() => {
    //   async function fetchPelayananData() {
    //     const { data, error } = await supabase
    //       .from('pelayanan')
    //       .select('id, nama, pengerjaan')
    //       .eq('id', table.id_pelayanan);
  
    //     if (error) {
    //       setPelayananData(null);
    //       setFetchPelayananError('Could not fetch the service data');
    //     }
    //     if (data) {
    //       setPelayananData(data[0]); // Ambil hanya data pertama karena menggunakan id unik
    //       setFetchPelayananError(null);
    //     }
    //   }
  
    //   fetchPelayananData();
    // }, [table.id_pelayanan]);

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
          <img src="" alt="pelayanan" width="100%" height="50%"></img>
          <h4>Pelayanan : {table.nama}</h4>
          <p className="card-pelayanan">kategori : {table.kategori}</p>
          <p className="card-pelayanan">Ukuran : {table.ukuran}</p>
          <p className="card-pelayanan">Harga : {idr}</p>
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

      if (table.pembayaran == null) {
        var idrpembayaran =(0).toLocaleString('en-IN', { 
          style: 'currency', 
          currency: 'IDR' 
        });
      } else {
        idrpembayaran = (table.pembayaran).toLocaleString('en-IN', { 
          style: 'currency', 
          currency: 'IDR' 
        });
      }

      if (table.ttl_keseluruhan == null) {
        var idrtotalkeseluruhan =(0).toLocaleString('en-IN', { 
          style: 'currency', 
          currency: 'IDR' 
        });
      } else {
        idrtotalkeseluruhan = (table.ttl_keseluruhan).toLocaleString('en-IN', { 
          style: 'currency', 
          currency: 'IDR' 
        });
      }

      if (table.kembalian == null) {
        var idrkembalian =(0).toLocaleString('en-IN', { 
          style: 'currency', 
          currency: 'IDR' 
        });
      } else {
        idrkembalian = (table.kembalian).toLocaleString('en-IN', { 
          style: 'currency', 
          currency: 'IDR' 
        });
      }

      return (
        <div className="laundry-card-transaksi">
          <p className="transaksi" >Nama : {table.nama}</p>
          <p className="transaksi" >Tanggal Datang : {table.tgl_datang}</p>
          <p className="transaksi" >Tanggal Ambil : {table.tgl_ambil}</p>
          <p className="transaksi" >Total : {idrtotalkeseluruhan}</p>
          <p className="transaksi" >Pembayaran : {idrpembayaran}</p>
          <p className="transaksi" >Jenis Pembayaran : {table.jns_pembayaran}</p>
          <p className="transaksi" >Kembalian : {idrkembalian}</p>
          <div className="buttons">

            <Link to={"/transaksi-" + table.id+"/bon"}>
              <i className="material-icons">star</i>
            </Link>

            <Link to={"/transaksi-" + table.id+"/bon"}>
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
      if(table.pembayaran == null) {
        var pembayaran = 'Belum Bayar'
      } else {
        var pembayaran = table.pembayaran
      }
      return (
        <div className="laundry-card-bon">
          <div className="status">Status</div>
          <div className={`progress ${progress === 'Belum Selesai' ? 'belum' : 'selesai'}`}>     
            {progress}
          </div>
          <p className="bon" >Tanggal Datang : {table.tgl_datang}</p>  
          <p className="bon" >Nama : {table.nama_konsumen}</p>
          {pelayananData && (
          <div>
            <p className="bon" >Pelayanan : {pelayananData.nama}</p>
            <div className={`rating ${pelayananData.pengerjaan === 'Express' ? 'Express' : 'Normal'}`}>
          {pelayananData.pengerjaan}
          </div>

          </div>
          )}
          <p className="bon" >Jumlah : {table.jml}</p>
          <p className="bon" >Berat : {table.berat}</p>
          <p className="bon" >Total : {totalidr}</p>
          <div className="pembayaran">Pembayaran</div>
          <div className="status-pembayaran">{pembayaran}</div>
          
          <div className="buttons">
            <Link to={"/laundry/transaksi-" + table.id+"/bon"}>
              <i className="material-icons">edit</i>
            </Link>
            <i className="material-icons" onClick={handleDelete}>delete</i>
          </div>

        </div>
      );
    }

    if (pages === 'konsumen') {
      return (
        <div className="laundry-card-konsumen">
          <img src="" alt="pelayanan" width="100%" height="50%"></img>
          <h4>Nama : {table.nama}</h4>
          <p className="card-pelayanan">No. Telepon : {table.tlp}</p>
          <p className="card-pelayanan">Jenis Kelamin : {table.kelamin}</p>
          <div className="rating">{table.keanggotaan}</div>
          <div className="buttons">
            <Link to={"/laundry/" + pages + "/bon-" + table.id}>
              <i className="material-icons">edit</i>
            </Link>
            <i className="material-icons" onClick={handleDelete}>delete</i>
          </div>
        </div>
      )
    } 
    
  }

  export default Kartu
