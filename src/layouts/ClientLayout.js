import React from 'react';
import Header from './Header';
import Footer from './Footer.js';
import Main from './Main';
import AIChatWidget from '../components/AIChat/AIChatWidget';

const ClientLayout = () => {
  return (
    <>
      <Header />
      <Main />
      <Footer />
      <AIChatWidget />
    </>
  );
};

export default ClientLayout;
