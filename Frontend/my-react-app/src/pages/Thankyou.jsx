import React from "react";
import Logo from "../assets/Logo.png"; // Importing the logo image
import "./Thankyou.css"; // Importing the corresponding CSS for styling

/**
 * Thankyou component:
 * Displays a confirmation message to the user after successful signup,
 * welcoming them to the bizzNest Flow platform and setting expectations
 * for their development journey.
 */
const Thankyou = () => {
  return (
    <div className="addedWrapper">
      {/* Header message */}
      <h1>You've been added to</h1>

      {/* Logo and Brand Title */}
      <div className="logoWrapper">
        <h1>Bizznest Flow</h1>
        <img src={Logo} alt="Logo" />
      </div>

      {/* Welcome Message */}
      <div className="thankyouForApplying">
        <p>
          Your admin now has access to cutting-edge tools designed to personalize your development journey.
          From identifying the perfect projects to enhance your skills to strategically positioning you for
          leadership opportunities, bizzNest Flow ensures your time here is a launchpad for success.
        </p>
        <p>
          Prepare to unlock a dynamic balance of challenge and growth as we help you achieve your full potential at
          bizzNest!
        </p>
      </div>
    </div>
  );
};

export default Thankyou;
