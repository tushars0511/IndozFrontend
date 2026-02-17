import React, { useEffect, useState } from "react";
import DashboardLayout from "examples/LayoutContainers/DashboardLayout";
import {
  Card,
  CardContent,
  Typography,
  Box,
  TextField,
  Button,
  CircularProgress,
  Alert,
  Divider,
  Stack,
} from "@mui/material";
import { styled } from "@mui/material/styles";
import LiveTvIcon from "@mui/icons-material/LiveTv";

const API_BASE = process.env.REACT_APP_API_BASE || "http://ec2-15-134-208-12.ap-southeast-2.compute.amazonaws.com:3000/api";

const CardContainer = styled(Card)(({ theme }) => ({
  maxWidth: 700,
  margin: "40px auto",
  borderRadius: 16,
  boxShadow: theme.palette.mode === "dark"
    ? "0 10px 40px rgba(0,0,0,0.4)"
    : "0 10px 40px rgba(0,0,0,0.08)",
  background: theme.palette.mode === "dark"
    ? theme.palette.background.paper
    : "#ffffff",
  border: `1px solid ${theme.palette.divider}`,
  overflow: "hidden",
  transition: "transform 0.2s ease, box-shadow 0.2s ease",
  "&:hover": {
    transform: "translateY(-4px)",
    boxShadow: theme.palette.mode === "dark"
      ? "0 15px 50px rgba(0,0,0,0.5)"
      : "0 15px 50px rgba(0,0,0,0.12)",
  },
}));

const PlayerBox = styled(Box)(({ theme }) => ({
  position: "relative",
  width: "100%",
  aspectRatio: "16/9",
  background: theme.palette.mode === "dark" 
    ? "linear-gradient(135deg, #1a1a2e 0%, #16213e 100%)" 
    : "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
  borderRadius: 12,
  overflow: "hidden",
  marginBottom: theme.spacing(3),
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  boxShadow: theme.palette.mode === "dark"
    ? "0 8px 24px rgba(0,0,0,0.4)"
    : "0 8px 24px rgba(102,126,234,0.15)",
  border: `2px solid ${theme.palette.mode === "dark" ? "rgba(255,255,255,0.1)" : "rgba(255,255,255,0.3)"}`,
  transition: "all 0.3s ease",
  "&:hover": {
    transform: "scale(1.01)",
    boxShadow: theme.palette.mode === "dark"
      ? "0 12px 32px rgba(0,0,0,0.5)"
      : "0 12px 32px rgba(102,126,234,0.25)",
  },
}));

const StyledTextField = styled(TextField)(({ theme }) => ({
  "& .MuiOutlinedInput-root": {
    borderRadius: 10,
    transition: "all 0.2s ease",
    "&:hover": {
      backgroundColor: theme.palette.mode === "dark" 
        ? "rgba(255,255,255,0.03)" 
        : "rgba(0,0,0,0.02)",
    },
    "&.Mui-focused": {
      backgroundColor: theme.palette.mode === "dark" 
        ? "rgba(255,255,255,0.05)" 
        : "rgba(102,126,234,0.05)",
    },
  },
  "& .MuiInputLabel-root": {
    fontWeight: 500,
  },
}));

const SaveButton = styled(Button)(({ theme }) => ({
  borderRadius: 10,
  minWidth: 140,
  height: 48,
  fontWeight: 700,
  fontSize: 16,
  letterSpacing: 0.5,
  color: "#fff",
  background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
  boxShadow: "0 4px 15px 0 rgba(102,126,234,0.3)",
  transition: "all 0.3s ease",
  "&:hover": {
    background: "linear-gradient(135deg, #5568d3 0%, #6a3f8c 100%)",
    boxShadow: "0 6px 20px 0 rgba(102,126,234,0.4)",
    transform: "translateY(-2px)",
  },
  "&:active": {
    transform: "translateY(0)",
  },
  "&.Mui-disabled": {
    background: theme.palette.mode === "dark" 
      ? "rgba(255,255,255,0.12)" 
      : "rgba(0,0,0,0.12)",
    color: theme.palette.mode === "dark" 
      ? "rgba(255,255,255,0.3)" 
      : "rgba(0,0,0,0.26)",
  },
}));

