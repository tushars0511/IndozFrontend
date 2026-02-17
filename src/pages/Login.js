import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import Cookies from "js-cookie";
import { Card, TextField, Button, Box, Typography } from "@mui/material";

function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleLogin = (e) => {
    e.preventDefault();

    // Simple authentication logic (replace with real API call)
    if (email === "admin@indoztv.com" && password === "indozadmin") {
      Cookies.set("authToken", "secureAuthToken", { expires: 1 }); // Expires in 1 day
      navigate("/live-stream");
    } else {
      setError("Invalid email or password");
    }
  };

  return (
    <Box
      display="flex"
      justifyContent="center"
      alignItems="center"
      height="100vh"
      bgcolor="background.default"
    >
      <Card sx={{ padding: 4, width: 400, textAlign: "center" }}>
        <Typography variant="h5" gutterBottom>
          Indoz TV Admin Login
        </Typography>
        <form onSubmit={handleLogin}>
          <TextField
            label="Email"
            type="email"
            fullWidth
            margin="normal"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
          <TextField
            label="Password"
            type="password"
            fullWidth
            margin="normal"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
          {error && (
            <Typography color="error" variant="body2">
              {error}
            </Typography>
          )}
          <Button
            type="submit"
            variant="contained"
            color="primary"
            fullWidth
            sx={{ marginTop: 2, color: "#FFFFFF", fontWeight: "bold" }} // Explicitly set text color and bold font
          >
            Login
          </Button>
        </form>
      </Card>
    </Box>
  );
}

export default Login;