import React, { useState, useEffect } from 'react';
import { Routes, Route, useNavigate } from 'react-router-dom';
import { ThemeProvider, createTheme } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import Container from '@mui/material/Container';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import CircularProgress from '@mui/material/CircularProgress';
import Button from '@mui/material/Button';
import TextField from '@mui/material/TextField';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogTitle from '@mui/material/DialogTitle';
import DataTable from 'react-data-table-component';
import { backend } from 'declarations/backend';

const theme = createTheme({
  palette: {
    primary: {
      main: '#1976d2',
    },
    secondary: {
      main: '#f5f5f5',
    },
    background: {
      default: '#f5f5f5',
    },
  },
});

interface TaxPayer {
  tid: number;
  firstName: string;
  lastName: string;
  address: string;
}

const columns = [
  { name: 'TID', selector: (row: TaxPayer) => row.tid, sortable: true },
  { name: 'First Name', selector: (row: TaxPayer) => row.firstName, sortable: true },
  { name: 'Last Name', selector: (row: TaxPayer) => row.lastName, sortable: true },
  { name: 'Address', selector: (row: TaxPayer) => row.address, sortable: true },
];

function App() {
  const [taxpayers, setTaxpayers] = useState<TaxPayer[]>([]);
  const [loading, setLoading] = useState(true);
  const [openDialog, setOpenDialog] = useState(false);
  const [newTaxpayer, setNewTaxpayer] = useState<TaxPayer>({ tid: 0, firstName: '', lastName: '', address: '' });
  const [searchTid, setSearchTid] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    fetchTaxpayers();
  }, []);

  const fetchTaxpayers = async () => {
    try {
      const result = await backend.getAllTaxPayers();
      setTaxpayers(result);
      setLoading(false);
    } catch (error) {
      console.error('Error fetching taxpayers:', error);
      setLoading(false);
    }
  };

  const handleAddTaxpayer = async () => {
    try {
      await backend.addTaxPayer(
        BigInt(newTaxpayer.tid),
        newTaxpayer.firstName,
        newTaxpayer.lastName,
        newTaxpayer.address
      );
      setOpenDialog(false);
      fetchTaxpayers();
    } catch (error) {
      console.error('Error adding taxpayer:', error);
    }
  };

  const handleSearch = async () => {
    if (searchTid) {
      try {
        const result = await backend.searchTaxPayer(BigInt(searchTid));
        if (result) {
          setTaxpayers([result]);
        } else {
          setTaxpayers([]);
        }
      } catch (error) {
        console.error('Error searching taxpayer:', error);
      }
    } else {
      fetchTaxpayers();
    }
  };

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <Container maxWidth="lg">
        <Box sx={{ my: 4 }}>
          <Typography variant="h4" component="h1" gutterBottom>
            TaxPayer Management System
          </Typography>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 2 }}>
            <Button variant="contained" onClick={() => setOpenDialog(true)}>
              Add New TaxPayer
            </Button>
            <Box sx={{ display: 'flex', gap: 1 }}>
              <TextField
                label="Search by TID"
                variant="outlined"
                size="small"
                value={searchTid}
                onChange={(e) => setSearchTid(e.target.value)}
              />
              <Button variant="contained" onClick={handleSearch}>
                Search
              </Button>
            </Box>
          </Box>
          {loading ? (
            <CircularProgress />
          ) : (
            <DataTable
              columns={columns}
              data={taxpayers}
              pagination
              paginationPerPage={5}
              paginationRowsPerPageOptions={[5, 10, 15, 20]}
            />
          )}
        </Box>
      </Container>
      <Dialog open={openDialog} onClose={() => setOpenDialog(false)}>
        <DialogTitle>Add New TaxPayer</DialogTitle>
        <DialogContent>
          <TextField
            autoFocus
            margin="dense"
            label="TID"
            type="number"
            fullWidth
            value={newTaxpayer.tid}
            onChange={(e) => setNewTaxpayer({ ...newTaxpayer, tid: parseInt(e.target.value) })}
          />
          <TextField
            margin="dense"
            label="First Name"
            type="text"
            fullWidth
            value={newTaxpayer.firstName}
            onChange={(e) => setNewTaxpayer({ ...newTaxpayer, firstName: e.target.value })}
          />
          <TextField
            margin="dense"
            label="Last Name"
            type="text"
            fullWidth
            value={newTaxpayer.lastName}
            onChange={(e) => setNewTaxpayer({ ...newTaxpayer, lastName: e.target.value })}
          />
          <TextField
            margin="dense"
            label="Address"
            type="text"
            fullWidth
            value={newTaxpayer.address}
            onChange={(e) => setNewTaxpayer({ ...newTaxpayer, address: e.target.value })}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenDialog(false)}>Cancel</Button>
          <Button onClick={handleAddTaxpayer}>Add</Button>
        </DialogActions>
      </Dialog>
    </ThemeProvider>
  );
}

export default App;
