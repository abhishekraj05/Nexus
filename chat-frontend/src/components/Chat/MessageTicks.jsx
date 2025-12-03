// src/components/Chat/MessageTicks.jsx
import React from 'react';


const MessageTicks = ({ status }) => {
  
  // 1. Base style (sent aur delivered ke liye)
  // Yeh sender bubble ke andar (halka white) wala default color hai
  const baseStyle = {
    fontSize: '0.8rem',
    fontWeight: 'bold',
    lineHeight: 1,
    marginLeft: '5px',
    color: '#ffffffb3' // Default semi-transparent white
  };

  // 2. Seen style (blue tick)
  const seenStyle = {
    ...baseStyle, // Start with base style
    color: '#4fc3f7' // Override color to blue
  };

  
  if (status === 'seen') {
    // Blue ticks (✓✓)
    return <span style={seenStyle}>✓✓</span>; 
  }
  
  if (status === 'delivered') {
    // Double grey ticks (✓✓) - uses baseStyle
    return <span style={baseStyle}>✓✓</span>; 
  }
  
  // Default 'sent' (Single grey tick ✓) - uses baseStyle
  return <span style={baseStyle}>✓</span>;
};

export default MessageTicks;

