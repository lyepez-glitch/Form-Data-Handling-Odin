import React from 'react';
import logo from './logo.svg';
import './App.css';
import Hero from './Hero';
import Nav from './Nav';
import About from './About';
import Contact from './Contact';
import Home from './Home';
import Project from './Project';
import { Helmet } from 'react-helmet';
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";


function App() {
  return (
    <>
    <Helmet>
      <title>My Portfolio</title>
      <meta name="description" content="Description of portfolio" />
      <meta name="keywords" content="portfolio, web development, projects, programming" />
      <meta name="author" content="Lucas Yepez" />
    </Helmet>
    <Hero/>
    <Router>
    <Nav/>
    <Routes>
      <Route path = "/about" element={<About/>}/>
      <Route path = "/contact" element={<Contact/>}/>
      <Route path = "/home" element={<Home/>}/>
      <Route path = "/projects" element={<Project/>}/>

    </Routes>
    </Router>

    </>

  );
}

export default App;
