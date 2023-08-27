  import supabase from "../config/supabaseClient"
  import { useParams, Link } from 'react-router-dom'
  import { useEffect, useState } from 'react'
  import ImageModal from "../components/ImageModal"

  const CDNURL = "https://gomqdnsdzpqgypcdvbnt.supabase.co/storage/v1/object/public/img/konsumen/"
  // pages adalah table
  // tablequery adalah query table dari pages
  const Kartu = ({ table, pages, id_transaksi, onDelete }) => {
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [modalImageUrl, setModalImageUrl] = useState('');
    const [gambar1, setGambar1] = useState(null)

    console.log("CDNURL ", CDNURL,
                "Image name ", table.img1)
    const handleImageClick = (imageUrl) => {
      setModalImageUrl(imageUrl);
      setIsModalOpen(true);
    };

    const handleCloseModal = () => {
      setIsModalOpen(false);
      setModalImageUrl('');
    };
  
    const [pelayananData, setPelayananData] = useState(null);
    const [fetchPelayananError, setFetchPelayananError] = useState(null);


    const [tables, setTables] = useState(null)
    const [fetchError, setFetchError] = useState(null)

    const handleDelete = async () => {
      if(pages != 'transaksi') {
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

      if (pages == 'transaksi') {

        // Delete data bon yang memiliki id_transaksi yang akan dihapus
        const { dataBon, errorBon } = await supabase
        .from('bon')
        .delete()
        .eq('id_transaksi', table.id)
      
      if (errorBon) {
        console.log(errorBon)
      }
      if (dataBon) {
        console.log(dataBon)
        onDelete(table.id)
      }

        const { dataTransaksi, errorTransaksi } = await supabase
        .from(pages)
        .delete()
        .eq('id', table.id)
      
      if (errorTransaksi) {
        console.log(errorTransaksi)
      }
      if (dataTransaksi) {
        console.log(dataTransaksi)
        onDelete(table.id)
      }

      }

      window.location.reload();
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
          <Link to={"/" + pages + "/memperbarui-" + table.id}>
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

          <Link to={"/"+pages+"/memperbarui-" + table.id}>
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

          <Link to={"/transaksi-"+id_transaksi+"/"+pages+"/memperbarui-" + table.id}>
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

        <img
          className="image-spacing"
          src={CDNURL + table.img1}
          alt="pelayanan"
          width="48%"
          height="50%"
          onClick={() => handleImageClick(CDNURL + table.img1)}
        />
        {/* <img
          className="image-spacing"
          src={require(`../asset/img/konsumen/Pak Amin.jpg`)}
          alt="pelayanan"
          width="48%"
          height="50%"
          onClick={() => handleImageClick(require(`../asset/img/konsumen/Pak Amin.jpg`))}
        /> */}

        <h4>Nama : {table.nama}</h4>
        <p className="card-konsumen">No. Telepon : {table.tlp}</p>
        <p className="card-konsumen">Jenis Kelamin : {table.kelamin}</p>
        <div className="rating">{table.keanggotaan}</div>
        <div className="buttons">
          <Link to={"/" + pages + "/memperbarui-" + table.id}>
            <i className="material-icons">edit</i>
          </Link>
          <i className="material-icons" onClick={handleDelete}>delete</i>
        </div>

        {isModalOpen && (
          <ImageModal imageUrl={modalImageUrl} onClose={handleCloseModal} fullscreen />
        )}


      </div>
    )
  } 
    
  }

  export default Kartu
