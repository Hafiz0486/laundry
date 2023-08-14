import supabase from "../config/supabaseClient"
import { Link } from 'react-router-dom'

// pages adalah table
// tablequery adalah query table dari pages
const Kartu = ({ table, pages, onDelete }) => {

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

  if (pages === 'bon') {

    // Cek tanggal ambil jika sudah diambil atau belum
    if (table.tgl_ambil === null) {
      var tanggal_diambil = "Belum diambil"
    } else {
      tanggal_diambil = table.tgl_ambil
    }

  } 

  if (pages !== 'transaksi'){
    var idr = (table.harga).toLocaleString('en-IN', { 
      style: 'currency', 
      currency: 'IDR' 
    });
  }
  
  
  if (pages === 'bon') {
    return (
      <div className="laundry-card-bon">
        <p>Nama : {table.nama}</p>
        <p>Tanggal Datang : {table.tgl_masuk}</p>
        <p>Tanggal Ambil : {tanggal_diambil}</p>
        <p>Total Keseluruhan :</p>
        <p></p>
        <p>Tanggal Pembayaran :</p>
        <p>Pembayaran :</p>
        <p>Jenis Pembayaran :</p>
        <p>Kembalian : {idr}</p>
        <div className="rating">{table.kg}</div>
        <div className="buttons">
          <Link to={"/"+ pages +"/memperbarui-" + table.id}>
            <i className="material-icons">edit</i>
          </Link>
          <i className="material-icons" onClick={handleDelete}>delete</i>
        </div>
      </div>
    )
  }  else if (pages === 'pelayanan') {
    return (
      <div className="laundry-card-pelayanan">
        <img src="https://jurnalpost.com/wp-content/uploads/2022/07/tips-beli-sepatu.jpg" alt="pelayanan" width="100%" height="50%"></img>
        <h4>Pelayanan : {table.nama}</h4>
        <p class="card-pelayanan">kategori : {table.kategori}</p>
        <p class="card-pelayanan">Ukuran : {table.ukuran}</p>
        <p class="card-pelayanan">Harga : {idr}</p>
        <div className="buttons">
          <Link to={"/" + pages + "/memperbarui-" + table.id}>
            <i className="material-icons">edit</i>
          </Link>
          <i className="material-icons" onClick={handleDelete}>delete</i>
        </div>
      </div>
    )
  } else if (pages === 'transaksi') {
    return (
      <div className="laundry-card-bon">
        <p>Nama : {table.nama}</p>
        <p>Tanggal Datang : {table.tgl_datang}</p>
        <p>Total Keseluruhan : {table.ttl_keseluruhan}</p>
        <div className="buttons">
          <Link to={"/"+ pages +"/memperbarui-" + table.id}>
            <i className="material-icons">edit</i>
          </Link>
          <i className="material-icons" onClick={handleDelete}>delete</i>
        </div>
      </div>
    )
  }
  
}

export default Kartu
