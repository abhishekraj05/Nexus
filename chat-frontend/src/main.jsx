// import { StrictMode } from 'react'
// import { createRoot } from 'react-dom/client'
// // import './index.css'
// import "./styles/global.css";
// import "./styles/variables.css";
// import App from './App.jsx'


// createRoot(document.getElementById('root')).render(
//   <StrictMode>
//     <App />
//   </StrictMode>,
// )





import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
// import './index.css'
import "./styles/global.css";
import "./styles/variables.css";
import RootApp from './RootApp';

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <RootApp />
  </StrictMode>,
)



