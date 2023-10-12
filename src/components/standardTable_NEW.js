import React, { useState, useCallback, useEffect } from "react"
import PropTypes from "prop-types"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  IconButton,
  TablePagination,
  Box,
  // Typography,
} from "@material-ui/core"



import { withStyles, } from '@material-ui/core/styles'
// import HighlightedInformation from "./HighlightedInformation"
import ConfirmationDialog from "./ConfirmationDialog"
import EditDialog from "./EditDialog"



const styles = (theme) => ({
  // tableColor: {
  //   '&.MuiTableRow-root.Mui-selected': {
  //     backgroundColor: 'red'
  //   }
  // },
  MuiTableRow: {
    '&.MuiTableRow-root.Mui-selected, &.MuiTableRow-root.Mui-selected:hover': {
      backgroundColor: "#1976D2",
      '& th.MuiTableCell-body': {
        color: 'white'
      },
    }
  },
  tableWrapper: {
    overflowX: "auto",
    maxHeight: "1000px",
  },
  alignRight: {
    display: "flex",
    flexDirection: "row-reverse",
    alignItems: "center",
    paddingLeft: theme.spacing(0),
  },
  blackIcon: {
    color: theme.palette.common.black,
  },
  avatar: {
    width: 28,
    height: 28,
  },
  firstData: {
    paddingLeft: theme.spacing(0),
  },
  iconButton: {
    padding: theme.spacing(0),

  },
  dBlock: {
    display: "block",
  },
  dNone: {
    display: "none",
  },
  paddingNone: {
    "& th:first-child": {
      paddingLeft: 10
    },
  },
  tableCellClass: {
    paddingLeft: 5,
    paddingRight: "0px !important",
    fontSize: 12
  },
  iconActiveCSS: {
    color: 'red'
  },
  iconDeactiveCSS: {
    color: 'white'
  }
});

const StyledTableCell = withStyles((theme) => ({

  body: {
    fontSize: 12
  }
}))(TableCell);

