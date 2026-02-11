import React from 'react';
import ReactDOM from "react-dom/client";
import { BrowserRouter, Routes, Route } from "react-router";
import GetStarted from './pages/signup/getstarted';
import Signin from './pages/signin/signin';
import Profile from './pages/profile/profile';
import AjouterPatient from './pages/ajouterPatient/ajouterPatient';
import Brouillons from './pages/brouillons/brouillons';
import Enplanification from './pages/enplanification/enplanification';
import Enattente from './pages/enattente/enattente';
import Dossier from './pages/dossier/dossier';
import SupportPage from './pages/support/support';
import Signup from './pages/signup/signup'
import Enproduction from './pages/enproduction/enproduction';
import Entraitement from './pages/entraitement/entraitement';
import Termine from './pages/termine/termine';
import ProfileMedecin from './pages/profileMedecin/profileMedecin';
import TPCheck from './pages/tpcheck/tpcheck';
import Simulation from './pages/simulation/simulation';


const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
    <BrowserRouter>
      <Routes>
        <Route path="/profile" element={<Profile/>}/>
        <Route path="/getstarted" element={<GetStarted/>}/>
        <Route path="/signup" element={<Signup/>}/>
        <Route path="/" element={<Signin/>}/>
        <Route path="/ajouterPatient" element={<AjouterPatient/>}/>
        <Route path="/brouillons" element={<Brouillons/>}/>
        <Route path="/enplanification" element={<Enplanification/>}/>
        <Route path="/enattente" element={<Enattente/>}/>
        <Route path="/enproduction" element={<Enproduction/>}/>
        <Route path="/entraitement" element={<Entraitement/>}/>
        <Route path="/termine" element={<Termine/>}/>
        <Route path="/dossier" element={<Dossier/>}/>
        <Route path="/support" element={<SupportPage/>}/>
        <Route path="/profileMedecin" element={<ProfileMedecin/>}/>
        <Route path="/tpcheck" element={<TPCheck/>}/>
        <Route path="/simulation" element={<Simulation/>}/>
      </Routes>
    </BrowserRouter>
);
