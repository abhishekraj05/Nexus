import React from 'react';

const Privacy = () => {
  return (
    <div style={styles.container}>
      <div style={styles.wrapper}>
        <h1 style={styles.title}>Nexus Privacy Policy</h1>
        <p style={styles.lastUpdated}>Last updated: January 2026</p>
        
        <p style={styles.intro}>
          Welcome to <strong>Nexus</strong>. Your privacy is critically important to us. 
          This Privacy Policy explains how we collect, use, protect, and share your personal information 
          when you use our platform. By using Nexus, you agree to the terms outlined below.
        </p>

        {/* 1. Information We Collect */}
        <div style={styles.section}>
          <h3 style={styles.heading}>1. Information We Collect</h3>
          <p style={styles.text}>
            We collect different types of information to provide and improve our service:
          </p>
          <ul style={styles.list}>
            <li><strong>Personal Information:</strong> Name, email address, profile picture, and bio provided during registration.</li>
            <li><strong>User Content:</strong> Photos, videos, comments, and messages you post or send via Nexus.</li>
            <li><strong>Usage Data:</strong> Information about how you access the app, including device type, IP address, and browser type.</li>
          </ul>
        </div>

        {/* 2. How We Use Your Information */}
        <div style={styles.section}>
          <h3 style={styles.heading}>2. How We Use Information</h3>
          <p style={styles.text}>Your data is used to:</p>
          <ul style={styles.list}>
            <li>Provide, operate, and maintain the Nexus platform.</li>
            <li>Improve user experience and personalize content feeds.</li>
            <li>Communicate with you regarding updates, security alerts, and support.</li>
            <li>Detect and prevent fraudulent or abusive activity.</li>
          </ul>
        </div>

        {/* 3. Data Sharing & Disclosure */}
        <div style={styles.section}>
          <h3 style={styles.heading}>3. Data Sharing & Disclosure</h3>
          <p style={styles.text}>
            We do not sell your personal data. However, we may share information in the following situations:
          </p>
          <ul style={styles.list}>
            <li><strong>Service Providers:</strong> With third-party vendors (e.g., cloud hosting, database management) who help us operate the app.</li>
            <li><strong>Legal Requirements:</strong> If required by law or to protect the rights and safety of Nexus and its users.</li>
          </ul>
        </div>

        {/* 4. Data Security */}
        <div style={styles.section}>
          <h3 style={styles.heading}>4. Data Security</h3>
          <p style={styles.text}>
            We implement industry-standard security measures (including encryption and secure socket layers) to protect your data. 
            However, no method of transmission over the internet is 100% secure, and we cannot guarantee absolute security.
          </p>
        </div>

        {/* 5. Your Rights */}
        <div style={styles.section}>
          <h3 style={styles.heading}>5. Your Rights & Choices</h3>
          <p style={styles.text}>
            You have control over your information:
          </p>
          <ul style={styles.list}>
            <li><strong>Access & Update:</strong> You can edit your profile details at any time via the Settings page.</li>
            <li><strong>Delete Account:</strong> You may request the deletion of your account and associated data by contacting support.</li>
          </ul>
        </div>

         {/* 6. Cookies */}
         <div style={styles.section}>
          <h3 style={styles.heading}>6. Cookies Policy</h3>
          <p style={styles.text}>
            Nexus uses cookies to maintain your session and remember your preferences. You can control cookie settings through your browser.
          </p>
        </div>

        {/* 7. Contact Us */}
        <div style={styles.section}>
          <h3 style={styles.heading}>7. Contact Us</h3>
          <p style={styles.text}>
            If you have any questions about this Privacy Policy, please contact us at:
          </p>
          <p style={{...styles.text, color: '#3b82f6', fontWeight: 'bold'}}>
            nexusofficials012@gmail.com
          </p>
        </div>

      </div>
    </div>
  );
};

// Updated Styles for a Professional Look
const styles = {
    container: {
        backgroundColor: '#000', // Deep black background for the whole page
        minHeight: '100vh',
        fontFamily: "'Inter', sans-serif", // Modern font if available
    },
    wrapper: { 
        padding: '60px 20px', 
        maxWidth: '900px', 
        margin: '0 auto', 
        color: '#e5e5e5' 
    },
    title: { 
        fontSize: '48px', 
        color: '#ffffff', 
        marginBottom: '10px', 
        textAlign: 'center',
        fontWeight: '700'
    },
    lastUpdated: {
        textAlign: 'center',
        color: '#6b7280',
        marginBottom: '50px',
        fontStyle: 'italic'
    },
    intro: {
        fontSize: '18px',
        lineHeight: '1.6',
        color: '#d1d5db',
        marginBottom: '40px',
        textAlign: 'center',
        maxWidth: '700px',
        marginLeft: 'auto',
        marginRight: 'auto'
    },
    section: { 
        marginBottom: '30px', 
        background: '#111', // Slightly lighter than black
        padding: '30px', 
        borderRadius: '16px', 
        border: '1px solid #222',
        boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.5)'
    },
    heading: {
        fontSize: '24px',
        color: '#f3f4f6',
        marginBottom: '15px',
        borderBottom: '2px solid #3b82f6', // Blue accent line
        paddingBottom: '10px',
        display: 'inline-block'
    },
    text: { 
        fontSize: '16px',
        lineHeight: '1.7',
        color: '#9ca3af',
        marginBottom: '10px'
    },
    list: {
        paddingLeft: '20px',
        color: '#9ca3af',
        lineHeight: '1.8'
    }
};

export default Privacy;