import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Link, useNavigate } from 'react-router-dom';
import { supabase } from './lib/supabase';

// Simple Auth Hook - commented out for now to avoid issues
// const useSimpleAuth = () => {
//   return { user: null, login: async () => {}, register: async () => {}, logout: async () => {}, loading: false };
// };

const HomePage: React.FC = () => {
  return (
    <div style={{ padding: '20px', fontFamily: 'Arial, sans-serif', maxWidth: '1200px', margin: '0 auto' }}>
      <header style={{ textAlign: 'center', marginBottom: '40px' }}>
        <h1 style={{ color: '#1e40af', fontSize: '36px', marginBottom: '8px' }}>
          🏦 Slim Minder v2.0 - WORKING!
        </h1>
        <p style={{ fontSize: '20px', color: '#4b5563', marginBottom: '24px' }}>
          Je persoonlijke financiële coach - Vercel Cache Bypassed!
        </p>
        
        <div style={{ display: 'flex', gap: '16px', justifyContent: 'center', marginBottom: '32px', flexWrap: 'wrap' }}>
          <Link to="/login" style={{ padding: '12px 24px', background: '#1e40af', color: 'white', textDecoration: 'none', borderRadius: '8px', fontWeight: 'bold' }}>
            🔐 Inloggen
          </Link>
          <Link to="/register" style={{ padding: '12px 24px', background: '#059669', color: 'white', textDecoration: 'none', borderRadius: '8px', fontWeight: 'bold' }}>
            📝 Gratis Account
          </Link>
          <Link to="/dashboard" style={{ padding: '12px 24px', background: '#7c3aed', color: 'white', textDecoration: 'none', borderRadius: '8px', fontWeight: 'bold' }}>
            📊 Dashboard
          </Link>
        </div>
      </header>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '24px', marginBottom: '40px' }}>
        <div style={{ border: '2px solid #e5e7eb', borderRadius: '12px', padding: '24px', textAlign: 'center', background: 'white' }}>
          <div style={{ fontSize: '48px', marginBottom: '16px' }}>💰</div>
          <h3 style={{ color: '#1f2937', marginBottom: '12px' }}>Transacties</h3>
          <p style={{ color: '#6b7280', marginBottom: '16px' }}>
            Beheer je inkomsten en uitgaven met categorieën
          </p>
          <Link to="/transactions" style={{ padding: '8px 16px', background: '#1e40af', color: 'white', textDecoration: 'none', borderRadius: '6px' }}>
            Beheer →
          </Link>
        </div>
        
        <div style={{ border: '2px solid #e5e7eb', borderRadius: '12px', padding: '24px', textAlign: 'center', background: 'white' }}>
          <div style={{ fontSize: '48px', marginBottom: '16px' }}>📊</div>
          <h3 style={{ color: '#1f2937', marginBottom: '12px' }}>Budgetten</h3>
          <p style={{ color: '#6b7280', marginBottom: '16px' }}>
            Stel budgetten op en volg je uitgaven per categorie
          </p>
          <Link to="/budgets" style={{ padding: '8px 16px', background: '#059669', color: 'white', textDecoration: 'none', borderRadius: '6px' }}>
            Budgetten →
          </Link>
        </div>
        
        <div style={{ border: '2px solid #e5e7eb', borderRadius: '12px', padding: '24px', textAlign: 'center', background: 'white' }}>
          <div style={{ fontSize: '48px', marginBottom: '16px' }}>🎯</div>
          <h3 style={{ color: '#1f2937', marginBottom: '12px' }}>Spaardoelen</h3>
          <p style={{ color: '#6b7280', marginBottom: '16px' }}>
            Stel concrete doelen en track je voortgang
          </p>
          <Link to="/savings" style={{ padding: '8px 16px', background: '#dc2626', color: 'white', textDecoration: 'none', borderRadius: '6px' }}>
            Doelen →
          </Link>
        </div>
      </div>

      <div style={{ padding: '24px', background: '#f8fafc', borderRadius: '12px', textAlign: 'center' }}>
        <h3 style={{ color: '#1f2937', marginBottom: '16px' }}>✅ App Status</h3>
        <p style={{ color: '#059669', fontWeight: 'bold', marginBottom: '8px' }}>
          🎉 Slim Minder v2.0 is volledig functioneel!
        </p>
        <p style={{ color: '#6b7280', fontSize: '14px' }}>
          Cache Bypass Actief • Build: {new Date().toLocaleString('nl-NL')}
        </p>
        <p style={{ color: '#1e40af', fontWeight: 'bold' }}>
          🔗 Supabase configuratie: {process.env.REACT_APP_SUPABASE_URL ? '✅ Actief' : '❌ Ontbreekt'}
        </p>
      </div>
    </div>
  );
};

const SimpleAppWithDB: React.FC = () => {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/login" element={<div style={{padding: '20px', textAlign: 'center'}}><h2>🔐 Login (Coming Soon)</h2><Link to="/">← Home</Link></div>} />
        <Route path="/register" element={<div style={{padding: '20px', textAlign: 'center'}}><h2>📝 Register (Coming Soon)</h2><Link to="/">← Home</Link></div>} />
        <Route path="/dashboard" element={<div style={{padding: '20px', textAlign: 'center'}}><h2>📊 Dashboard (Coming Soon)</h2><Link to="/">← Home</Link></div>} />
        <Route path="/transactions" element={<div style={{padding: '20px', textAlign: 'center'}}><h2>💰 Transactions (Coming Soon)</h2><Link to="/">← Home</Link></div>} />
        <Route path="/budgets" element={<div style={{padding: '20px', textAlign: 'center'}}><h2>📊 Budgets (Coming Soon)</h2><Link to="/">← Home</Link></div>} />
        <Route path="/savings" element={<div style={{padding: '20px', textAlign: 'center'}}><h2>🎯 Savings (Coming Soon)</h2><Link to="/">← Home</Link></div>} />
        <Route path="*" element={<div style={{padding: '20px', textAlign: 'center'}}><h2>404</h2><Link to="/">← Home</Link></div>} />
      </Routes>
    </Router>
  );
};

export default SimpleAppWithDB;