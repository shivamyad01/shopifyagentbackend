import { useState } from 'react';
import { Alert, Box, Button, Paper, TextField, Typography } from '@mui/material';
import { storesApi } from '../../services/api';

export default function StoreConnectPage() {
  const [shop, setShop] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  return (
    <Box>
      <Typography variant="h4" sx={{ mb: 2 }}>
        Connect Store
      </Typography>

      <Paper sx={{ p: 2, maxWidth: 520 }}>
        {error ? <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert> : null}

        <Box
          component="form"
          onSubmit={async (e) => {
            e.preventDefault();
            setError('');
            setLoading(true);
            try {
              const data = await storesApi.connect(shop);
              if (data?.redirectUrl) {
                window.location.href = data.redirectUrl;
                return;
              }
              if (data?.url) {
                window.location.href = data.url;
                return;
              }
              throw new Error('Connect did not return redirectUrl');
            } catch (err) {
              setError(err.message || 'Failed to connect');
            } finally {
              setLoading(false);
            }
          }}
          sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}
        >
          <TextField
            label="Shop domain"
            placeholder="your-store.myshopify.com"
            value={shop}
            onChange={(e) => setShop(e.target.value)}
            required
          />
          <Button type="submit" variant="contained" disabled={loading}>
            {loading ? 'Redirecting…' : 'Connect'}
          </Button>
        </Box>
      </Paper>
    </Box>
  );
}
