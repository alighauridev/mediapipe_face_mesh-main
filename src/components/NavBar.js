import React, { useEffect } from "react";

import { Link } from "react-router-dom";
import "./Navbar.scss";

import Navlink from "./Navlink";
export default function App() {
    return (
        <div className="navbar-paretn">
            <div className="container">
                <div className="empty">
                    <Navlink />
                </div>

                <div className="logo">
                    <Link to="https://lip-gloss-site.netlify.app/" style={{ border: "none", textDecoration: "none" }}>
                        <h2 style={{ color: "black" }}>LOGO</h2>{" "}
                    </Link>
                </div>

                <div className="search-cart-parent">

                </div>
            </div>
        </div>
    );
}
