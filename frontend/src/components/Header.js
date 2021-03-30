import React from "react";
import { connect } from "react-redux";
import { Link } from "react-router-dom";

import { Navbar, Button, Col } from "react-bootstrap";

import BalanceModal from "./common/BalanceModal";
import { PROJECT_NAME } from "../helpers/constant";

class Header extends React.Component {
  renderCurrentAddressBox() {
    if (this.props.wallet.connected === false) return "Not Connected";

    if (!this.props.balance) return "Loading";

    const balances = ["native", "token"];

    const resp = Object.keys(this.props.balance).reduce((acc, curr) => {
      if (balances.includes(curr)) {
        acc.push({ name: curr, balance: this.props.balance[curr] });
      }
      return acc;
    }, []);

    return (
      <>
        <Col lg={12} sm={12} md={12}>
          <BalanceModal data={[...resp]} />
        </Col>
      </>
    );
  }

  getWalletBtn() {
    if (this.props.wallet.connected && this.props.wallet.valid_network) {
      return (
        <>
          <div className="ml-auto">{this.renderCurrentAddressBox()}</div>
          <div className="">
            <Button disabled={true} aria-controls="basic-navbar-nav">
              WALLET CONNECTED
            </Button>
          </div>
        </>
      );
    } else if (
      this.props.wallet.connected &&
      !this.props.wallet.valid_network
    ) {
      return (
        <>
          {/* <div className="ml-auto">{this.renderCurrentAddressBox()}</div> */}
          <div className="ml-auto">
            <Button disabled={true} aria-controls="basic-navbar-nav">
              INCORRECT NETWORK
            </Button>
          </div>
        </>
      );
    } else {
      <div className="ml-auto">
        <Button disabled={true} aria-controls="basic-navbar-nav">
          CONNECT WALLET
        </Button>
      </div>;
    }
  }

  render() {
    return (
      <Navbar className="custom-header" bg="light" expand="lg">
        <Link className="navbar-brand" to="/">
          {PROJECT_NAME}
        </Link>

        {this.getWalletBtn()}
      </Navbar>
    );
  }
}

function mapStateToProps({ wallet, balance }) {
  return { wallet, balance };
}

export default connect(mapStateToProps)(Header);
