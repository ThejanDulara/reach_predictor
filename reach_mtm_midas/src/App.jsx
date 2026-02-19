import React from 'react';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import Header from './components/Header';
import Footer from './components/Footer';
import ReachPredictor from './pages/ReachPredictor';

function App() {
  return (
    <div className="app-container">
      <ToastContainer position="top-right" autoClose={3000} />
      <Header />

      <div className="content-container">
        <div className="section-wrapper">
          <ReachPredictor />
        </div>
      </div>

      <Footer />

      <style jsx>{`
        .app-container {
          font-family: 'Inter', sans-serif;
          min-height: 100vh;
          display: flex;
          flex-direction: column;
          background: #f3e8ff;
          padding: 0;
          margin: 0;
        }

        .content-container {
          width: 100%;
          max-width: 1400px;
          padding: 0 2rem;
          margin: 0 auto;
          margin-top: 2rem;
          flex: 1;
        }

        .section-wrapper {
          background: #e9d5ff;
          border-radius: 12px;
          box-shadow: 0 4px 20px rgba(0, 0, 0, 0.08);
          padding: 2rem;
        }

        @media (min-width: 1400px) {
          .content-container { padding: 0 4rem; }
        }
      `}</style>
    </div>
  );
}

export default App;
