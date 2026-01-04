import React from 'react';

const Terms = () => {
  return (
    <div style={styles.container}>
      <div style={styles.wrapper}>
        <h1 style={styles.title}>Nexus Terms of Service</h1>
        <p style={styles.lastUpdated}>Last updated: January 2026</p>
        
        <p style={styles.intro}>
          Please read these Terms of Service ("Terms", "Agreement") carefully before using the 
          <strong> Nexus</strong> social platform operated by Nexus Inc. By accessing or using the Service, 
          you agree to be bound by these Terms. If you disagree with any part of the terms, you may not access the Service.
        </p>

        {/* 1. Acceptance */}
        <div style={styles.section}>
          <h3 style={styles.heading}>1. Acceptance of Terms</h3>
          <p style={styles.text}>
            By creating an account or accessing Nexus, you acknowledge that you have read, understood, and agree to be bound by this Agreement 
            and our Privacy Policy. This Agreement applies to all visitors, users, and others who access the Service.
          </p>
        </div>

        {/* 2. User Accounts */}
        <div style={styles.section}>
          <h3 style={styles.heading}>2. User Accounts & Security</h3>
          <p style={styles.text}>
            To use certain features of the app, you must register for an account.
          </p>
          <ul style={styles.list}>
            <li><strong>Eligibility:</strong> You must be at least 13 years old to use Nexus.</li>
            <li><strong>Security:</strong> You are responsible for safeguarding the password that you use to access the Service.</li>
            <li><strong>Accuracy:</strong> You agree to provide accurate, current, and complete information during the registration process.</li>
          </ul>
        </div>

        {/* 3. User Content */}
        <div style={styles.section}>
          <h3 style={styles.heading}>3. Content & Ownership</h3>
          <p style={styles.text}>
            Nexus allows you to post, link, store, share and otherwise make available certain information, text, graphics, videos, or other material ("Content").
          </p>
          <ul style={styles.list}>
            <li><strong>Your Rights:</strong> You retain ownership of any content you post. However, by posting, you grant Nexus a license to display and distribute your content on the platform.</li>
            <li><strong>Responsibility:</strong> You are fully responsible for the content you post. Nexus is not responsible for content posted by users.</li>
          </ul>
        </div>

        {/* 4. Prohibited Conduct */}
        <div style={styles.section}>
          <h3 style={styles.heading}>4. Prohibited Conduct</h3>
          <p style={styles.text}>You agree not to engage in any of the following prohibited activities:</p>
          <ul style={styles.list}>
            <li>Using the service for any illegal purpose or to violate any laws.</li>
            <li>Harassing, threatening, or defaming other users.</li>
            <li>Posting content that is violent, explicit, or promotes hate speech.</li>
            <li>Attempting to hack, disrupt, or interfere with the Nexus servers or network.</li>
          </ul>
        </div>

        {/* 5. Termination */}
        <div style={styles.section}>
          <h3 style={styles.heading}>5. Termination</h3>
          <p style={styles.text}>
            We may terminate or suspend your account immediately, without prior notice or liability, for any reason whatsoever, 
            including without limitation if you breach the Terms. Upon termination, your right to use the Service will immediately cease.
          </p>
        </div>

        {/* 6. Limitation of Liability */}
        <div style={styles.section}>
          <h3 style={styles.heading}>6. Limitation of Liability</h3>
          <p style={styles.text}>
            In no event shall Nexus Inc., nor its directors, employees, partners, agents, suppliers, or affiliates, be liable for any indirect, incidental, 
            special, consequential or punitive damages, including without limitation, loss of profits, data, use, goodwill, or other intangible losses.
          </p>
        </div>

        {/* 7. Changes to Terms */}
        <div style={styles.section}>
          <h3 style={styles.heading}>7. Changes to Terms</h3>
          <p style={styles.text}>
            We reserve the right, at our sole discretion, to modify or replace these Terms at any time. 
            By continuing to access or use our Service after those revisions become effective, you agree to be bound by the revised terms.
          </p>
        </div>

        <div style={styles.footerNote}>
          <p>Questions? Contact us at <strong>nexusofficials012@gmail.com</strong></p>
        </div>
      </div>
    </div>
  );
};

// Styles - Consistent with Privacy Policy
const styles = {
    container: {
        backgroundColor: '#000',
        minHeight: '100vh',
        fontFamily: "'Inter', sans-serif",
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
        background: '#111', 
        padding: '30px', 
        borderRadius: '16px', 
        border: '1px solid #222',
        boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.5)'
    },
    heading: {
        fontSize: '24px',
        color: '#f3f4f6',
        marginBottom: '15px',
        borderBottom: '2px solid #3b82f6', // Nexus Blue Accent
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
    },
    footerNote: {
        textAlign: 'center',
        marginTop: '40px',
        color: '#6b7280'
    }
};

export default Terms;