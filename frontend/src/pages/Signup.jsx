import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import axios from 'axios'
import { useToast } from '../context/ToastContext' // ✅ Import useToast

const API_URL = import.meta.env.VITE_API_URL;

function Signup() {
  const [username, setUsername] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const navigate = useNavigate()
  const { showToast } = useToast() // ✅ Use the global toast hook

  const handleSubmit = async (e) => {
    e.preventDefault()

    try {
      const res = await axios.post('${API_URL}/api/auth/signup', {
        username,
        email,
        password,
      })

      if (res.status === 201) {
        showToast('Signup successful! 🎉', 'success') // ✅ Use toast instead of alert
        navigate('/login')
      } else {
        showToast(`Signup failed: ${res.data.error}`, 'error') // ✅ Use toast
      }
    } catch (err) {
      if (err.response) {
        showToast(`Signup failed: ${err.response.data.error}`, 'error') // ✅ Use toast
      } else if (err.request) {
        showToast('No response from server. Please try again later.', 'error') // ✅ Use toast
      } else {
        showToast('Something went wrong! 😢', 'error') // ✅ Use toast
      }
      console.error('Signup error:', err)
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-green-100 to-blue-200">
      <div className="bg-white p-8 rounded-xl shadow-lg w-full max-w-md">
        <h2 className="text-2xl font-bold mb-6 text-center text-green-600">Signup</h2>
        <form onSubmit={handleSubmit}>
          <input
            type="text"
            placeholder="Username"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            className="w-full p-3 mb-4 border rounded-md focus:outline-none focus:ring focus:ring-green-300 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
            required
          />
          <input
            type="email"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full p-3 mb-4 border rounded-md focus:outline-none focus:ring focus:ring-green-300 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
            required
          />
          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full p-3 mb-6 border rounded-md focus:outline-none focus:ring focus:ring-green-300 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
            required
          />
          <button
            type="submit"
            className="w-full bg-green-600 text-white py-3 rounded-md hover:bg-green-700 transition duration-300"
          >
            Sign Up
          </button>
        </form>
        <p className="text-sm text-center text-gray-600 mt-4">
          Already have an account?{' '}
          <Link to="/login" className="text-green-600 hover:underline">
            Log in
          </Link>
        </p>
      </div>
    </div>
  )
}

export default Signup