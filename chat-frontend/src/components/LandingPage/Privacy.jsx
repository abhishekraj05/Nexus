import React from 'react';

const Privacy = () => {
  return (
    <div style={styles.wrapper}>
      <h1 style={styles.title}>Privacy Policy</h1>
      <p style={styles.text}>Last updated: December 2025</p>
      
      <div style={styles.section}>
        <h3>1. Information We Collect</h3>
        <p>We collect only essential information to provide our services, such as your name and email address.</p>
      </div>

      <div style={styles.section}>
        <h3>2. How We Use Information</h3>
        <p>Your data is used solely to improve the Nexus experience. We do not sell your data to third parties.</p>
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

export default Privacy;