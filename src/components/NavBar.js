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
                    <div className="search-parent">
                        <input type="checkbox" name="" id="chkbox" />
                        <div className="search-bar">
                            <div className="search-box">
                                <label htmlFor="chkbox">
                                    <img
                                        src={
                                            "https://lip-gloss-site.netlify.app/static/media/search.ef43d977b5864f47b1d25dc40ba6be29.svg"
                                        }
                                        alt=""
                                    />
                                </label>
                            </div>
                            <input
                                type="search"
                                placeholder="Search Here"
                                className="search-input"
                            />
                        </div>
                    </div>
                    <div>
                        <Link to="https://lip-gloss-site.netlify.app/cart" style={{ color: "black" }}>
                            <span>
                                <img
                                    style={{ filter: "invert(1)" }}
                                    src={
                                        "https://lip-gloss-site.netlify.app/static/media/cart.966254d1f9ffc712568d21ec48e465f5.svg"
                                    }
                                    alt=""
                                />
                            </span>
                            <span
                                style={{
                                    fontSize: "10px",
                                    position: "relative",
                                    top: "-10px",
                                    left: "-4px",
                                }}
                            >
                                {" "}
                                ({0})
                            </span>
                        </Link>
                    </div>
                </div>
            </div>
        </div>
    );
}
