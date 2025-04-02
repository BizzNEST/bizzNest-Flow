import React from "react";
import Logo from "../assets/Logo.png";
import "./Thankyou.css";

const Thankyou = () => {

    return (
        <div className="addedWrapper">
            <h1>You've been added to</h1>
            <div className="logoWrapper">
                <h1>Bizznest Flow</h1>
                <img src={Logo} alt="Logo" />
            </div>
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
    )
}

export default Thankyou;