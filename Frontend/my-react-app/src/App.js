import './App.css';
import React from 'react';
import HomePage from './pages/HomePage';
import NewProject from './components/NewProject/NewProject';
import Recommendations from './pages/recommendations';
import Interns from './pages/Interns';
import ProjectInfoPage from './pages/ProjectInfoPage';
import InternSignup from './pages/InternSignup';
import { BrowserRouter as Router, Route, Routes, Navigate } from 'react-router-dom';
import ProtectedRoute from './components/ProtectedRoutes/ProtectedRoutes';
import LoginSignup from './pages/LoginSignup';
import Thankyou from './pages/Thankyou';
import EditIntern from './pages/EditIntern'
import InternGrowthPage from './pages/InternGrowthPage';
import CompletedProjects from './pages/CompletedProjects';
import LandingPage from './pages/LandingPage';

function App() {
  return (
    <Router>
      <Routes>
        {/* Public Routes */}
        <Route path='/' element={<LandingPage/>}/>
        <Route path="/loginsignup" element={<LoginSignup />} />
        <Route path="/login" element={<Navigate to="/" />} />
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
    </Router>
  );
}

export default App;
