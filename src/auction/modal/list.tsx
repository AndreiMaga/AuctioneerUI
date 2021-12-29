import React, { Component } from "react";
import List from "@mui/material/List";
import ListSubheader from "@mui/material/ListSubheader";
import ListItemText from "@mui/material/ListItemText";
import { IBid } from "../../data/auction";
import { IconButton, ListItem } from "@mui/material";

export interface IMyListState {
  data?: IBid[];
}

export default class MyList extends Component<{}, IMyListState> {
  constructor(props: {}) {
    super(props);
    this.state = {};
  }

  update(data: IMyListState) {
    this.setState(data);
  }

  pruneEmail(str: string | undefined) {
    if (str === undefined) return str;
    if (!str.includes("@")) return str;
    return str.substring(0, str.lastIndexOf("@"));
  }

  showBid(bid:number | undefined){
    if(bid === undefined)
      bid = 0
    return "$" + parseFloat(bid.toString()).toFixed(2)
  }

  render() {
    return (
      <div>
        <List
          sx={{
            width: "100%",
            maxWidth: 700,
            bgcolor: "#454545",
            height: 300,
            maxHeight: 300,
            overflow:"auto"
          }}
          component="div"
          aria-labelledby="nested-list-subheader"
          subheader={
            <ListSubheader
              sx={{ bgcolor: "#555555", color: "background.paper" }}
              component="div"
              id="nested-list-subheader"
            >
              Bids
            </ListSubheader>
          }
        >
          {this.state.data?.reverse().map((m) => (
            <ListItem
              secondaryAction={
                <IconButton
                  disableFocusRipple
                  sx={{
                    color: "background.paper",
                    cursor: "default !important",
                  }}
                  disableRipple
                  edge="end"
                >
                  {this.showBid(m.bid)}
                </IconButton>
              }
            >
              <ListItemText
                sx={{ color: "background.paper" }}
                primary={this.pruneEmail(m.username)}
              />
            </ListItem>

            // <ListItemText primary={m.bid} secondary={m.username}></ListItemText>
          ))}
        </List>
      </div>
    );
  }
}
