import ImageModal from "../components/ImageModal"
import { useState
 } from "react"


const CDNURL = "https://gomqdnsdzpqgypcdvbnt.supabase.co/storage/v1/object/public/img/home/"

const Home = () => {
  const [brosur, setBrosur] = useState(null)

  const imgBrosur = brosur ? CDNURL + brosur : CDNURL + 'Brosur Laundry.png';
  const img1 = brosur ? CDNURL + brosur : CDNURL + 'Depan Rumah.jpg';
  const img2 = brosur ? CDNURL + brosur : CDNURL + 'Bagian 1.jpg';
  const img3 = brosur ? CDNURL + brosur : CDNURL + 'Bagian 2.jpg';

  return(
    <div>
      <div>
        <img
          className="brosur"
          src={imgBrosur}
          width="25%"
          height="25%"
        />
      </div>
      <div>
        <img
          className="brosur"
          src={img1}
          width="25%"
          height="25%"
        />

        <img
          className="brosur"
          src={img2}
          width="25%"
          height="25%"
        />

        <img
          className="brosur"
          src={img3}
          width="25%"
          height="25%"
        />
      </div>
    </div>
        
  )
}

export default Home