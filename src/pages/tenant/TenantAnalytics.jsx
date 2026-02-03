import { useEffect, useState } from 'react';
import { Alert, Box, Paper, Table, TableBody, TableCell, TableHead, TableRow, Typography } from '@mui/material';
import { analyticsApi } from '../../services/api';

export default function TenantAnalytics() {
  const [orders, setOrders] = useState([]);
  const [revenue, setRevenue] = useState(null);
  const [error, setError] = useState('');

  useEffect(() => {
    let mounted = true;
    (async () => {
      try {
        const [rev, ord] = await Promise.all([analyticsApi.aiRevenue(), analyticsApi.orders()]);
        if (!mounted) return;
        setRevenue(rev);
        setOrders(ord?.orders || []);
      } catch (e) {
        if (!mounted) return;
        setError(e.message || 'Failed to load');
      }
    })();
    return () => {
      mounted = false;
    };
  }, []);

  return (
    <Box>
      <Typography variant="h4" sx={{ mb: 2 }}>
        Analytics
      </Typography>
      {error ? <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert> : null}

      <Paper sx={{ p: 2, mb: 2 }}>
        <Typography variant="body2" color="text.secondary">Total AI Revenue</Typography>
        <Typography variant="h5">{revenue?.totalRevenue ?? '—'}</Typography>
      </Paper>

      <Paper sx={{ p: 2 }}>
        <Typography variant="h6" sx={{ mb: 1 }}>Orders</Typography>
        <Table size="small">
          <TableHead>
            <TableRow>
              <TableCell>Order #</TableCell>
              <TableCell>Date</TableCell>
              <TableCell align="right">Total</TableCell>
              <TableCell>AI Agent</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {orders.length ? (
              orders.map((o) => (
                <TableRow key={o.id}>
                  <TableCell>{o.orderNumber ?? o.order_number ?? o.shopifyOrderId ?? o.id}</TableCell>
                  <TableCell>{o.processedAt ? new Date(o.processedAt).toLocaleString() : '—'}</TableCell>
                  <TableCell align="right">{o.totalPrice ?? o.total_price ?? '—'}</TableCell>
                  <TableCell>{o.aiAgentId ?? o.ai_agent_id ?? '—'}</TableCell>
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={4}>No data</TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </Paper>
    </Box>
  );
}
