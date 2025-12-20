import React from 'react';

const Terms = () => {
  return (
    <div style={styles.wrapper}>
      <h1 style={styles.title}>Terms of Service</h1>
      <p style={styles.text}>Welcome to Nexus.</p>
      
      <div style={styles.section}>
        <h3>1. Acceptance of Terms</h3>
        <p>By accessing and using Nexus, you accept and agree to be bound by the terms and provision of this agreement.</p>
      </div>

      <div style={styles.section}>
        <h3>2. User Conduct</h3>
        <p>You agree not to use the service for any unlawful purpose or any purpose prohibited under this clause.</p>
      </div>
    </div>
  );
};

const styles = {
    wrapper: { padding: '50px 20px', maxWidth: '800px', margin: '0 auto', color: '#ccc' },
    title: { fontSize: '40px', color: 'white', marginBottom: '20px', textAlign: 'center' },
    text: { textAlign: 'center', marginBottom: '40px', color: '#888' },
    section: { marginBottom: '30px', background: '#111', padding: '20px', borderRadius: '10px', border: '1px solid #333' }
};

export default Terms;