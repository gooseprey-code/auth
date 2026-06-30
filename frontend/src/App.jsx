import { useEffect, useState } from 'react'
import SignupPage from './Pages/SignupPage'
import { Navigate, Route, Routes, useNavigate } from 'react-router-dom'
import VerifyEmailPage from './Pages/VerifyEmailPage'
import AddUsername from './Pages/AddUsername'
import toast, {Toaster} from 'react-hot-toast'
import { useAuthStore } from './store/AuthStore'
import UserDashboardPage from './Pages/UserDashboard'
import LoginPage from './Pages/LoginPage'
import Header from './Components/Header'
import Footer from './Components/Footer'
import ForgotPassword from './Pages/ForgotPasswordPage'
import ResetPassword from './Pages/ResetPasswordPage'
import ArticlesPage from './Pages/ArticlesPage'



function App() {

  const authUser = useAuthStore((state) => state.authUser)

  const navigate = useNavigate()

  const ProtectRoute = ({ children }) => {
    if (authUser) {
      if (!authUser.isVerified) return <Navigate to="/verify-email" replace />
      if (authUser.isVerified) {
        if (!authUser.username) return <Navigate to="/add-username" replace />
      }
    }
    return children
  }

  const RedirectUser = ({ children }) => {
    if(authUser && !authUser.isVerified) return <Navigate to="/verify-email" replace />
    if(authUser && authUser.isVerified){
      if (!authUser.username) return <Navigate to="/add-username" replace />
      if (authUser.username) return <Navigate to="/" replace />
    } 
    return children 
  }

  const RedirectVerfiedUser = ({ children }) => {
    if(!authUser) return <Navigate to="/login" replace />
    if(authUser){
      if (authUser.isVerified) {
        if(!authUser.username) return <Navigate to="/add-username" replace />
        if(authUser.username) return <Navigate to="/" replace />
      }
    }
    return children 
  }

  const  RedirectUserSec = ({children}) => {
    if(!authUser) return <Navigate to="/login" replace />
    if(authUser){
      if (!authUser.isVerified) return <Navigate to="/verify-email" replace />
      if (authUser.username) return <Navigate to="/" replace />
    }
    return children 
  } 

  return (
    <div className="dark:bg-black w-full m-0 p-0 min-h-screen flex flex-col bg-stone-50 overflow-x-hidden">
      <Header />
      <div className='mt-20'>
        <Routes>
          
          <Route path="/" element={
              <ProtectRoute>
                <UserDashboardPage />
              </ProtectRoute>
          }/>

          <Route path="/login" element={
            <RedirectUser>
              <LoginPage />
            </RedirectUser>        
          } />

          <Route path="/signup" element={ 
            <RedirectUser>
              <SignupPage />            
            </RedirectUser>          
          } />

          <Route path="/verify-email" element={ 
            <RedirectVerfiedUser>
              <VerifyEmailPage />
            </RedirectVerfiedUser>  
          } />

          <Route path="/add-username" element= {
            <RedirectUserSec>
              <AddUsername /> 
            </RedirectUserSec>
            } />
          
          <Route path="/forgot-password" element={ 
            <RedirectUser>
              <ForgotPassword />
            </RedirectUser>
          } />
          <Route path="/reset-password/:token" element={ 
            <RedirectUser>
              <ResetPassword />
            </RedirectUser> 
          } />

          <Route path="/articles-page/:id" element={<ArticlesPage />} />
          <Route path='*' element={<UserDashboardPage />} />
        </Routes>
      </div>
      
      <Footer />
      <Toaster />
    </div>
  )
}

export default App
