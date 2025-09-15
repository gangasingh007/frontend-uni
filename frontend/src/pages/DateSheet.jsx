import React from 'react';
import { motion } from 'framer-motion';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import InteractiveBackground from '../components/InteractiveBackground';
import datesheetPDF from '../assets/mid.pdf';

const DateSheet = () => {
  return (
    <>
      <embed src={datesheetPDF} type="application/pdf"
        style={{ width: "100%", height: "100vh" }} />
    </>
  );
};

export default DateSheet;
