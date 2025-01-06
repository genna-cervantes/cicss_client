import React from "react";

const Footer = () => {
  return (
    <div>
      <div className="flex justify-between items-center py-3 px-12 mt-4  text-primary font-Manrope">
        <div>
          © Copyright 2024. University of Santo Tomas. All Rights reserved.
        </div>
        <nav>
          <ul className="flex gap-10 font-bold underline decoration-primary">
            <li>Help</li>
            <li>Terms and Conditions</li>
            <li>Send Feedback</li>
          </ul>
        </nav>
      </div>
    </div>
  );
};

export default Footer;
