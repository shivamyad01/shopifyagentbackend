import { Outlet, Link, useLocation, useNavigate } from "react-router-dom";
import {
  AppBar,
  Box,
  Button,
  Container,
  Toolbar,
  Typography,
} from "@mui/material";
import { useAuth } from "../../contexts/AuthContext";

export default function AppLayout({ variant }) {
  const { logout, user } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();

  const isAdmin = variant === "admin";

  const nav = isAdmin
    ? [
        { label: "Dashboard", to: "/admin" },
        { label: "Tenants", to: "/admin/tenants" },
        { label: "Stores", to: "/admin/stores" },
      ]
    : [
        { label: "Dashboard", to: "/app" },
        { label: "Analytics", to: "/app/analytics" },
      ];

  return (
    <Box sx={{ minHeight: "100vh", bgcolor: "#f6f7fb" }}>
      <AppBar position="static">
        <Toolbar>
          <Typography sx={{ flexGrow: 1 }} variant="h6">
            {isAdmin ? "AIShopify Admin" : "AIShopify"}
          </Typography>
          {nav.map((n) => (
            <Button
              key={n.to}
              color="inherit"
              component={Link}
              to={n.to}
              sx={{ opacity: location.pathname === n.to ? 1 : 0.8 }}
            >
              {n.label}
            </Button>
          ))}
          <Typography sx={{ ml: 2, mr: 2 }} variant="body2">
            {user?.email}
          </Typography>
          <Button
            color="inherit"
            onClick={() => {
              logout();
              navigate("/login");
            }}
          >
            Logout
          </Button>
        </Toolbar>
      </AppBar>

      <Container sx={{ py: 3 }} maxWidth="lg">
        <Outlet />
      </Container>
    </Box>
  );
}
