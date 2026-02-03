import { useEffect, useState } from "react";
import {
  Alert,
  Box,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
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

export default function AdminTenants() {
  const [tenants, setTenants] = useState([]);
  const [error, setError] = useState("");
  const [open, setOpen] = useState(false);
  const [creating, setCreating] = useState(false);
  const [tenantName, setTenantName] = useState("");
  const [ownerEmail, setOwnerEmail] = useState("");
  const [ownerPassword, setOwnerPassword] = useState("");

  async function loadTenants() {
    const data = await adminApi.tenants();
    setTenants(Array.isArray(data) ? data : data?.tenants || []);
  }

  useEffect(() => {
    let mounted = true;
    (async () => {
      try {
        if (!mounted) return;
        await loadTenants();
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
        <Typography variant="h4">Tenants</Typography>
        <Button variant="contained" onClick={() => setOpen(true)}>
          Create Tenant
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
              <TableCell>Name</TableCell>
              <TableCell>Status</TableCell>
              <TableCell>Created</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {tenants.length ? (
              tenants.map((t) => (
                <TableRow key={t.id}>
                  <TableCell>{t.id}</TableCell>
                  <TableCell>{t.name}</TableCell>
                  <TableCell>{t.status || "—"}</TableCell>
                  <TableCell>
                    {t.created_at
                      ? new Date(t.created_at).toLocaleString()
                      : "—"}
                  </TableCell>
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

      <Dialog
        open={open}
        onClose={() => setOpen(false)}
        maxWidth="sm"
        fullWidth
      >
        <DialogTitle>Create Tenant</DialogTitle>
        <DialogContent
          sx={{ display: "flex", flexDirection: "column", gap: 2, pt: 2 }}
        >
          <TextField
            label="Tenant Name"
            value={tenantName}
            onChange={(e) => setTenantName(e.target.value)}
            required
          />
          <TextField
            label="Owner Email"
            value={ownerEmail}
            onChange={(e) => setOwnerEmail(e.target.value)}
            required
          />
          <TextField
            label="Owner Password"
            type="password"
            value={ownerPassword}
            onChange={(e) => setOwnerPassword(e.target.value)}
            required
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpen(false)} disabled={creating}>
            Cancel
          </Button>
          <Button
            variant="contained"
            disabled={creating}
            onClick={async () => {
              setError("");
              setCreating(true);
              try {
                await adminApi.createTenant({
                  tenantName,
                  ownerEmail,
                  ownerPassword,
                });
                await loadTenants();
                setOpen(false);
                setTenantName("");
                setOwnerEmail("");
                setOwnerPassword("");
              } catch (e) {
                setError(e.message || "Failed to create tenant");
              } finally {
                setCreating(false);
              }
            }}
          >
            {creating ? "Creating…" : "Create"}
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
}
