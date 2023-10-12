import React, { useEffect, useState } from "react"
import PropTypes from "prop-types"
import {
  Dialog,
  DialogTitle,
  // DialogContent,
  // DialogContentText,
  DialogActions,
  Button
} from "@material-ui/core"
import ButtonCircularProgress from "./ButtonCircularProgress"


import { TextField } from '@material-ui/core'

function ConfirmationDialog(props) {
  const { open, onClose, loading, title, onConfirm, setIsModified, setModificationData, originalData } = props;
  const [_threshold, setThreshold] = useState(0);
  const [topUP, setTopUp] = useState(0);

  useEffect(() => {
    setThreshold(originalData.threshold);
    setTopUp(originalData.topUpAmount);
  }, [originalData]);

  const updateThreshold = (newValue) => {
    setThreshold(newValue);
  }
  const updateToUp = (newValue) => {
    setTopUp(newValue);
  }

  const clickYes = () => {
    onConfirm();
    setIsModified(true);
    var change = {
      topUpAmount: topUP,
      threshold: _threshold
    };
    setModificationData(change);
  }

  return (
    <Dialog
      open={open}
      onClose={onClose}
      //disableBackdropClick={loading}
      disableEscapeKeyDown={loading}
    >
      <DialogTitle>{title}</DialogTitle>
      {/* <DialogContent>
        <DialogContentText>{content}</DialogContentText>
      </DialogContent> */}
      <div >
        <div style={{ margin: 10, marginLeft: 40, marginRight: 40, display: "flex", justifyContent: "Space-between", width: 300 }}>
          <h6 style={{ display: "flex", alignItems: "center" }}>Threshold :</h6>
          <TextField type="number" style={{ width: 180 }} inputProps={{ step: "1", min: 1 }}
            id="ss1" variant="outlined" size="small" disabled={false}
            value={_threshold} onChange={(event) => { updateThreshold(event.target.value) }} />
        </div>
        <div style={{ margin: 10, marginLeft: 40, marginRight: 40, display: "flex", justifyContent: "Space-between", width: 300 }}>
          <h6 style={{ display: "flex", alignItems: "center" }}>Bankroll :</h6>
          <TextField type="number" style={{ width: 180 }} inputProps={{ step: "1", min: 1 }}
            id="ss1" variant="outlined" size="small" disabled={false}
            value={topUP} onChange={(event) => { updateToUp(event.target.value) }} />
        </div>

      </div>
      <DialogActions>
        <Button onClick={onClose} disabled={loading}>
          Cancel
        </Button>
        <Button
          color="secondary"
          onClick={clickYes}
          variant="contained"
          disabled={loading}
        >
          Yes {loading && <ButtonCircularProgress />}
        </Button>
      </DialogActions>
    </Dialog>
  );
}

ConfirmationDialog.propTypes = {
  open: PropTypes.bool,
  onClose: PropTypes.func,
  loading: PropTypes.bool,
  title: PropTypes.string,
  content: PropTypes.oneOfType([PropTypes.string, PropTypes.node]),
  onConfirm: PropTypes.func
};

export default ConfirmationDialog;
