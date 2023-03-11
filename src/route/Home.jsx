import React from "react";
import { NavLink } from "react-router-dom";
import { style } from "./style";

function Home() {
  return (
    <div>
      <NavLink to="/dapp" className={style.btnUniversal}>
        Launch Dapp
      </NavLink>
    </div>
  );
}

export default Home;
