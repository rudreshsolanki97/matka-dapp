import React from "react";
import { Container, Row, Col, Modal, Button } from "react-bootstrap";
import { connect } from "react-redux";
import { TIMER_FORMAT } from "../helpers/constant";
import { SubmitContractTxGeneral, GetNativeBalance } from "../wallets/metamask";
import Timer from "./common/Timer";

const KeyFieldView = ({ k, v }) => (
  <Row>
    <Col className="key" sm={6} md={6} lg={6}>
      {k}
    </Col>
    <Col className="value" sm={6} md={6} lg={6}>
      {v}
    </Col>
  </Row>
);

class SingleMatka extends React.Component {
  constructor(props) {
    super(props);
  }

  renderAllMatkaDetails() {
    if (!this.props.matkaDetails.currentPool) return "";
    return (
      <Container>
        {Object.keys(this.props.matkaDetails.currentPool)
          .map((k) => {
            return { k, v: this.props.matkaDetails.currentPool[k] };
          })
          .map((x) => KeyFieldView(x))}
      </Container>
    );
  }

  renderCurrentPool() {
    console.log(
      "this.props.matkaDetails.currentPool",
      this.props.matkaDetails.currentPool
    );
    if (!this.props.matkaDetails.currentPool) return "";
    return (
      <Container>
        {KeyFieldView({
          k: `Pool Number`,
          v: `${this.props.matkaDetails.currentPool.poolId}`,
        })}
        {KeyFieldView({
          k: "Total Amount In Pool",
          v: this.props.matkaDetails.currentPool.totalPoolAmount,
        })}
        {KeyFieldView({
          k: `Bet End In (${TIMER_FORMAT})`,
          v: (
            <Timer
              startDate={new Date().getTime()}
              endDate={this.props.matkaDetails.currentPool.endTime * 1000}
            />
          ),
        })}
      </Container>
    );
  }

  fetchUserBets() {}

  render() {
    console.log(
      "this.props.matkaDetails.currentPool",
      this.props.matkaDetails.currentPool
    );

    return (
      <div className="single-matka">
        <Container>
          <Row>
            <Col lg={6} sm={12} md={6} className="single-matka-section left">
              <div className="single-matka-section--title">Matka Details</div>
              <div className="single-matka-section--body">
                {this.renderCurrentPool()}
              </div>
            </Col>
            <Col lg={6} sm={12} md={6} className="single-matka-section">
              <div className="single-matka-section--title">BET</div>
              <div className="single-matka-section--body"></div>
            </Col>
          </Row>
        </Container>
      </div>
    );
  }
}

export default connect()(SingleMatka);
