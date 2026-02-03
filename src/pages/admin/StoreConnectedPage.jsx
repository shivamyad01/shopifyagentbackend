import { useMemo } from 'react';
import { useSearchParams } from 'react-router-dom';
import { Alert, Box, Paper, Typography } from '@mui/material';

export default function StoreConnectedPage() {
  const [params] = useSearchParams();
  const shop = params.get('shop');

  const msg = useMemo(() => {
    if (!shop) return 'Store connected successfully.';
    return `Store connected successfully: ${shop}`;
  }, [shop]);

  return (
    <Box>
      <Typography variant="h4" sx={{ mb: 2 }}>
        Store Connected
      </Typography>
      <Paper sx={{ p: 2 }}>
        <Alert severity="success" sx={{ mb: 2 }}>
          {msg}
        </Alert>
        <Typography variant="body2" color="text.secondary">
          You can now go to Admin -&gt; Stores to verify the connection.
        </Typography>
      </Paper>
    </Box>
  );
}
