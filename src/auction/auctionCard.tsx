import React from "react";
import { Button, Card, ListGroup, ListGroupItem } from "react-bootstrap";
import Moment from "react-moment";
import { IAuction } from "../data/auction";
import styles from "./auctioncard.module.css";
import MyModal from "./modal/modal";

interface IAuctionCardProps {
  auction: IAuction;
  key: string;
  subscribeTo: Map<string, (snapshot: IAuction) => void>;
  openModal: ((auction: IAuction) => void) | undefined;
  modalContext: MyModal | null;
}

interface IAuctionCardState {
  auction: IAuction;
}

export class AuctionCard extends React.Component<
  IAuctionCardProps,
  IAuctionCardState
> {
  constructor(props: IAuctionCardProps) {
    super(props);
    this.state = { auction: this.props.auction };
  }

  auctionCardChanged(data: IAuction) {
    if (data !== { id: this.props.auction.id } && data !== this.state.auction) {
      this.setState({ auction: data });
    }
  }

  showBuyOut() {
    let shouldBeDisabled = true;

    if (
      this.state.auction.currentBid !== undefined &&
      this.state.auction.buyoutCutoff !== undefined &&
      this.state.auction.buyoutPrice !== undefined
    )
      shouldBeDisabled =
        this.state.auction.currentBid * this.state.auction.buyoutCutoff >
        this.state.auction.buyoutPrice;
    return (
      <Button
        className={styles.endlast}
        disabled={shouldBeDisabled}
        variant={shouldBeDisabled ? "outline-danger" : "outline-success"}
      >
        Buyout
      </Button>
    );
  }

  render() {
    return (
      <Card className={styles.card}>
        <Card.Img variant="top" src="img/filler.png" />
        <Card.Body className={styles.darkContent}>
          <Card.Title>{this.state.auction.name}</Card.Title>
          <Card.Text>{this.state.auction.description}</Card.Text>
        </Card.Body>
        <ListGroup className={"list-group-flush " + styles.darkContent}>
          <ListGroupItem className={styles.darkContent}>
            {this.state.auction.endTime ? (
              <div>
                {"Time left: "}
                <Moment
                  filter={this.removeNegativeSign}
                  date={this.state.auction.endTime}
                  format="hh:mm:ss"
                  durationFromNow
                  trim
                  interval={1000}
                />
              </div>
            ) : (
              "No time limit"
            )}

            {this.state.auction.currentBid
              ? `Current bid: $${this.state.auction.currentBid}`
              : `No bid`}
            <br />
          </ListGroupItem>
        </ListGroup>
        <Card.Body className={styles.darkContent}>
          <Button variant="outline-success" onClick={this.openModal.bind(this)}>
            Bid
          </Button>
          {this.showBuyOut()}
        </Card.Body>
      </Card>
    );
  }

  removeNegativeSign(date: string): string {
    return date.replace("-", "");
  }
  openModal(event: React.MouseEvent<HTMLButtonElement>) {
    if (this.props?.openModal !== undefined) {
      this.props.openModal.bind(this.props.modalContext)(this.props.auction);
    }
  }

  componentDidMount() {
    this.props.subscribeTo.set(
      this.state.auction.id,
      this.auctionCardChanged.bind(this)
    );
  }

  componentWillUnmount() {}
}
