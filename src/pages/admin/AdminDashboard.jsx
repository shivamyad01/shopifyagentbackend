import { useEffect, useState } from 'react';
import { Alert, Box, Grid, Paper, Typography } from '@mui/material';
import { adminApi } from '../../services/api';

function Stat({ label, value }) {
  return (
    <Paper sx={{ p: 2 }}>
      <Typography variant="body2" color="text.secondary">{label}</Typography>
      <Typography variant="h5">{value}</Typography>
    </Paper>
  );
}

export default function AdminDashboard() {
  const [stats, setStats] = useState({ tenants: 0, stores: 0 });
  const [error, setError] = useState('');

  useEffect(() => {
    let mounted = true;
    (async () => {
      try {
        const [tenants, stores] = await Promise.all([adminApi.tenants(), adminApi.stores()]);
        if (!mounted) return;
        setStats({
          tenants: Array.isArray(tenants) ? tenants.length : tenants?.data?.length || 0,
          stores: Array.isArray(stores) ? stores.length : stores?.data?.length || 0,
        });
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
      <Typography variant="h4" sx={{ mb: 2 }}>Admin Dashboard</Typography>
      {error ? <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert> : null}

      <Grid container spacing={2}>
        <Grid item xs={12} md={6}>
          <Stat label="Tenants" value={stats.tenants} />
        </Grid>
        <Grid item xs={12} md={6}>
          <Stat label="Stores" value={stats.stores} />
        </Grid>
      </Grid>
    </Box>
  );
}
