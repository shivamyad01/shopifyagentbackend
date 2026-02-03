import { useEffect, useState } from "react";
import { Alert, Box, Grid, Paper, Typography } from "@mui/material";
import { analyticsApi, storesApi } from "../../services/api";

function Stat({ label, value }) {
  return (
    <Paper sx={{ p: 2 }}>
      <Typography variant="body2" color="text.secondary">
        {label}
      </Typography>
      <Typography variant="h5">{value}</Typography>
    </Paper>
  );
}

export default function TenantDashboard() {
  const [data, setData] = useState({ revenue: null, orders: null });
  const [storeStatus, setStoreStatus] = useState(null);
  const [error, setError] = useState("");

  useEffect(() => {
    let mounted = true;
    (async () => {
      try {
        const [status, rev, ord] = await Promise.all([
          storesApi.status(),
          analyticsApi.aiRevenue(),
          analyticsApi.orders(),
        ]);
        if (!mounted) return;
        setStoreStatus(status);
        setData({ revenue: rev, orders: ord });
      } catch (e) {
        if (!mounted) return;
        setError(e.message || "Failed to load");
      }
    })();
    return () => {
      mounted = false;
    };
  }, []);

  return (
    <Box>
      <Typography variant="h4" sx={{ mb: 2 }}>
        Dashboard
      </Typography>
      {error ? (
        <Alert severity="error" sx={{ mb: 2 }}>
          {error}
        </Alert>
      ) : null}

      {storeStatus ? (
        <Alert
          severity={storeStatus.connected ? "success" : "warning"}
          sx={{ mb: 2 }}
        >
          {storeStatus.connected
            ? `Store connected: ${storeStatus.store?.shop}`
            : "Store not connected. Contact super admin to connect your Shopify store."}
        </Alert>
      ) : null}

      <Grid container spacing={2}>
        <Grid item xs={12} md={4}>
          <Stat label="AI Revenue" value={data.revenue?.totalRevenue ?? "—"} />
        </Grid>
        <Grid item xs={12} md={4}>
          <Stat
            label="Orders (AI attributed)"
            value={data.orders?.total ?? "—"}
          />
        </Grid>
        <Grid item xs={12} md={4}>
          <Stat label="Currency" value={data.revenue?.currency ?? "—"} />
        </Grid>
      </Grid>
    </Box>
  );
}
