import React from 'react';
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
