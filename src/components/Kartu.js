import supabase from "../config/supabaseClient"
import { Link } from 'react-router-dom'
import { useEffect, useState } from 'react'

// pages adalah table
// tablequery adalah query table dari pages
const Kartu = ({ table, pages, onDelete }) => {
  const [tables, setTables] = useState(null)
  const [fetchError, setFetchError] = useState(null)

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
  } else if (pages === 'transaksi') {
    return (
      <div className="laundry-card-bon">
        <p>Nama : {table.nama}</p>
        <p>Tanggal Datang : {table.tgl_datang}</p>
        <p>Tanggal Ambil : {table.tgl_ambil}</p>
        <p>Total Keseluruhan : {table.ttl_keseluruhan}</p>
        <p>Pembayaran : {table.pembayaran}</p>
        <p>Jenis Pembayaran : {table.jns_pembayaran}</p>
        <p>Kembalian : {table.kembalian}</p>
        <div className="buttons">

          <Link to={"/laundry/transaksi-" + table.id+"/bon"}>
            <i className="material-icons">edit</i>
          </Link>

          {/* <Link to={"/laundry/"+ pages +"/bon/memperbarui-" + table.id}>
            <i className="material-icons">edit</i>
          </Link> */}

          <i className="material-icons" onClick={handleDelete}>delete</i>
        </div>
      </div>
    )
  }
  
}

export default Kartu
