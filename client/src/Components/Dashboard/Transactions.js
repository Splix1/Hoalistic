import * as React from 'react';
import Backdrop from '@mui/material/Backdrop';
import Box from '@mui/material/Box';
import Modal from '@mui/material/Modal';
import Fade from '@mui/material/Fade';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';
import { Context } from '../ContextProvider';
import { IconButton, Paper } from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableRow from '@mui/material/TableRow';
import TableHead from '@mui/material/TableHead';
import TablePagination from '@mui/material/TablePagination';
import FirstPageIcon from '@mui/icons-material/FirstPage';
import KeyboardArrowLeft from '@mui/icons-material/KeyboardArrowLeft';
import KeyboardArrowRight from '@mui/icons-material/KeyboardArrowRight';
import LastPageIcon from '@mui/icons-material/LastPage';
import TableContainer from '@mui/material/TableContainer';
import TableFooter from '@mui/material/TableFooter';
import { useTheme } from '@mui/material/styles';
const dayjs = require('dayjs');

const style = {
  position: 'absolute',
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  width: '65vw',
  height: '75vh',
  bgcolor: 'background.paper',
  border: '2px solid #000',
  boxShadow: 2,
  p: 4,
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
};

function TablePaginationActions(props) {
  const theme = useTheme();
  const { count, page, rowsPerPage, onPageChange } = props;

  const handleFirstPageButtonClick = (event) => {
    onPageChange(event, 0);
  };

  const handleBackButtonClick = (event) => {
    onPageChange(event, page - 1);
  };

  const handleNextButtonClick = (event) => {
    onPageChange(event, page + 1);
  };

  const handleLastPageButtonClick = (event) => {
    onPageChange(event, Math.max(0, Math.ceil(count / rowsPerPage) - 1));
  };

  return (
    <Box sx={{ flexShrink: 0, ml: 2.5 }}>
      <IconButton
        onClick={handleFirstPageButtonClick}
        disabled={page === 0}
        aria-label="first page"
      >
        {theme.direction === 'rtl' ? <LastPageIcon /> : <FirstPageIcon />}
      </IconButton>
      <IconButton
        onClick={handleBackButtonClick}
        disabled={page === 0}
        aria-label="previous page"
      >
        {theme.direction === 'rtl' ? (
          <KeyboardArrowRight />
        ) : (
          <KeyboardArrowLeft />
        )}
      </IconButton>
      <IconButton
        onClick={handleNextButtonClick}
        disabled={page >= Math.ceil(count / rowsPerPage) - 1}
        aria-label="next page"
      >
        {theme.direction === 'rtl' ? (
          <KeyboardArrowLeft />
        ) : (
          <KeyboardArrowRight />
        )}
      </IconButton>
      <IconButton
        onClick={handleLastPageButtonClick}
        disabled={page >= Math.ceil(count / rowsPerPage) - 1}
        aria-label="last page"
      >
        {theme.direction === 'rtl' ? <FirstPageIcon /> : <LastPageIcon />}
      </IconButton>
    </Box>
  );
}

