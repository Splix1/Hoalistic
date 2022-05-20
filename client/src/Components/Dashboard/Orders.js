import * as React from 'react';
import Link from '@mui/material/Link';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Title from './Title';

// Generate Order Data
function createData(id, date, name, shipTo, amount) {
  return { id, date, name, shipTo, amount };
}

const rows = [
  createData(0, '20 Apr, 2019', 'Ur Mawm', '1A', 312.44),
  createData(1, '16 Mar, 2019', 'Mikey Julian', '2A', 866.99),
  createData(2, '16 Mar, 2019', 'Deez Nuts', '1B', 100.81),
  createData(3, '16 Mar, 2019', 'Gabe Newell', '2B', 654.39),
  createData(4, '15 Mar, 2019', 'Michael Morhaime', '1S', 212.79),
];

function preventDefault(event) {
  event.preventDefault();
}

export default function Orders() {
  return (
    <React.Fragment>
      <Title>Recent Payments</Title>
      <Table size="small">
        <TableHead>
          <TableRow>
            <TableCell>Date</TableCell>
            <TableCell>Tenant</TableCell>
            <TableCell>Unit</TableCell>
            <TableCell align="right">Fee Amount</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {/* {rows.map((row) => (
            <TableRow key={row.id}>
              <TableCell>{row.date}</TableCell>
              <TableCell>{row.name}</TableCell>
              <TableCell>{row.shipTo}</TableCell>
              <TableCell align="right">{`$${row.amount}`}</TableCell>
            </TableRow>
          ))} */}
        </TableBody>
      </Table>
      <Link color="primary" href="#" onClick={preventDefault} sx={{ mt: 3 }}>
        See more orders
      </Link>
    </React.Fragment>
  );
}
