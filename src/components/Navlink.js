import React from "react";
import "./Navlink.scss";
import { Link } from "react-router-dom";
const Navlink = () => {
    return (
        <div className="nav-link-parent">
            <div className="menu-bar">
                <ul>
                    <li>
                        {" "}
                        <Link to="https://lipgloss-versionthree.netlify.app/">
                            Home
                            {/* <i className="fas fa-caret-down" /> */}
                        </Link>
                    </li>
                    <li>
                        <Link to="https://lipgloss-versionthree.netlify.app/shop">
                            Shop
                            {/* <i className="fas fa-caret-down" /> */}
                        </Link>
                    </li>

                    <li>
                        <Link to="https://lipgloss-versionthree.netlify.app/about">
                            About Us
                        </Link>
                    </li>
                    <li>
                        <Link to="/color-blender">Create Your Lip</Link>
                    </li>
                </ul>
            </div>
        </div>
    );
};

export default Navlink;