function CustomTable(props) {
  const { classes, targets, setTargets, headername, disabledTable, activeName, setActiveName, setIsDeleteRow, setIsModified, setChangeData } = props;

  // console.log("disabled111=", disabled);
  const [columns, setcolumns] = useState([]);

  const [page, setPage] = React.useState(0);
  const [rowsPerPage, setRowsPerPage] = React.useState(10);

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(+event.target.value);
    setPage(0);
  };

  const GetHeader = useCallback(() => {
    const _Column = [];
    const iterations = headername ? headername.length : 0;

    for (let i = 0; i < iterations; i += 1) {
      const column = { id: headername[i].id, label: headername[i].label }; //headername[i] };
      _Column.push(column);
    }
    setcolumns(_Column);
  }, [setcolumns, headername]);

  useEffect(() => {
    GetHeader();
  }, [GetHeader]);

  const [isDeleteTargetDialogOpen, setIsDeleteTargetDialogOpen] = useState(false);
  const [deleteTargetDialogRow, setDeleteTargetDialogRow] = useState(null);
  const [isProcessing, setIsProcessing] = useState(false);

  const [modifyDialogOpen, setModifyDialogOpen] = useState(false);
  const [selectedData, setSelectedData] = useState({});



  const deleteTarget = useCallback(() => {
    // if (targets.length <= 1)
    //   return;
    setIsProcessing(true);

    setIsDeleteTargetDialogOpen(false);
    setIsProcessing(false);

    const newTargets = [...targets];

    setTargets(newTargets);

    setIsDeleteRow(true);
  }, [
    setIsDeleteTargetDialogOpen,
    setIsProcessing,
    targets,
    // deleteTargetDialogRow,
    setIsDeleteRow,
    setTargets
  ]);



  const modifyTarget = useCallback(() => {
    setIsProcessing(true);
    setModifyDialogOpen(false);
    setIsProcessing(false);
    const newTargets = [...targets];
    setTargets(newTargets);
  }, [
    setModifyDialogOpen,
    setIsProcessing,
    setTargets,
    targets
  ]);


  const handleDeleteTargetDialogClose = useCallback(() => {
    setIsDeleteTargetDialogOpen(false);
  }, [setIsDeleteTargetDialogOpen]);

  const handleDeleteTargetDialogOpen = useCallback((row) => {
    if (disabledTable)
      return;
    setIsDeleteTargetDialogOpen(true);
    setDeleteTargetDialogRow(row);
  },
    [setIsDeleteTargetDialogOpen, setDeleteTargetDialogRow, disabledTable]
  );


  const handleModifyDialogClose = useCallback(() => {
    setModifyDialogOpen(false);
  }, [setModifyDialogOpen]);

  const handleModifyDialogOpen = useCallback((row) => {
    if (disabledTable)
      return;
    setModifyDialogOpen(true);

  },
    [setModifyDialogOpen, disabledTable]
  );

  const handleActiveIndex = (event, row) => {
    setActiveName(row.id);
    setSelectedData(row);
    //console.log("=======", row.id);
  }

  return (
    <div >
      {/* <h5>{title}</h5> */}
      <ConfirmationDialog
        open={isDeleteTargetDialogOpen}
        title="Confirmation"
        content={
          deleteTargetDialogRow ? (
            <span>
              {"Do you really want to remove the Data "}
              <b>{deleteTargetDialogRow.name}</b>
              {" from your list?"}
            </span>
          ) : null
        }
        onClose={handleDeleteTargetDialogClose}
        onConfirm={deleteTarget}
        loading={isProcessing}
      />
      <EditDialog
        originalData={selectedData}
        open={modifyDialogOpen}
        title="Modification"
        onClose={handleModifyDialogClose}
        onConfirm={modifyTarget}
        loading={isProcessing}
        setModificationData={setChangeData}
        setIsModified={setIsModified}
      />
      <Box width="100%">
        <div className={classes.tableWrapper}>
          {targets.length > 0 ? (
            <Table size="small" aria-labelledby="tableTitle" style={{ tableLayout: "auto" }}>
              <TableHead>
                <TableRow>
                  {columns.map((column) => (
                    <StyledTableCell
                      key={column.id}
                      align={column.align}
                      className={classes.tableCellClass}
                      style={{ color: !disabledTable ? "white" : 'rgba(0, 0, 0, 0.5)', backgroundColor: "black" }}
                    // size="small"
                    // component="th" scope="row"
                    >
                      {column.label}
                    </StyledTableCell>
                  ))}
                </TableRow>
              </TableHead>
              <TableBody >
                {targets
                  .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                  .map((row, index) => (
                    // !row.isRemoved &&
                    <TableRow hover tabIndex={-1} key={index}
                      onClick={(event) => handleActiveIndex(event, row)}
                      selected={row.id === activeName ? true : false}
                      classes={{ root: classes.MuiTableRow }}>

                      {columns.map((column) => {
                        const value = row[column.id];
                        const active = row["_activeStatus"];
                        const headName = column.id;
                        return (
                          <TableCell
                            key={column.id}
                            align={column.align}
                            className={classes.tableCellClass}
                            style={{
                              width: "auto", color: !disabledTable ?
                                (((headName === "brokerName" && active === "True") || (headName === "bankrollPercent" && value > 20)) ? "limeGreen" :
                                  ((headName === "brokerName" && active === "False") || (headName === "bankrollPercent" && value < 20)) ? "red" : "black") :
                                'rgba(0, 0, 0, 0.5)'
                            }}
                          // size="small"
                          // component="th" scope="row"
                          >
                            {value !== undefined && typeof value === "number" ? value :
                              value !== undefined && typeof value !== "number" ? value :
                                headName === "delete" ?
                                  <Box display="flex" justifyContent="flex-end">
                                    <IconButton
                                      className={classes.iconButton}
                                      onClick={() => {
                                        handleDeleteTargetDialogOpen(row);
                                      }}
                                      aria-label="Delete"
                                    >
                                      <span role="img" aria-label="so cool" style={{ fontSize: '0.7em', color: 'red' }}>
                                        ❌
                                      </span>
                                    </IconButton>
                                  </Box> :
                                  <Box display="flex" justifyContent="flex-end">
                                    <IconButton
                                      className={classes.iconButton}
                                      onClick={() => {
                                        handleModifyDialogOpen(row);
                                      }}
                                      aria-label="Delete"
                                    >
                                      <span role="img" aria-label="so cool" style={{ fontSize: '0.7em', color: 'red' }}>
                                        ✍
                                      </span>
                                    </IconButton>
                                  </Box>}
                          </TableCell>
                        );
                      })}

                    </TableRow>
                  ))}
              </TableBody>
            </Table>
          ) : (
            <Box m={2}>
              {/* <HighlightedInformation>
                No Datas added yet.
              </HighlightedInformation> */}
            </Box>
          )}
        </div>
        <div className={classes.alignRight}>
          <TablePagination
            rowsPerPageOptions={[5, 10, 20, 50, 100]}
            labelRowsPerPage=""
            component="div"
            count={targets.length}
            rowsPerPage={rowsPerPage}
            page={page}
            onPageChange={handleChangePage}
            onRowsPerPageChange={handleChangeRowsPerPage}
          />
        </div>
      </Box >
    </div >

  );
}

CustomTable.propTypes = {
  classes: PropTypes.object.isRequired,
  targets: PropTypes.arrayOf(PropTypes.object).isRequired,
  setTargets: PropTypes.func.isRequired,
  // pushMessageToSnackbar: PropTypes.func,
};

export default withStyles(styles, { withTheme: true })(CustomTable);
