import React from 'react';
import Sidebar from './Sidebar';
import Navbar from './Navbar';

export default function Layout({ children }) {
  return (
    <div className="app-layout">
      <Sidebar />
      <Navbar />
      <main className="app-main">
        {children}
      </main>
    </div>
  );
}
