import { useEffect, useMemo, useState } from "react";
import {
  Alert,
  Box,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  MenuItem,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  TextField,
  Typography,
} from "@mui/material";
import { adminApi } from "../../services/api";

export default function AdminStores() {
  const [stores, setStores] = useState([]);
  const [tenants, setTenants] = useState([]);
  const [error, setError] = useState("");
  const [open, setOpen] = useState(false);
  const [tenantId, setTenantId] = useState("");
  const [shop, setShop] = useState("");
  const [connecting, setConnecting] = useState(false);

  const tenantOptions = useMemo(() => {
    return tenants.map((t) => ({ id: t.id, name: t.name }));
  }, [tenants]);

  async function loadStoresAndTenants() {
    const [storesRes, tenantsRes] = await Promise.all([
      adminApi.stores(),
      adminApi.tenants(),
    ]);
    setStores(Array.isArray(storesRes) ? storesRes : storesRes?.stores || []);
    setTenants(
      Array.isArray(tenantsRes) ? tenantsRes : tenantsRes?.tenants || [],
    );
  }

  useEffect(() => {
    let mounted = true;
    (async () => {
      try {
        if (!mounted) return;
        await loadStoresAndTenants();
      } catch (e) {
        if (!mounted) return;
        setError(e.message || "Failed");
      }
    })();
    return () => {
      mounted = false;
    };
  }, []);

  return (
    <Box>
      <Box
        sx={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          mb: 2,
        }}
      >
        <Typography variant="h4">Stores</Typography>
        <Button variant="contained" onClick={() => setOpen(true)}>
          Connect Store (Super Admin)
        </Button>
      </Box>
      {error ? (
        <Alert severity="error" sx={{ mb: 2 }}>
          {error}
        </Alert>
      ) : null}

      <Paper sx={{ p: 2 }}>
        <Table size="small">
          <TableHead>
            <TableRow>
              <TableCell>ID</TableCell>
              <TableCell>Shop</TableCell>
              <TableCell>Status</TableCell>
              <TableCell>Tenant</TableCell>
              <TableCell>Installed</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {stores.length ? (
              stores.map((s) => (
                <TableRow key={s.id}>
                  <TableCell>{s.id}</TableCell>
                  <TableCell>{s.shop || "—"}</TableCell>
                  <TableCell>{s.status || "—"}</TableCell>
                  <TableCell>
                    {s.tenant?.name
                      ? `${s.tenant.name} (#${s.tenant.id})`
                      : s.tenant_id || "—"}
                  </TableCell>
                  <TableCell>
                    {s.installed_at
                      ? new Date(s.installed_at).toLocaleString()
                      : "—"}
                  </TableCell>
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

      <Dialog
        open={open}
        onClose={() => setOpen(false)}
        maxWidth="sm"
        fullWidth
      >
        <DialogTitle>Connect Store to Tenant</DialogTitle>
        <DialogContent
          sx={{ display: "flex", flexDirection: "column", gap: 2, pt: 2 }}
        >
          <TextField
            select
            label="Tenant"
            value={tenantId}
            onChange={(e) => setTenantId(e.target.value)}
            helperText="1 tenant = 1 store"
          >
            {tenantOptions.map((t) => (
              <MenuItem key={t.id} value={t.id}>
                {t.name} (#{t.id})
              </MenuItem>
            ))}
          </TextField>

          <TextField
            label="Shop domain"
            placeholder="your-store.myshopify.com"
            value={shop}
            onChange={(e) => setShop(e.target.value)}
          />

          <Alert severity="info">
            After clicking connect, you will be redirected to Shopify to install
            the app.
          </Alert>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpen(false)} disabled={connecting}>
            Cancel
          </Button>
          <Button
            variant="contained"
            disabled={connecting || !tenantId || !shop}
            onClick={async () => {
              setError("");
              setConnecting(true);
              try {
                const res = await adminApi.connectStore({ tenantId, shop });
                const url = res?.authUrl;
                if (!url) throw new Error("Missing authUrl from server");
                window.location.href = url;
              } catch (e) {
                setError(e.message || "Failed to connect store");
                setConnecting(false);
              }
            }}
          >
            {connecting ? "Redirecting…" : "Connect"}
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
}
