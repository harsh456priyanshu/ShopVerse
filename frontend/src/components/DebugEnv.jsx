import React from 'react';

function DebugEnv() {
  const apiUrl = import.meta.env.VITE_API_URL;
  const mode = import.meta.env.MODE;
  const env = import.meta.env;

  return (
    <div style={{ 
      position: 'fixed', 
      top: '10px', 
      right: '10px', 
      background: 'black', 
      color: 'white', 
      padding: '10px', 
      fontSize: '12px',
      zIndex: 9999,
      borderRadius: '5px'
    }}>
      <h4>Debug Info:</h4>
      <p>API URL: {apiUrl || 'NOT SET'}</p>
      <p>Mode: {mode}</p>
      <p>All Env Keys: {Object.keys(env).filter(key => key.startsWith('VITE_')).join(', ')}</p>
    </div>
  );
}

export default DebugEnv;
