"use client";

import React, { useState, useEffect } from "react";
import { Suspense } from "react";
import ClientComponent from "./components/ClientComponent";
import Popup from "./components/Popup";

export default function Page() {
  const [showPopup, setShowPopup] = useState(false);

  useEffect(() => {
    const hasVisited = localStorage.getItem("hasVisited");
    if (!hasVisited) {
      setShowPopup(true);
      localStorage.setItem("hasVisited", "true");
    }
  }, []);

  const closePopup = () => {
    setShowPopup(false);
  };

  return (
    <div>
      <Suspense fallback={<div>Loading...</div>}>
        <ClientComponent />
      </Suspense>
      <Popup isOpen={showPopup} onClose={closePopup} />
    </div>
  );
}
