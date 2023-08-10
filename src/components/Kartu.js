import supabase from "../config/supabaseClient"
import { Link } from 'react-router-dom'
import moment from "moment/moment"

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

  if (pages == 'bon') {

    tanggal_diambil = table.tgl_ambil

    // Cek tanggal ambil jika sudah diambil atau belum
    if (table.tgl_ambil == null) {
      var tanggal_diambil = "Belum diambil"
    } 

    var idr = (table.harga).toLocaleString('en-IN', { 
      style: 'currency', 
      currency: 'IDR' 
    });

  }
  
  if (pages == 'pelayanan') {
    var idr = (table.harga).toLocaleString('en-IN', { 
      style: 'currency', 
      currency: 'IDR' 
    });
  }
  
  if (pages == 'bon') {
    return (
      <div className="laundry-card">
        <h3>Nama : {table.nama}</h3>
        <p>Pelayanan : {table.pelayanan}</p>
        <p>Tanggal datang : {table.tgl_masuk}</p>
        <p>Tanggal datang : {tanggal_diambil}</p>
        <p></p>
        <p>Total harga : {idr}</p>
        <div className="rating">{table.kg}</div>
        <div className="buttons">
          <Link to={"/"+ pages +"/memperbarui-" + table.id}>
            <i className="material-icons">edit</i>
          </Link>
          <i className="material-icons" onClick={handleDelete}>delete</i>
        </div>
      </div>
    )
  } 
  
  if (pages == 'pelayanan') {
    return (
      <div className="laundry-card">
        <img src="https://jurnalpost.com/wp-content/uploads/2022/07/tips-beli-sepatu.jpg" alt="pelayanan" width="100%" height="50%"></img>
        <h4>Pelayanan : {table.nama}</h4>
        <p class="card">Ukuran : {table.ukuran}</p>
        <p class="card">Harga : {idr}</p>
        <div className="buttons">
          <Link to={"/" + pages + "/memperbarui-" + table.id}>
            <i className="material-icons">edit</i>
          </Link>
          <i className="material-icons" onClick={handleDelete}>delete</i>
        </div>
      </div>
    )
  }
  
}

export default Kartu
