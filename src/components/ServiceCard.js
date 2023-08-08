import supabase from "../config/supabaseClient"
import { Link } from 'react-router-dom'

const ServiceCard = ({ pelayanan, onDelete }) => {

  const handleDelete = async () => {
    const { data, error } = await supabase
      .from('pelayanan')
      .delete()
      .eq('id', pelayanan.id)
    
    if (error) {
      console.log(error)
    }
    if (data) {
      console.log(data)
      onDelete(pelayanan.id)
    }

  }

  var idr = (pelayanan.harga).toLocaleString('en-IN', { 
		style: 'currency', 
		currency: 'IDR' 
  });

  return (
    <div className="servicecard-type1">
      <img src="https://jurnalpost.com/wp-content/uploads/2022/07/tips-beli-sepatu.jpg"></img>
      <h3>Nama : {pelayanan.nama}</h3>
      <p>Pelayanan : {pelayanan.ukuran}</p>
      <p></p>
      <p>Total harga : {idr}</p>
      <div className="buttons">
        <Link to={"/" + pelayanan.id}>
          <i className="material-icons">edit</i>
        </Link>
        <i className="material-icons" onClick={handleDelete}>delete</i>
      </div>
    </div>
  )
}

export default ServiceCard
