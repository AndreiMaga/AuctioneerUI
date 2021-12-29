import React from "react";
import Modal from "@mui/material/Modal";
import Tooltip from "@mui/material/Tooltip";
import Box from "@mui/material/Box";
import { Grid, SxProps, Theme } from "@mui/material";
import Typography from "@mui/material/Typography";
import { docToIBidArray, IAuction, IBid } from "../../data/auction";
import { auth, database } from "../../firebase/init";
import currentUser from "../../user/user";
import styles from "./modal.module.css";
import Moment from "react-moment";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faGavel } from "@fortawesome/free-solid-svg-icons";
import { library } from "@fortawesome/fontawesome-svg-core";

import { Button, Form } from "react-bootstrap";

import MyChart, { IMyChartState } from "./chart";
import MyList from "./list";
import {
  collection,
  DocumentData,
  onSnapshot,
  orderBy,
  query,
  QuerySnapshot,
  Unsubscribe,
} from "firebase/firestore";
import { bid } from "../../api/api";

library.add(faGavel);

export interface IModalState {
  open: boolean;
  auction?: IAuction;
  loading: boolean
}

export default class MyModal extends React.Component<{}, IModalState> {
  data: IBid[];
  nextBid: number;
  subscriber: Unsubscribe | undefined;
  chartRef: React.RefObject<MyChart>;
  listRef: React.RefObject<MyList>;

  style: SxProps<Theme> = {
    position: "absolute",
    top: "50%",
    left: "50%",
    transform: "translate(-50%, -50%)",
    width: 800,
    bgcolor: "#222222",
    border: "2px solid #000",
    boxShadow: 24,
    p: 4,
  };

  constructor(props: {}) {
    super(props);
    this.data = [];
    this.nextBid = 0;

    this.chartRef = React.createRef<MyChart>();
    this.listRef = React.createRef<MyList>();
    this.state = {
      open: false,
      loading:false
    };
  }

  openModal(auction: IAuction) {
    this.setState({
      open: true,
      auction: auction,
    });

    if (auction.bidsId === undefined || auction.bidsId === null) {
      return;
    }
    // subscribe to db
    const q = query(
      collection(database, "bids", auction.bidsId.trim(), "bids"),
      orderBy("time", "asc")
    );

    this.subscriber = onSnapshot(q, this.dataChanged.bind(this));
  }

  showTimer() {
    if (this.state.auction?.endTime !== undefined)
      return (
        <div style={{ color: "#fff" }}>
          {"Time left: "}
          <Moment
            filter={(r) => r.replace("-", "")}
            date={this.state.auction.endTime}
            format="hh:mm:ss"
            durationFromNow
            trim
            interval={1000}
          />
        </div>
      );
  }

  dataChanged(snapshot: QuerySnapshot<DocumentData>) {
    let data: IBid[] = [];

    snapshot.forEach((doc) => {
      data.push(docToIBidArray(doc));
    });

    if (data !== [] && data !== this.data) {
      let chartState: IMyChartState = {
        chartData: [],
        chartLabels: [],
      };

      data.forEach((bid) => {
        if (bid.bid === undefined || bid.time === undefined) {
          return;
        }
        chartState.chartData?.push(bid.bid);
        chartState.chartLabels?.push(
          new Date(bid.time * 1000).toLocaleDateString()
        );
      });

      this.chartRef.current?.update(chartState);
      this.listRef.current?.update({
        data: data,
      });

      this.data = data;
      this.forceUpdate();
    }
  }

  showBidButton() {
    let shouldBeDisabled = currentUser.availableFunds
      ? this.nextBid > currentUser.availableFunds
      : true;
    return (
      <Form className="d-flex">
        <Tooltip
          title={
            shouldBeDisabled ? "Insufficient funds." : `Bid ${this.nextBid}`
          }
        >
          <span>
            <Button
              // disabled={shouldBeDisabled}
              onClick={this.handleBid.bind(this)}
              type="submit"
              variant="outline-success"
            >
              Bid{"  "}
              <FontAwesomeIcon icon="gavel" />
            </Button>
          </span>
        </Tooltip>
      </Form>
    );
  }

  showCurrentBid() {
    let lastItem = this.data[this.data.length - 1];

    return (
      <p style={{ color: "#fff" }}>
        Current Bid: {lastItem?.bid ? "$" + lastItem.bid : "unknown"}
      </p>
    );
  }

  showNextBid() {
    let lastItem = this.data[this.data.length - 1];
    if (lastItem === undefined || lastItem === null) {
      return;
    }

    if (lastItem.bid === undefined) {
      return <p style={{ color: "#fff" }}>Next Bid: unknown</p>;
    }

    this.nextBid =
      parseInt(lastItem.bid as unknown as string) +
      lastItem.bid * (this.state.auction?.bidPercent || 0.1);

    let tax = this.nextBid * 0.01; // because we live in a capitalsit world :D

    return (
      <p style={{ color: "#fff" }}>
        Next Bid: {(this.nextBid + tax).toFixed(2)}
        <Tooltip title="Non refundable tax.">
          <span style={{ color: "#333333" }}>
            {"  "}
            Tax: 1% ({tax.toFixed(2)})
          </span>
        </Tooltip>
      </p>
    );
  }


  async handleBid(event: React.MouseEvent<HTMLButtonElement>){
    event.preventDefault()
    if(auth.currentUser === undefined || auth.currentUser?.uid === undefined || this.state.auction === undefined){
      return
    }

    this.setState({loading: true})


    let response = await bid(auth.currentUser?.uid, this.nextBid, this.state.auction?.id)

    if(response.error){
      // should show the error
      console.error(response.error)
    }

    if(response.success){
      this.setState({loading: false})
      console.log(response.success)
    }

  }


  handleClose() {
    // unsubscribe
    if (this.subscriber !== undefined) this.subscriber();

    this.setState({
      open: false,
      auction: undefined,
    });
  }

  render() {
    return (
      <div>
        <Modal
          open={this.state.open}
          onClose={this.handleClose.bind(this)}
          aria-labelledby="modal-modal-title"
          aria-describedby="modal-modal-description"
        >
          <Box sx={this.style}>
            <Typography
              sx={{ color: "background.paper" }}
              id="modal-modal-title"
              variant="h6"
              component="h2"
            >
              {this.state.auction?.name}
            </Typography>

            <Typography id="modal-modal-description" sx={{ mt: 2 }}>
              <Grid container spacing={2}>
                <Grid item xs={8}>
                  <Grid container spacing={2}>
                    <Grid item xs={12}></Grid>

                    <Grid item xs={12}>
                      {this.showCurrentBid()}
                      {this.showNextBid()}
                      <br />
                      {this.showBidButton()}
                    </Grid>
                  </Grid>

                  <Typography
                    sx={{ color: "background.paper" }}
                    id="modal-modal-title"
                    variant="h6"
                    component="h2"
                  >
                    {this.state.auction?.description}
                  </Typography>
                </Grid>
                <Grid item xs={4}>
                  <MyList ref={this.listRef}></MyList>
                </Grid>
                <Grid item xs={12}>
                  <MyChart ref={this.chartRef}></MyChart>
                </Grid>
              </Grid>
            </Typography>
          </Box>
        </Modal>
      </div>
    );
  }
}
