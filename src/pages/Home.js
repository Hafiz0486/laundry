import supabase from '../config/supabaseClient'
import { useEffect, useState } from 'react'

// components
import BonCard from '../components/BonCard'

const Home = () => {
  const [fetchError, setFetchError] = useState(null)
  const [bons, setBons] = useState(null)
  const [orderBy, setOrderBy] = useState('dibuat')

  const handleDelete = (id) => {
    setBons(prevBons => {
      return prevBons.filter(sm => sm.id !== id)
    })
  }

  // Mengambil data dari table bon
  useEffect(() => {
    const fetchBons = async () => {
      const { data, error } = await supabase
        .from('bon')
        .select()
        .order(orderBy, {ascending: false})
      
      if (error) {
        setFetchError('Could not fetch the smoothies')
        setBons(null)
      }
      if (data) {
        setBons(data)
        setFetchError(null)
      }
    }

    fetchBons()

  }, [orderBy])

  return (
    <div className="page home">
      {fetchError && (<p>{fetchError}</p>)}
      {bons && (
        <div className="bon">

          <div className="order-by" >
            <p class="order-by">Order by:</p>
            <button onClick={() => setOrderBy('dibuat')}>Dibuat</button>
            <button onClick={() => setOrderBy('nama')}>Nama</button>
            <button onClick={() => setOrderBy('kg')}>Kg</button>
          </div>

          <div className="laundry-grid">
            {bons.map(bon => (
              <BonCard key={bon.id} bon={bon} onDelete={handleDelete} />
            ))}
          </div>
        </div>
      )}
    </div>
  )
}

export default Home
