import React from "react";
import { useNavigate } from "react-router-dom";

/**
 * BackButton
 * - onClick: tries navigate(-1)
 * - if no history or you want explicit fallback, pass fallback="/HelpDesk"
 *
 * Usage:
 *  import BackButton from "../components/BackButton";
 *  <BackButton fallback="/HelpDesk" />
 */
export default function BackButton({ fallback = "/HelpDesk", children }) {
  const navigate = useNavigate();

  const handleBack = () => {
    // try to go back in history
    try {
      navigate(-1);
    } catch (err) {
      // fallback in case history is not available
      navigate(fallback);
    }
  };

  return (
    <button
      type="button"
      className="back-btn"
      onClick={handleBack}
      title="Go back"
    >
      {/* simple left arrow + label; children overrides label */}
      <span className="back-arrow">←</span>
      <span className="back-label">{children || "Back"}</span>
    </button>
  );
}

