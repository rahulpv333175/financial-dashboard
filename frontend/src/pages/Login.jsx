import { useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import axios from 'axios'
import { useToast } from '../context/ToastContext' // ✅ Import useToast

function Login({ setIsLoggedIn }) {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const navigate = useNavigate()
  const { showToast } = useToast() // ✅ Use the global toast hook

  const handleSubmit = async (e) => {
    e.preventDefault()
    try {
      const res = await axios.post('http://localhost:5000/api/auth/login', {
        email,
        password,
      })

      const { token, user } = res.data

      if (token) {
        localStorage.setItem('token', token)
        localStorage.setItem('userEmail', user.email)
        axios.defaults.headers.common['Authorization'] = `Bearer ${token}`

        setIsLoggedIn(true)
        showToast('Login successful!', 'success') // ✅ Use toast instead of alert
        navigate('/dashboard')
      } else {
        showToast(res.data.error || 'Login failed: No token received', 'error') // ✅ Use toast
      }
    } catch (error) {
      if (error.response) {
        showToast(error.response.data.error || 'Login failed', 'error') // ✅ Use toast
      } else if (error.request) {
        showToast('No response from server. Please try again later.', 'error') // ✅ Use toast
      } else {
        showToast('An error occurred during login.', 'error') // ✅ Use toast
      }
      console.error('Login error:', error)
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-indigo-100 to-pink-200">
      <div className="bg-white p-8 rounded-xl shadow-lg w-full max-w-md">
        <h2 className="text-2xl font-bold mb-6 text-center text-indigo-600">Login</h2>
        <form onSubmit={handleSubmit}>
          <input
            type="email"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full p-3 mb-4 border rounded-md focus:outline-none focus:ring focus:ring-indigo-300 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
          />
          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full p-3 mb-6 border rounded-md focus:outline-none focus:ring focus:ring-indigo-300 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
          />
          <button
            type="submit"
            className="w-full bg-indigo-600 text-white py-3 rounded-md hover:bg-indigo-700 transition duration-300"
          >
            Log In
          </button>
        </form>
        <p className="text-sm text-center text-gray-600 mt-4">
          Don’t have an account?{' '}
          <Link to="/signup" className="text-indigo-600 hover:underline">
            Sign up
          </Link>
        </p>
      </div>
    </div>
  )
}

export default Login