import React, { useState, useRef, useEffect } from "react";
import { createPortal } from "react-dom";

const DropdownMenu = ({ button, children }) => {
  const [open, setOpen] = useState(false);
  const menuRef = useRef(null);
  const [position, setPosition] = useState({ top: 0, left: 0 });

  // Close dropdown when clicked outside
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (menuRef.current && !menuRef.current.contains(e.target)) setOpen(false);
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleToggle = (e) => {
    const rect = e.currentTarget.getBoundingClientRect();
    setPosition({ top: rect.bottom + 6, left: rect.left });
    setOpen(!open);
  };

  return (
    <>
      <button onClick={handleToggle} className="px-3 py-1 bg-gray-100 hover:bg-gray-200 rounded">
        {button}
      </button>

      {open &&
        createPortal(
          <div
            ref={menuRef}
            className="absolute z-[9999] bg-white border border-gray-200 rounded-lg shadow-lg p-2 w-40"
            style={{
              position: "absolute",
              top: position.top,
              left: position.left,
            }}
          >
            {children}
          </div>,
          document.body
        )}
    </>
  );
};

export default DropdownMenu;