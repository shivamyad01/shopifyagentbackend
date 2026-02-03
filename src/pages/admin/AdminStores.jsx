import { useEffect, useState } from 'react';
import { Alert, Box, Paper, Table, TableBody, TableCell, TableHead, TableRow, Typography } from '@mui/material';
import { adminApi } from '../../services/api';

export default function AdminStores() {
  const [stores, setStores] = useState([]);
  const [error, setError] = useState('');

  useEffect(() => {
    let mounted = true;
    (async () => {
      try {
        const data = await adminApi.stores();
        if (!mounted) return;
        setStores(Array.isArray(data) ? data : data?.data || []);
      } catch (e) {
        if (!mounted) return;
        setError(e.message || 'Failed');
      }
    })();
    return () => {
      mounted = false;
    };
  }, []);

  return (
    <Box>
      <Typography variant="h4" sx={{ mb: 2 }}>Stores</Typography>
      {error ? <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert> : null}

      <Paper sx={{ p: 2 }}>
        <Table size="small">
          <TableHead>
            <TableRow>
              <TableCell>ID</TableCell>
              <TableCell>Shop</TableCell>
              <TableCell>Status</TableCell>
              <TableCell>Tenant</TableCell>
              <TableCell>Updated</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {stores.length ? (
              stores.map((s) => (
                <TableRow key={s.id}>
                  <TableCell>{s.id}</TableCell>
                  <TableCell>{s.shopDomain || s.shop || '—'}</TableCell>
                  <TableCell>{s.status || '—'}</TableCell>
                  <TableCell>{s.tenantId || s.tenant?.id || '—'}</TableCell>
                  <TableCell>{s.updatedAt ? new Date(s.updatedAt).toLocaleString() : '—'}</TableCell>
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={5}>No data</TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </Paper>
    </Box>
  );
}
