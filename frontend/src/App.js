import React, { Component } from "react";
import { Switch } from "react-router-dom";
import { connect } from "react-redux";

import * as actions from "./actions/index";

import Header from "./components/Header";
import PageNavigation from "./components/common/Navigation";

import CacheBuster from "./cacheBuster";
import packageJson from "../package.json";

import "./assets/scss/main.scss";
import { initWeb3 } from "./wallets/metamask";

class App extends Component {
  componentDidMount() {
    initWeb3();
  }

  render() {
    const links = [
      { link: "/", name: "home" },
      { link: "/single-matka", name: "Single Matka" },
    ];

    return (
      <div className="App">
        <CacheBuster>
          {({ loading, isLatestVersion, refreshCacheAndReload }) => {
            // console.log("[*] cache policy", loading, isLatestVersion);
            if (loading) return null;
            console.log(`UI Version:`, packageJson.version);
            if (!loading && !isLatestVersion) {
              // You can decide how and when you want to force reload
              refreshCacheAndReload();
            }

            return null;
          }}
        </CacheBuster>

        <Header />
        <PageNavigation links={[...links]} />

        <Switch></Switch>
      </div>
    );
  }
}

export default connect(null, actions)(App);
