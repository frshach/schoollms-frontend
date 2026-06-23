import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import 'bootstrap/dist/css/bootstrap.min.css';

// Global styles — mirrors JSP Plus Jakarta Sans + sidebar CSS
const style = document.createElement('style');
style.textContent = `
  @import url('https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;500;600;700;800&display=swap');
  * { font-family: 'Plus Jakarta Sans', sans-serif; box-sizing: border-box; }
  body { background: #f8fafc; margin: 0; }
  .sidebar-link {
    display: flex; align-items: center; gap: 10px;
    padding: 10px 14px; border-radius: 8px;
    text-decoration: none; color: #475569;
    font-weight: 500; font-size: 0.9rem;
    transition: all 0.2s;
  }
  .sidebar-link:hover { background: #f1f5f9; color: #1e293b; }
  .sidebar-link.active { background: #eff6ff; color: #2563eb; font-weight: 600; }
`;
document.head.appendChild(style);

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(<React.StrictMode><App /></React.StrictMode>);
