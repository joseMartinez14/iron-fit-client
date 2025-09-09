import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import LandingPage from './pages/LandingPage'
import ClassDetails from './pages/ClassDetails'
import LoginPage from './pages/LoginPage'
import ProtectedRoute from './routes/ProtectedRoute'

const AppRouter = () => {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<LoginPage />} />
        <Route element={<ProtectedRoute />}>
          <Route path="/landing" element={<LandingPage />} />
          <Route path="/class/:id" element={<ClassDetails />} />
        </Route>
      </Routes>
    </Router>
  )
}

export default AppRouter
