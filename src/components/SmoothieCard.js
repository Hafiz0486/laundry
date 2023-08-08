import supabase from "../config/supabaseClient"
import { Link } from 'react-router-dom'
import moment from "moment/moment"

const BonCard = ({ bon, onDelete }) => {

  const handleDelete = async () => {
    const { data, error } = await supabase
      .from('bon')
      .delete()
      .eq('id', bon.id)
    
    if (error) {
      console.log(error)
    }
    if (data) {
      console.log(data)
      onDelete(bon.id)
    }

  }

  var tanggal_datang = moment(bon.tgl_masuk).format("DD MMMM YYYY");

  // Cek tanggal ambil jika sudah diambil atau belum
  if (bon.tgl_ambil == null) {
    var tanggal_diambil = "Belum diambil"
  } 
  else {
    var tanggal_diambil = moment(bon.tgl_ambil).format("DD MMMM YYYY");
  }

  var idr = (bon.harga).toLocaleString('en-IN', { 
		style: 'currency', 
		currency: 'IDR' 
  });

  return (
    <div className="smoothie-card">
      <h3>Nama : {bon.nama}</h3>
      <p>Pelayanan : {bon.pelayanan}</p>
      <p>Tanggal datang : {tanggal_datang}</p>
      <p>Tanggal datang : {tanggal_diambil}</p>
      <p></p>
      <p>Total harga : {idr}</p>
      <div className="rating">{bon.kg}</div>
      <div className="buttons">
        <Link to={"/" + bon.id}>
          <i className="material-icons">edit</i>
        </Link>
        <i className="material-icons" onClick={handleDelete}>delete</i>
      </div>
    </div>
  )
}

export default BonCard