export default function Transactions() {
  const [open, setOpen] = React.useState(false);
  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);
  const { state, stateTransactions } = React.useContext(Context);
  const [exitColor, setExitColor] = React.useState('white');
  const [page, setPage] = React.useState(0);
  const [rowsPerPage, setRowsPerPage] = React.useState(10);
  const [transactions, setTransactions] = React.useState(stateTransactions);
  const [currentFilter, setCurrentFilter] = React.useState('date');
  const [sortLowestHighest, setSortLowestHighest] = React.useState(true);

  const emptyRows =
    page > 0 ? Math.max(0, (1 + page) * rowsPerPage - transactions?.length) : 0;

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  const filterByDate = () => {
    let sortedByDate;
    if (sortLowestHighest) {
      sortedByDate = transactions?.sort(
        (a, b) => (a.date > b.date) - (a.date < b.date)
      );
    } else {
      sortedByDate = transactions?.sort(
        (a, b) => (a.date < b.date) - (a.date > b.date)
      );
    }
    setTransactions(sortedByDate);
  };

  const filterByAmount = () => {
    let sortedByAmount;
    if (sortLowestHighest) {
      sortedByAmount = transactions?.sort(
        (a, b) => (a.amount > b.amount) - (a.amount < b.amount)
      );
    } else {
      sortedByAmount = transactions?.sort(
        (a, b) => (a.amount < b.amount) - (a.amount > b.amount)
      );
    }
    setTransactions(sortedByAmount);
  };

  const filterByName = () => {
    let sortedByName;
    if (sortLowestHighest) {
      sortedByName = transactions?.sort((a, b) => a.name.localeCompare(b.name));
    } else {
      sortedByName = transactions
        ?.sort((a, b) => a.name.localeCompare(b.name))
        .reverse();
    }
    setTransactions(sortedByName);
  };

  const exportTransactions = () => {
    let text = `Date, Name, Amount, Categories \n`;
    for (let i = 0; i < stateTransactions?.length; i++) {
      let transaction = stateTransactions[i];
      let transactionDate = dayjs(transaction.date);
      text += `${transactionDate.$M + 1}/${transactionDate.$D}/${
        transactionDate.$y
      }, ${transaction.name}, ${transaction.amount}, ${transaction.categories
        ?.split(', ')
        .join('/')} \n`;
    }

    let blob = new Blob([text], { type: 'text/plain' });
    let a = document.createElement('a');
    const object_URL = URL.createObjectURL(blob);
    a.href = object_URL;
    a.download = `Transactions.csv`;
    document.body.appendChild(a);
    a.click();
    URL.revokeObjectURL(object_URL);
  };

  return (
    <div>
      <Button
        onClick={handleOpen}
        fullWidth
        variant="contained"
        style={{ width: 'fit-content', height: '1.5rem' }}
      >
        Transactions
      </Button>
      <Modal
        aria-labelledby="transition-modal-title"
        aria-describedby="transition-modal-description"
        open={open}
        onClose={handleClose}
        closeAfterTransition
        BackdropComponent={Backdrop}
        BackdropProps={{
          timeout: 500,
        }}
      >
        <Fade in={open}>
          <Box id="scenarios" sx={style}>
            <IconButton
              onClick={() => setOpen(false)}
              id="x"
              onMouseEnter={() => setExitColor('red')}
              onMouseLeave={() => setExitColor('white')}
              style={{
                color: exitColor,
              }}
            >
              <CloseIcon />
            </IconButton>
            <div
              id="scenarios"
              className="display-column"
              style={{
                overflow: 'scroll',
                alignItems: 'center',
                width: '65vw',
              }}
            >
              <Typography
                sx={{
                  fontSize: '2rem',
                  color: '#90caf9',
                  marginBottom: '1rem',
                }}
              >
                Transactions
              </Typography>
              <TableContainer component={Paper}>
                <Table
                  sx={{ minWidth: 500 }}
                  aria-label="custom pagination table"
                >
                  <TableHead>
                    <TableRow>
                      <TableCell
                        align="center"
                        style={{
                          color: '#90caf9',
                          fontSize: '1.5rem',
                          cursor: 'pointer',
                          textDecoration:
                            currentFilter === 'date' ? 'underline' : 'none',
                        }}
                        onClick={() => {
                          if (currentFilter === 'date')
                            setSortLowestHighest(!sortLowestHighest);
                          setCurrentFilter('date');
                          filterByDate();
                        }}
                      >
                        Date
                      </TableCell>
                      <TableCell
                        align="center"
                        style={{
                          color: '#90caf9',
                          fontSize: '1.5rem',
                          cursor: 'pointer',
                          textDecoration:
                            currentFilter === 'name' ? 'underline' : 'none',
                        }}
                        onClick={() => {
                          if (currentFilter === 'name')
                            setSortLowestHighest(!sortLowestHighest);
                          setCurrentFilter('name');
                          filterByName();
                        }}
                      >
                        Name
                      </TableCell>

                      <TableCell
                        align="center"
                        style={{
                          color: '#90caf9',
                          fontSize: '1.5rem',
                          cursor: 'pointer',
                          textDecoration:
                            currentFilter === 'amount' ? 'underline' : 'none',
                        }}
                        onClick={() => {
                          if (currentFilter === 'amount')
                            setSortLowestHighest(!sortLowestHighest);
                          setCurrentFilter('amount');
                          filterByAmount();
                        }}
                      >
                        Amount
                      </TableCell>
                      <TableCell
                        align="center"
                        style={{ color: '#90caf9', fontSize: '1.5rem' }}
                      >
                        Categories
                      </TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {(rowsPerPage > 0
                      ? transactions?.slice(
                          page * rowsPerPage,
                          page * rowsPerPage + rowsPerPage
                        )
                      : transactions
                    ).map((transaction) => {
                      let date = dayjs(transaction.date);
                      return (
                        <TableRow key={transaction.id}>
                          <TableCell
                            align="center"
                            style={{ fontSize: '1rem' }}
                          >{`${date.$M + 1}/${date.$D}/${date.$y}`}</TableCell>
                          <TableCell
                            align="center"
                            style={{ fontSize: '1rem' }}
                          >
                            {transaction.name || 'No Name'}
                          </TableCell>
                          <TableCell
                            align="center"
                            style={{ fontSize: '1rem' }}
                          >
                            {transaction.amount > 0
                              ? `-$${transaction.amount}`
                              : `+$${Math.abs(transaction.amount)}`}
                          </TableCell>
                          <TableCell
                            align="center"
                            style={{ fontSize: '1rem' }}
                          >
                            {transaction.categories}
                          </TableCell>
                        </TableRow>
                      );
                    })}

                    {emptyRows > 0 && (
                      <TableRow style={{ height: 53 * emptyRows }}>
                        <TableCell colSpan={6} />
                      </TableRow>
                    )}
                  </TableBody>
                  <TableFooter>
                    <TableRow>
                      {stateTransactions?.length ? (
                        <TablePagination
                          rowsPerPageOptions={[
                            5,
                            10,
                            25,
                            50,
                            100,
                            { label: 'All', value: -1 },
                          ]}
                          colSpan={3}
                          count={transactions?.length}
                          rowsPerPage={rowsPerPage}
                          page={page}
                          SelectProps={{
                            inputProps: {
                              'aria-label': 'rows per page',
                            },
                            native: true,
                          }}
                          onPageChange={handleChangePage}
                          onRowsPerPageChange={handleChangeRowsPerPage}
                          ActionsComponent={TablePaginationActions}
                        />
                      ) : null}

                      {stateTransactions?.length > 0 ? (
                        <Button
                          variant="contained"
                          style={{ height: '1.3rem', marginTop: '2rem' }}
                          onClick={() => exportTransactions()}
                        >
                          Export all to CSV
                        </Button>
                      ) : null}
                    </TableRow>
                  </TableFooter>
                </Table>
              </TableContainer>
            </div>
          </Box>
        </Fade>
      </Modal>
    </div>
  );
}
