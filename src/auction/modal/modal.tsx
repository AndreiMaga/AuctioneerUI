import React from "react";
import Modal from "@mui/material/Modal";
import Box from "@mui/material/Box";
import { SxProps, Theme } from "@mui/material";
import Typography from "@mui/material/Typography";
import { IAuction } from "../../data/auction";

export interface IModalState {
  open: boolean;
  auction?: IAuction 
}

export default class MyModal extends React.Component<{}, IModalState> {
  style: SxProps<Theme> = {
    position: "absolute",
    top: "50%",
    left: "50%",
    transform: "translate(-50%, -50%)",
    width: 400,
    bgcolor: "background.paper",
    border: "2px solid #000",
    boxShadow: 24,
    p: 4,
  };

  constructor(props: {}) {
    super(props);
    this.state = {
      open: false,
    };
  }

  openModal(auction: IAuction){
    this.setState({
        open: true,
        auction: auction
    })
  }

  handleClose() {
    this.setState({
      open: false,
      auction: undefined
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
            <Typography id="modal-modal-title" variant="h6" component="h2">
              {this.state.auction?.name}
            </Typography>
            <Typography id="modal-modal-description" sx={{ mt: 2 }}>
            {this.state.auction?.description}
            </Typography>
          </Box>
        </Modal>
      </div>
    );
  }
}
