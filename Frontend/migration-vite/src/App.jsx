import styles from './App.module.css';
import React, { useState, useEffect } from 'react';
import HomePage from './pages/HomePage';
import NewProject from './components/NewProject/NewProject';
import Recommendations from './pages/recommendations';
import Interns from './pages/Interns';
import ProjectInfoPage from './pages/ProjectInfoPage';
import InternSignup from './pages/InternSignup';
import { BrowserRouter as Router, Route, Routes, Navigate, useLocation } from 'react-router-dom';
import ProtectedRoute from './components/ProtectedRoutes/ProtectedRoutes';
import LoginSignup from './pages/LoginSignup';
import Thankyou from './pages/Thankyou';
import EditIntern from './pages/EditIntern';
import InternGrowthPage from './pages/InternGrowthPage';
import CompletedProjects from './pages/CompletedProjects';
import LandingPage from './pages/LandingPage';
import Chatbot from './components/Chatbot/Chatbot';
import ChatbotModal from './components/ChatbotModal/ChatbotModal';
import ChatbotImage from '../src/assets/bot-message-square.svg';
import MobileNav from './components/MobileNav/MobileNav';

//component to handle Routes and Chatbot together
function AppContent() {
  const location = useLocation();
  const [chatOpen, setChatOpen] = useState(false);
  const [isMobile, setIsMobile] = useState(window.innerWidth <= 768);
  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth <= 768);
    };
  
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  // Path where chatbot can be accessed
  const privatePaths = [
    '/home', 
    '/new-project',
    '/recommendations',
    '/interns',
    '/CompletedProjects'
  ];

  // takes into account the dynamic pages(when checking projects or individual interns)
  const isPrivateDynamicPath = location.pathname.startsWith('/project/')
    || location.pathname.startsWith('/editIntern/')
    || location.pathname.startsWith('/internGrowthPage/');

  const shouldShowChatbot = privatePaths.includes(location.pathname) || isPrivateDynamicPath;

  return (
    <>
      <Routes>
        {/* Public Routes */}
        <Route path='/' element={<LandingPage/>}/>
        <Route path="/loginsignup" element={<LoginSignup />} />
        <Route path="/login" element={<Navigate to="/loginsignup" />} />
        <Route path='/internsignup' element={<InternSignup />} />
        <Route path='/thankyou' element={<Thankyou />} />

        {/* Protected Routes */}
        <Route path="/home" element={ <ProtectedRoute> <HomePage /> </ProtectedRoute> } />
        <Route path="/new-project" element={ <ProtectedRoute> <NewProject /> </ProtectedRoute> }/>
        <Route path="/recommendations" element={ <ProtectedRoute> <Recommendations /> </ProtectedRoute> }/>
        <Route path="/interns" element={ <ProtectedRoute> <Interns /> </ProtectedRoute> }/>
        <Route path="/project/:projectID" element={ <ProtectedRoute> <ProjectInfoPage /> </ProtectedRoute> }/>
        <Route path="/intern-signup" element={ <ProtectedRoute> <InternSignup /> </ProtectedRoute> }/>
        <Route path="/editIntern/:internID" element={ <ProtectedRoute><EditIntern/></ProtectedRoute>}/>
        <Route path="/internGrowthPage/:internID" element={ <ProtectedRoute><InternGrowthPage/></ProtectedRoute>}/>
        <Route path="/completedProjects" element={ <ProtectedRoute><CompletedProjects/></ProtectedRoute>}/>
      </Routes>

      {isMobile && shouldShowChatbot && <MobileNav onChatClick={() => setChatOpen(true)} />}

      {shouldShowChatbot && (
        <>
          <button className={styles.fab} onClick={() => setChatOpen(true)} aria-label="Open chat">
            <img src={ChatbotImage} alt='Chatbot'/>
          </button>

          <ChatbotModal isOpen={chatOpen} onClose={() => setChatOpen(false)}>
            <Chatbot />
          </ChatbotModal>
        </>
      )}
    </>
  );
}

function App() {
  return (
    <Router>
      <AppContent />
    </Router>
  );
}

export default App;