export default function LiveStreamAdmin() {
  const [live, setLive] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [editUrl, setEditUrl] = useState("");
  const [saving, setSaving] = useState(false);
  const [success, setSuccess] = useState("");
  const [isLocked, setIsLocked] = useState(true);

  useEffect(() => {
    fetchLive();
    // eslint-disable-next-line
  }, []);

  const fetchLive = async () => {
    setLoading(true);
    setError(null);
    setSuccess("");
    try {
      const res = await fetch(`${API_BASE}/live`);
      const data = await res.json();
      if (!data.success) throw new Error(data.message || "No live stream");
      setLive(data.live);
      setEditUrl(data.live.stream_url);
    } catch (e) {
      setError(e.message);
      setLive(null);
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async () => {
    if (!editUrl) return;
    setSaving(true);
    setError(null);
    setSuccess("");
    try {
      let res, data;
      if (live && live.id) {
        // Update existing live stream
        res = await fetch(`${API_BASE}/live/${live.id}`, {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ stream_url: editUrl, is_active: true }),
        });
      } else {
        // Create new live stream
        res = await fetch(`${API_BASE}/live`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ stream_url: editUrl, is_active: true }),
        });
      }
      data = await res.json();
      if (!data.success) throw new Error(data.message || "Save failed");
      setLive(data.live);
      setIsLocked(true);
      setSuccess("Live stream saved successfully.");
    } catch (e) {
      setError(e.message);
    } finally {
      setSaving(false);
    }
  };

  return (
    <DashboardLayout>
      <Box 
        sx={{ 
          minHeight: "100vh", 
          background: (theme) => theme.palette.mode === "dark" 
            ? "linear-gradient(135deg, #0f172a 0%, #1e293b 100%)" 
            : "linear-gradient(135deg, #f8fafc 0%, #e2e8f0 100%)", 
          p: { xs: 2, md: 4 },
          transition: "background 0.3s ease",
        }}
      >
        <CardContainer elevation={0}>
          <Box
            sx={{
              background: (theme) => theme.palette.mode === "dark"
                ? "linear-gradient(135deg, #667eea 0%, #764ba2 100%)"
                : "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
              py: 3,
              px: 3,
            }}
          >
            <Stack direction="row" spacing={2} alignItems="center">
              <LiveTvIcon sx={{ fontSize: 36, color: "#fff" }} />
              <Box>
                <Typography 
                  variant="h4" 
                  fontWeight={800} 
                  color="#fff"
                  sx={{ 
                    textShadow: "0 2px 10px rgba(0,0,0,0.2)",
                    letterSpacing: 0.5,
                  }}
                >
                  Live Stream Control
                </Typography>
                <Typography 
                  variant="body2" 
                  sx={{ 
                    color: "rgba(255,255,255,0.85)",
                    mt: 0.5,
                    fontWeight: 500,
                  }}
                >
                  Manage your live broadcast stream URL
                </Typography>
              </Box>
            </Stack>
          </Box>

          <CardContent sx={{ p: 4 }}>
            {/* Video Player Section */}
            <Box mb={4}>
              <Typography 
                variant="h6" 
                fontWeight={700} 
                mb={2}
                sx={{ 
                  color: (theme) => theme.palette.mode === "dark" ? "#fff" : "#1e293b",
                  display: "flex",
                  alignItems: "center",
                  gap: 1,
                }}
              >
                <Box
                  sx={{
                    width: 4,
                    height: 24,
                    borderRadius: 2,
                    background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
                  }}
                />
                Stream Preview
              </Typography>
              <PlayerBox>
                {loading ? (
                  <Stack alignItems="center" spacing={2}>
                    <CircularProgress size={50} sx={{ color: "#fff" }} />
                    <Typography color="#fff" fontWeight={500}>
                      Loading stream...
                    </Typography>
                  </Stack>
                ) : live && live.stream_url ? (
                  <video
                    src={live.stream_url}
                    controls
                    style={{ 
                      width: "100%", 
                      height: "100%", 
                      background: "#000",
                      objectFit: "contain",
                    }}
                    poster="/placeholder.jpg"
                  >
                    Sorry, your browser doesn't support embedded videos.
                  </video>
                ) : (
                  <Stack alignItems="center" spacing={2}>
                    <LiveTvIcon sx={{ fontSize: 60, color: "rgba(255,255,255,0.5)" }} />
                    <Typography color="rgba(255,255,255,0.7)" fontWeight={500} textAlign="center">
                      No live stream URL set
                      <br />
                      <Typography variant="caption" color="rgba(255,255,255,0.5)">
                        Enter a stream URL below to get started
                      </Typography>
                    </Typography>
                  </Stack>
                )}
              </PlayerBox>
            </Box>

            <Divider sx={{ my: 3 }} />

            {/* URL Input Section */}
            <Box mb={3}>
              <Typography 
                variant="h6" 
                fontWeight={700} 
                mb={2}
                sx={{ 
                  color: (theme) => theme.palette.mode === "dark" ? "#fff" : "#1e293b",
                  display: "flex",
                  alignItems: "center",
                  gap: 1,
                }}
              >
                <Box
                  sx={{
                    width: 4,
                    height: 24,
                    borderRadius: 2,
                    background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
                  }}
                />
                Stream Configuration
              </Typography>
              <StyledTextField
                label="Live Stream URL"
                variant="outlined"
                fullWidth
                value={editUrl}
                onChange={e => setEditUrl(e.target.value)}
                onDoubleClick={() => setIsLocked(false)}
                disabled={loading || saving || isLocked}
                placeholder="https://example.com/stream.m3u8"
                helperText="Enter a valid streaming URL (HLS, RTMP, or direct video link)"
                sx={{ mb: 2 }}
              />
            </Box>

            {/* Action Button */}
            <Stack direction="row" spacing={2} alignItems="center">
              <SaveButton
                variant="contained"
                onClick={handleSave}
                disabled={loading || saving || !editUrl}
                fullWidth
              >
                {saving ? (
                  <Stack direction="row" spacing={1} alignItems="center">
                    <CircularProgress size={20} sx={{ color: "#fff" }} />
                    <span>Saving...</span>
                  </Stack>
                ) : (
                  "Save & Activate Stream"
                )}
              </SaveButton>
            </Stack>

            {/* Feedback Messages */}
            {error && (
              <Alert 
                severity="error" 
                sx={{ 
                  mt: 3,
                  borderRadius: 2,
                  animation: "fadeIn 0.3s ease",
                  "@keyframes fadeIn": {
                    from: { opacity: 0, transform: "translateY(-10px)" },
                    to: { opacity: 1, transform: "translateY(0)" },
                  },
                }}
              >
                {error}
              </Alert>
            )}
            {success && (
              <Alert 
                severity="success" 
                sx={{ 
                  mt: 3,
                  borderRadius: 2,
                  animation: "fadeIn 0.3s ease",
                  "@keyframes fadeIn": {
                    from: { opacity: 0, transform: "translateY(-10px)" },
                    to: { opacity: 1, transform: "translateY(0)" },
                  },
                }}
              >
                {success}
              </Alert>
            )}
          </CardContent>
        </CardContainer>
      </Box>
    </DashboardLayout>
  );
}
