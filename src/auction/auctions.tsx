import React from "react";
import { IAuction, docToIAuction } from "../data/auction";
import { AuctionCard } from "./auctionCard";
import styles from "./auction.module.css";
import GridGenerator from "../utility/gridGen";
import { database } from "../firebase/init";
import MyModal from "./modal/modal";
import {
  collection,
  DocumentData,
  onSnapshot,
  query,
  QuerySnapshot,
  Unsubscribe,
} from "firebase/firestore";

interface IAuctionsState {
  data: IAuction[];
}

export class Auctions extends React.Component<{}, IAuctionsState> {
  alldata?: IAuction[];
  subscriber: Unsubscribe | undefined;
  generatorKey: number = 1;
  subscribers: Map<string, (snapshot: IAuction) => void>;
  modal: React.RefObject<MyModal>;

  constructor(props: {}) {
    super(props);
    this.alldata = [];
    this.subscribers = new Map();
    this.modal = React.createRef<MyModal>();
    this.state = {
      data: [],
    };
  }

  filter(freshData: IAuction[]) {
    let now = Date.now();

    freshData = freshData.filter((m) => (m.endTime ? m.endTime > now : true));

    this.setState({
      data: freshData,
    });
  }

  dataChanged(snapshot: QuerySnapshot<DocumentData>) {
    let data: IAuction[] = [];
    snapshot.forEach((doc) => {
      let docIAuction = docToIAuction(doc);

      let func = this.subscribers.get(docIAuction.id);

      if (func !== undefined) func(docIAuction);

      data.push(docToIAuction(doc));
    });

    if (data !== [] && data !== this.alldata) {
      this.alldata = data;
      this.generatorKey += 1; // force GridGenerator to update
      this.filter(this.alldata);
    }
  }

  async componentDidMount() {
    const q = query(collection(database, "auctions"));

    this.subscriber = onSnapshot(q, this.dataChanged.bind(this));
  }

  render() {
    return (
      <div>
        <div className={styles.CardContainer}>
          <GridGenerator key={this.generatorKey} cols={3}>
            {this.state.data.map((auction) => (
              <AuctionCard
                key={auction.id}
                auction={auction}
                subscribeTo={this.subscribers}
                openModal={this.modal?.current?.openModal}
                modalContext={this.modal?.current}
              />
            ))}
          </GridGenerator>
        </div>
        <MyModal ref={this.modal}></MyModal>
      </div>
    );
  }
}
