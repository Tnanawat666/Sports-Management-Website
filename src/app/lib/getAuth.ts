import axios from 'axios'

const fetchAuth = async () => {
  try {
    const { data } = await axios.get('/api/auth/getAuth')
    return data.auth
  } catch (error) {
    console.error(error)
    return false
  }
}

export default fetchAuth
