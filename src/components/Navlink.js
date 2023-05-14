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
                        <Link to="https://lip-gloss-site.netlify.app/">
                            Home
                            {/* <i className="fas fa-caret-down" /> */}
                        </Link>
                    </li>
                    <li>
                        <Link to="https://lip-gloss-site.netlify.app/shop">
                            Shop
                            {/* <i className="fas fa-caret-down" /> */}
                        </Link>
                    </li>

                    <li>
                        <a href="https://final--fluffy-mochi-9598b3.netlify.app/">
                            Lip Viewer
                        </a>
                    </li>

                    <li>
                        <Link to="https://lip-gloss-site.netlify.app/about">About Us</Link>
                    </li>
                </ul>
            </div>
        </div>
    );
};

export default Navlink;
