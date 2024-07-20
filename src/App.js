import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Login from './Pages/Login';
import Signup from './Pages/Signup';
import Home from './Pages/Home';
import Vendor from './Pages/Vendor';
import Staff from './Pages/Staff';
import Profiles from './Components/Profiles/Profiles';
import Material from './Components/Material/Material';
import Dashboard from './Components/Dashboard/Dashboard';
import Sidebar from './Components/Sidebar/Sidebar';
import Navbar from './Components/Navbar/Navbar';
import Project from './Components/Project/Project';
import ProjectList from './Components/ProjectList/ProjectList';
import ProjectManager from './Pages/ProjectManager';
import ProtectedRoute from './Components/Protection/ProtectedRoute';
import './App.css';

function MainRoutes() {
  return (
    <div className='main-content'>
      <Sidebar />
      <div className='content-wrapper'>
        <Navbar />
        <div className='content'>
          <Routes>
            <Route path='/' element={<Home />} />
            <Route path='/vendor' element={<Vendor />} />
            <Route path='/staff' element={<ProtectedRoute element={<Staff />}/>} />
            <Route path="/profiles/:id" element={<ProtectedRoute element={<Profiles />}/>} />
            <Route path='/material/:vendorId' element={<ProtectedRoute element={<Material />}/>} />
            <Route path='/dashboard/:vendorId' element={<ProtectedRoute element={<Dashboard />}/>} />
            <Route path='/projectManager/createProject' element={<ProtectedRoute element={<Project />} />}/>
            <Route path='/projectlist' element={<ProtectedRoute element={<ProjectList />}/>} />
            <Route path='/projectManager' element={<ProtectedRoute element={<ProjectList />}/>} />
          </Routes>
        </div>
      </div>
    </div>
  );
}

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path='/signup' element={<Signup />} />
        <Route path='/login' element={<Login />} />
        <Route path='/*' element={<MainRoutes />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;