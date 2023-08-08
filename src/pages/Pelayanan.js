import supabase from '../config/supabaseClient'
import { useEffect, useState } from 'react'

// components
import ServiceCard from '../components/ServiceCard'

const Home = () => {
  const [fetchError, setFetchError] = useState(null)
  const [services, setServices] = useState(null)

  const handleDelete = (id) => {
    setServices(prevServices => {
      return prevServices.filter(sm => sm.id !== id)
    })
  }

  // Mengambil data dari table bon
  useEffect(() => {
    const fetchServices = async () => {
      const { data, error } = await supabase
        .from('pelayanan')
        .select()
      
      if (error) {
        setFetchError('Could not fetch the smoothies')
        setServices(null)
      }
      if (data) {
        setServices(data)
        setFetchError(null)
      }
    }

    fetchServices()

  }, [])

  return (
    <div className="page home">
      {fetchError && (<p>{fetchError}</p>)}
      {services && (
        <div className="services">
          <div className="laundry-grid">
            {services.map(pelayanan => (
              <ServiceCard key={pelayanan.id} pelayanan={pelayanan} onDelete={handleDelete} />
            ))}
          </div>
        </div>
      )}
    </div>
  )
}

export default Home
