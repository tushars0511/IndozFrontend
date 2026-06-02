import React, { useEffect, useState } from "react";
import DashboardLayout from "examples/LayoutContainers/DashboardLayout";
import {
  Card,
  CardContent,
  Grid,
  Button,
  IconButton,
  Dialog,
  DialogContent,
  TextField,
  Typography,
  Box,
  CircularProgress,
  InputAdornment,
  Chip,
  Fade,
  Skeleton,
  Pagination,
  Stack,
} from "@mui/material";
import AddIcon from "@mui/icons-material/Add";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import SearchIcon from "@mui/icons-material/Search";
import ArticleOutlinedIcon from "@mui/icons-material/ArticleOutlined";
import TrendingUpIcon from "@mui/icons-material/TrendingUp";
import ImageIcon from "@mui/icons-material/Image";
import LinkIcon from "@mui/icons-material/Link";
import CloseIcon from "@mui/icons-material/Close";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import { styled, alpha } from "@mui/material/styles";

const API_BASE = "http://ec2-13-238-255-87.ap-southeast-2.compute.amazonaws.com:3000/api/articles";

async function fetchArticles() {
  const res = await fetch(API_BASE);
  if (!res.ok) throw new Error("Failed to fetch articles");
  return await res.json();
}

async function createArticle(data, file) {
  const formData = new FormData();
  Object.entries(data).forEach(([key, value]) => {
    if (key !== "thumbnail") formData.append(key, value);
  });
  if (file) formData.append("thumbnail", file);
  console.log('Creating article:', data);
  if (file) console.log('Uploading file:', file.name, file.type, file.size);
  try {
    const res = await fetch(API_BASE, {
      method: "POST",
      body: formData,
    });
    const result = await res.json();
    console.log('Backend response:', result);
    if (!res.ok || !result.success) throw new Error(result.message || "Failed to create article");
    return result.article;
  } catch (err) {
    console.error('Create article error:', err);
    throw err;
  }
}

async function updateArticle(id, data, file) {
  const formData = new FormData();
  Object.entries(data).forEach(([key, value]) => {
    formData.append(key, value);
  });
  if (file) formData.append("thumbnail", file); // Attach the file if provided

  try {
    const res = await fetch(`${API_BASE}/${id}`, {
      method: "PUT",
      body: formData,
    });
    const result = await res.json();
    if (!res.ok || !result.success) throw new Error(result.message || "Failed to update article");
    return result.article;
  } catch (err) {
    console.error("Update article error:", err);
    throw err;
  }
}

async function deleteArticle(id) {
  const res = await fetch(`${API_BASE}/${id}`, { method: "DELETE" });
  const result = await res.json();
  if (!res.ok || !result.success) throw new Error(result.message || "Failed to delete article");
  return true;
}

// Modern Styled Components with 2026 design trends
const PageContainer = styled(Box)(({ theme }) => ({
  minHeight: "100vh",
  background: theme.palette.mode === "dark" 
    ? "linear-gradient(135deg, #0a0e27 0%, #1a1f3a 100%)"
    : "linear-gradient(135deg, #f8fafc 0%, #e9ecf1 100%)",
  padding: theme.spacing(4),
  [theme.breakpoints.down("md")]: {
    padding: theme.spacing(2),
  },
}));

const HeaderSection = styled(Box)(({ theme }) => ({
  marginBottom: theme.spacing(4),
}));

const StatsCard = styled(Box)(({ theme }) => ({
  background: theme.palette.mode === "dark"
    ? alpha(theme.palette.background.paper, 0.4)
    : "#ffffff",
  backdropFilter: "blur(20px)",
  border: `1px solid ${alpha(theme.palette.divider, 0.1)}`,
  borderRadius: 20,
  padding: theme.spacing(2.5),
  display: "flex",
  alignItems: "center",
  gap: theme.spacing(2),
  transition: "all 0.3s cubic-bezier(0.4, 0, 0.2, 1)",
  "&:hover": {
    transform: "translateY(-4px)",
    boxShadow: theme.palette.mode === "dark"
      ? "0 20px 40px rgba(0, 0, 0, 0.4)"
      : "0 20px 40px rgba(0, 0, 0, 0.08)",
    borderColor: theme.palette.primary.main,
  },
}));

const IconWrapper = styled(Box)(({ theme, gradient }) => ({
  width: 56,
  height: 56,
  borderRadius: 16,
  background: gradient || "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  boxShadow: "0 8px 24px rgba(102, 126, 234, 0.3)",
}));

const SearchContainer = styled(Box)(({ theme }) => ({
  background: theme.palette.mode === "dark"
    ? alpha(theme.palette.background.paper, 0.4)
    : "#ffffff",
  backdropFilter: "blur(20px)",
  border: `1px solid ${alpha(theme.palette.divider, 0.1)}`,
  borderRadius: 20,
  padding: theme.spacing(3),
  marginBottom: theme.spacing(3),
  display: "flex",
  gap: theme.spacing(2),
  alignItems: "center",
  flexWrap: "wrap",
  [theme.breakpoints.down("sm")]: {
    flexDirection: "column",
    alignItems: "stretch",
  },
}));

const ModernSearchField = styled(TextField)(({ theme }) => ({
  flex: 1,
  minWidth: 300,
  "& .MuiOutlinedInput-root": {
    borderRadius: 14,
    background: theme.palette.mode === "dark" 
      ? alpha(theme.palette.background.paper, 0.6)
      : alpha(theme.palette.grey[100], 0.8),
    border: "none",
    transition: "all 0.3s ease",
    "&:hover": {
      background: theme.palette.mode === "dark"
        ? alpha(theme.palette.background.paper, 0.8)
        : alpha(theme.palette.grey[200], 0.8),
    },
    "&.Mui-focused": {
      background: theme.palette.background.paper,
      boxShadow: `0 0 0 3px ${alpha(theme.palette.primary.main, 0.1)}`,
    },
    "& fieldset": {
      border: "none",
    },
  },
  [theme.breakpoints.down("sm")]: {
    minWidth: "100%",
  },
}));

const PrimaryButton = styled(Button)(({ theme }) => ({
  borderRadius: 14,
  padding: theme.spacing(1.5, 3),
  textTransform: "none",
  fontWeight: 600,
  fontSize: 15,
  color: "#ffffff",
  background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
  boxShadow: "0 8px 24px rgba(102, 126, 234, 0.3)",
  transition: "all 0.3s cubic-bezier(0.4, 0, 0.2, 1)",
  "&:hover": {
    transform: "translateY(-2px)",
    boxShadow: "0 12px 32px rgba(102, 126, 234, 0.4)",
    background: "linear-gradient(135deg, #7c8ef5 0%, #8b5ab8 100%)",
  },
  "&:active": {
    transform: "translateY(0)",
  },
  "&.Mui-disabled": {
    background: theme.palette.action.disabledBackground,
    color: theme.palette.action.disabled,
  },
}));

const ArticleGrid = styled(Grid)(({ theme }) => ({
  marginTop: theme.spacing(3),
}));

const ArticleCard = styled(Card)(({ theme }) => ({
  height: "100%",
  borderRadius: 24,
  background: theme.palette.mode === "dark"
    ? alpha(theme.palette.background.paper, 0.4)
    : "#ffffff",
  backdropFilter: "blur(20px)",
  border: `1px solid ${alpha(theme.palette.divider, 0.1)}`,
  boxShadow: "none",
  transition: "all 0.4s cubic-bezier(0.4, 0, 0.2, 1)",
  overflow: "hidden",
  position: "relative",
  "&:hover": {
    transform: "translateY(-8px)",
    boxShadow: theme.palette.mode === "dark"
      ? "0 24px 48px rgba(0, 0, 0, 0.5)"
      : "0 24px 48px rgba(0, 0, 0, 0.12)",
    borderColor: theme.palette.primary.main,
    "& .article-thumbnail": {
      transform: "scale(1.05)",
    },
    "& .article-actions": {
      opacity: 1,
      transform: "translateY(0)",
    },
  },
}));

const ThumbnailContainer = styled(Box)(({ theme }) => ({
  position: "relative",
  width: "100%",
  paddingTop: "56.25%", // 16:9 aspect ratio
  overflow: "hidden",
  background: theme.palette.mode === "dark"
    ? "linear-gradient(135deg, #1a1f3a 0%, #2d3561 100%)"
    : "linear-gradient(135deg, #e9ecf1 0%, #cbd5e1 100%)",
  "& img": {
    position: "absolute",
    top: 0,
    left: 0,
    width: "100%",
    height: "100%",
    objectFit: "cover",
    transition: "transform 0.4s cubic-bezier(0.4, 0, 0.2, 1)",
  },
}));

const TrendingBadge = styled(Box)(({ theme }) => ({
  position: "absolute",
  top: 16,
  right: 16,
  background: "linear-gradient(135deg, #10b981 0%, #059669 100%)",
  color: "#ffffff",
  padding: theme.spacing(0.75, 1.5),
  borderRadius: 12,
  display: "flex",
  alignItems: "center",
  gap: theme.spacing(0.5),
  fontSize: 12,
  fontWeight: 700,
  boxShadow: "0 4px 12px rgba(16, 185, 129, 0.4)",
  zIndex: 1,
}));

const ArticleContent = styled(CardContent)(({ theme }) => ({
  padding: theme.spacing(3),
}));

const ArticleActions = styled(Box)(({ theme }) => ({
  display: "flex",
  gap: theme.spacing(1),
  marginTop: theme.spacing(2),
  paddingTop: theme.spacing(2),
  borderTop: `1px solid ${alpha(theme.palette.divider, 0.1)}`,
  opacity: 0.7,
  transform: "translateY(4px)",
  transition: "all 0.3s ease",
}));

const ActionIconButton = styled(IconButton)(({ theme }) => ({
  width: 40,
  height: 40,
  borderRadius: 12,
  background: theme.palette.mode === "dark"
    ? alpha(theme.palette.background.paper, 0.6)
    : alpha(theme.palette.grey[100], 0.8),
  transition: "all 0.3s ease",
  "&:hover": {
    transform: "scale(1.1)",
  },
  "&.edit-btn:hover": {
    background: alpha(theme.palette.primary.main, 0.2),
    color: theme.palette.primary.main,
  },
  "&.delete-btn:hover": {
    background: alpha(theme.palette.error.main, 0.2),
    color: theme.palette.error.main,
  },
}));

const ModernDialog = styled(Dialog)(({ theme }) => ({
  "& .MuiBackdrop-root": {
    backgroundColor: alpha(theme.palette.common.black, 0.7),
    backdropFilter: "blur(8px)",
  },
  "& .MuiDialog-paper": {
    borderRadius: 28,
    background: theme.palette.mode === "dark"
      ? alpha(theme.palette.background.paper, 0.95)
      : "#ffffff",
    backdropFilter: "blur(20px)",
    border: `1px solid ${alpha(theme.palette.divider, 0.1)}`,
    boxShadow: "0 32px 64px rgba(0, 0, 0, 0.24)",
    maxWidth: 600,
    width: "100%",
  },
}));

const DialogHeader = styled(Box)(({ theme }) => ({
  padding: theme.spacing(4, 4, 2, 4),
  display: "flex",
  justifyContent: "space-between",
  alignItems: "flex-start",
}));

const FormSection = styled(Box)(({ theme }) => ({
  padding: theme.spacing(2, 4, 4, 4),
  display: "flex",
  flexDirection: "column",
  gap: theme.spacing(2.5),
}));

const ModernTextField = styled(TextField)(({ theme }) => ({
  "& .MuiOutlinedInput-root": {
    borderRadius: 14,
    background: theme.palette.mode === "dark"
      ? alpha(theme.palette.background.paper, 0.6)
      : alpha(theme.palette.grey[50], 0.8),
    transition: "all 0.3s ease",
    "&:hover": {
      background: theme.palette.mode === "dark"
        ? alpha(theme.palette.background.paper, 0.8)
        : alpha(theme.palette.grey[100], 0.8),
    },
    "&.Mui-focused": {
      background: theme.palette.background.paper,
      boxShadow: `0 0 0 3px ${alpha(theme.palette.primary.main, 0.1)}`,
      "& fieldset": {
        borderColor: theme.palette.primary.main,
        borderWidth: 2,
      },
    },
  },
}));

const TrendingToggle = styled(Box)(({ theme }) => ({
  background: theme.palette.mode === "dark"
    ? alpha(theme.palette.background.paper, 0.6)
    : alpha(theme.palette.grey[50], 0.8),
  borderRadius: 16,
  padding: theme.spacing(2.5),
  display: "flex",
  alignItems: "center",
  justifyContent: "space-between",
  border: `1px solid ${alpha(theme.palette.divider, 0.1)}`,
  transition: "all 0.3s ease",
  cursor: "pointer",
  "&:hover": {
    background: theme.palette.mode === "dark"
      ? alpha(theme.palette.background.paper, 0.8)
      : alpha(theme.palette.grey[100], 0.8),
  },
}));

const ToggleSwitch = styled(Box)(({ theme, active }) => ({
  width: 56,
  height: 32,
  borderRadius: 16,
  background: active
    ? "linear-gradient(135deg, #10b981 0%, #059669 100%)"
    : alpha(theme.palette.grey[400], 0.3),
  position: "relative",
  transition: "all 0.3s ease",
  cursor: "pointer",
  boxShadow: active ? "0 4px 12px rgba(16, 185, 129, 0.3)" : "none",
  "&::after": {
    content: '""',
    position: "absolute",
    top: 4,
    left: active ? 28 : 4,
    width: 24,
    height: 24,
    borderRadius: "50%",
    background: "#ffffff",
    boxShadow: "0 2px 8px rgba(0, 0, 0, 0.2)",
    transition: "all 0.3s cubic-bezier(0.4, 0, 0.2, 1)",
  },
}));

const EmptyState = styled(Box)(({ theme }) => ({
  textAlign: "center",
  padding: theme.spacing(8, 3),
  "& .empty-icon": {
    width: 120,
    height: 120,
    margin: "0 auto",
    borderRadius: "50%",
    background: theme.palette.mode === "dark"
      ? alpha(theme.palette.background.paper, 0.6)
      : alpha(theme.palette.grey[100], 0.8),
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    marginBottom: theme.spacing(3),
  },
}));

export default function ArticleManagement() {
  const [articles, setArticles] = useState([]);
  const [filteredArticles, setFilteredArticles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [open, setOpen] = useState(false);
  const [editData, setEditData] = useState(null);
  const [form, setForm] = useState({ title: "", desc: "", url: "", is_trending: false });
  const [thumbnailFile, setThumbnailFile] = useState(null);
  const [thumbnailPreview, setThumbnailPreview] = useState(null);
  const [saving, setSaving] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [page, setPage] = useState(0);
  const rowsPerPage = 50;

  const loadArticles = async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await fetchArticles();
      setArticles(data);
      setFilteredArticles(data);
    } catch (e) {
      setError(e.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadArticles();
  }, []);

  useEffect(() => {
    console.log("Articles loaded:", articles.length);
    console.log("Filtered articles:", filteredArticles.length);
  }, [articles, filteredArticles]);

  useEffect(() => {
    console.log("Pagination count:", Math.ceil(filteredArticles.length / rowsPerPage));
    console.log("Pagination current page:", page + 1);
  }, [filteredArticles, page, rowsPerPage]);

  const handleOpen = (article = null) => {
    setEditData(article);
    setForm(
      article
        ? { ...article }
        : { title: "", desc: "", url: "", thumbnail: "", is_trending: false }
    );
    setOpen(true);
  };

  const handleClose = () => {
    setEditData(null);
    setForm({ title: "", desc: "", url: "", thumbnail: "", is_trending: false });
    setOpen(false);
  };

  const handleFormChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleThumbnailChange = (e) => {
    const file = e.target.files[0];
    setThumbnailFile(file);
    setThumbnailPreview(file ? URL.createObjectURL(file) : null);
  };

  const toggleTrending = () => {
    setForm((prev) => ({
      ...prev,
      is_trending: !prev.is_trending,
    }));
  };

  const handleSave = async () => {
    setSaving(true);
    setError(null);
    try {
      if (editData) {
        await updateArticle(editData.id, form, thumbnailFile);
      } else {
        await createArticle(form, thumbnailFile);
      }
      handleClose();
      setThumbnailFile(null);
      setThumbnailPreview(null);
      await loadArticles();
    } catch (e) {
      setError(e.message);
      console.error('Save article error:', e);
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Delete this article? This action cannot be undone.")) return;
    setSaving(true);
    setError(null);
    try {
      await deleteArticle(id);
      await loadArticles();
    } catch (e) {
      setError(e.message);
    } finally {
      setSaving(false);
    }
  };

  const trendingCount = articles.filter((a) => a.is_trending).length;

  return (
    <DashboardLayout>
      <PageContainer>
        {/* Header */}
        <HeaderSection>
          <Box display="flex" alignItems="center" gap={2} mb={3}>
            <IconWrapper>
              <ArticleOutlinedIcon sx={{ color: "#fff", fontSize: 28 }} />
            </IconWrapper>
            <Box flex={1}>
              <Typography variant="h3" fontWeight={800} sx={{ mb: 0.5, letterSpacing: "-0.02em" }}>
                Articles
              </Typography>
              <Typography variant="body1" color="text.secondary" fontWeight={500}>
                Manage your content library
              </Typography>
            </Box>
          </Box>

          {/* Stats Cards */}
          {!loading && articles.length > 0 && (
            <Grid container spacing={2}>
              <Grid item xs={12} sm={6} md={3}>
                <StatsCard>
                  <IconWrapper gradient="linear-gradient(135deg, #667eea 0%, #764ba2 100%)">
                    <ArticleOutlinedIcon sx={{ color: "#fff", fontSize: 24 }} />
                  </IconWrapper>
                  <Box>
                    <Typography variant="h4" fontWeight={700}>
                      {articles.length}
                    </Typography>
                    <Typography variant="body2" color="text.secondary" fontWeight={500}>
                      Total Articles
                    </Typography>
                  </Box>
                </StatsCard>
              </Grid>
              <Grid item xs={12} sm={6} md={3}>
                <StatsCard>
                  <IconWrapper gradient="linear-gradient(135deg, #10b981 0%, #059669 100%)">
                    <TrendingUpIcon sx={{ color: "#fff", fontSize: 24 }} />
                  </IconWrapper>
                  <Box>
                    <Typography variant="h4" fontWeight={700}>
                      {trendingCount}
                    </Typography>
                    <Typography variant="body2" color="text.secondary" fontWeight={500}>
                      Trending Now
                    </Typography>
                  </Box>
                </StatsCard>
              </Grid>
            </Grid>
          )}
        </HeaderSection>

        {/* Search & Actions */}
        <SearchContainer>
          <ModernSearchField
            placeholder="Search articles..."
            variant="outlined"
            size="medium"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <SearchIcon sx={{ color: "text.secondary" }} />
                </InputAdornment>
              ),
            }}
          />
          <PrimaryButton
            variant="contained"
            startIcon={<AddIcon />}
            onClick={() => handleOpen()}
            disableElevation
          >
            New Article
          </PrimaryButton>
        </SearchContainer>

        {/* Error Display */}
        {error && (
          <Fade in={!!error}>
            <Box
              sx={{
                p: 2,
                mb: 3,
                borderRadius: 3,
                background: (theme) =>
                  alpha(theme.palette.error.main, 0.1),
                border: (theme) => `1px solid ${alpha(theme.palette.error.main, 0.3)}`,
              }}
            >
              <Typography color="error" fontWeight={600}>
                {error}
              </Typography>
            </Box>
          </Fade>
        )}

        {/* Content Grid */}
        {loading ? (
          <ArticleGrid container spacing={3}>
            {[1, 2, 3, 4, 5, 6].map((i) => (
              <Grid item xs={12} sm={6} md={4} key={i}>
                <Skeleton
                  variant="rectangular"
                  height={320}
                  sx={{ borderRadius: 6 }}
                />
              </Grid>
            ))}
          </ArticleGrid>
        ) : filteredArticles.length === 0 ? (
          <EmptyState>
            <Box className="empty-icon">
              <ArticleOutlinedIcon sx={{ fontSize: 56, color: "text.secondary", opacity: 0.5 }} />
            </Box>
            <Typography variant="h5" fontWeight={700} gutterBottom>
              {searchQuery ? "No matches found" : "No articles yet"}
            </Typography>
            <Typography variant="body1" color="text.secondary" sx={{ mb: 3, maxWidth: 400, mx: "auto" }}>
              {searchQuery
                ? "Try a different search term"
                : "Create your first article to get started"}
            </Typography>
            {!searchQuery && (
              <PrimaryButton
                variant="contained"
                startIcon={<AddIcon />}
                onClick={() => handleOpen()}
                disableElevation
              >
                Create Article
              </PrimaryButton>
            )}
          </EmptyState>
        ) : (
          <>
          <ArticleGrid container spacing={3}>
            {filteredArticles.slice(page * rowsPerPage, (page + 1) * rowsPerPage).map((article) => (
              <Grid item xs={12} sm={6} md={4} key={article.id}>
                <Fade in timeout={400}>
                  <ArticleCard>
                    <ThumbnailContainer>
                      {article.is_trending && (
                        <TrendingBadge>
                          <TrendingUpIcon sx={{ fontSize: 14 }} />
                          Trending
                        </TrendingBadge>
                      )}
                      <img
                        className="article-thumbnail"
                        src={article.thumbnail || "/placeholder.jpg"}
                        alt={article.title}
                        onError={(e) => {
                          e.target.src = "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='400' height='300'%3E%3Crect fill='%23e9ecf1' width='400' height='300'/%3E%3Ctext fill='%2394a3b8' font-family='Arial' font-size='24' x='50%25' y='50%25' text-anchor='middle' dominant-baseline='middle'%3ENo Image%3C/text%3E%3C/svg%3E";
                        }}
                      />
                    </ThumbnailContainer>
                    <ArticleContent>
                      <Typography
                        variant="h6"
                        fontWeight={700}
                        sx={{
                          mb: 1,
                          overflow: "hidden",
                          textOverflow: "ellipsis",
                          display: "-webkit-box",
                          WebkitLineClamp: 2,
                          WebkitBoxOrient: "vertical",
                          minHeight: 56,
                          lineHeight: 1.4,
                        }}
                      >
                        {article.title}
                      </Typography>
                      <Typography
                        variant="body2"
                        color="text.secondary"
                        sx={{
                          overflow: "hidden",
                          textOverflow: "ellipsis",
                          display: "-webkit-box",
                          WebkitLineClamp: 3,
                          WebkitBoxOrient: "vertical",
                          minHeight: 63,
                          lineHeight: 1.5,
                        }}
                      >
                        {article.desc}
                      </Typography>

                      <ArticleActions className="article-actions">
                        <ActionIconButton
                          className="edit-btn"
                          size="small"
                          onClick={() => handleOpen(article)}
                          title="Edit"
                        >
                          <EditIcon fontSize="small" />
                        </ActionIconButton>
                        <ActionIconButton
                          className="delete-btn"
                          size="small"
                          onClick={() => handleDelete(article.id)}
                          disabled={saving}
                          title="Delete"
                        >
                          <DeleteIcon fontSize="small" />
                        </ActionIconButton>
                        <Box flex={1} />
                        <IconButton
                          size="small"
                          component="a"
                          href={article.url}
                          target="_blank"
                          rel="noopener noreferrer"
                          sx={{
                            width: 40,
                            height: 40,
                            borderRadius: 3,
                            background: (theme) =>
                              alpha(theme.palette.primary.main, 0.1),
                            color: "primary.main",
                            "&:hover": {
                              background: (theme) =>
                                alpha(theme.palette.primary.main, 0.2),
                            },
                          }}
                        >
                          <LinkIcon fontSize="small" />
                        </IconButton>
                      </ArticleActions>
                    </ArticleContent>
                  </ArticleCard>
                </Fade>
              </Grid>
            ))}
          </ArticleGrid>
          {filteredArticles.length > 0 && (
            <Box sx={{ 
              display: 'flex', 
              justifyContent: 'center', 
              alignItems: 'center',
              mt: 4,
              gap: 2,
              flexWrap: 'wrap'
            }}>
              <Typography variant="body2" color="text.secondary">
                {page * rowsPerPage + 1}-{Math.min((page + 1) * rowsPerPage, filteredArticles.length)} of {filteredArticles.length}
              </Typography>
              <Stack spacing={2} direction="row">
                <Pagination
                  count={Math.ceil(filteredArticles.length / rowsPerPage)}
                  page={page + 1}
                  onChange={(event, value) => setPage(value - 1)}
                  color="primary"
                  showFirstButton
                  showLastButton
                  siblingCount={1}
                  boundaryCount={1}
                  size="medium"
                />
              </Stack>
            </Box>
          )}
          </>
        )}

        {/* Create/Edit Dialog */}
        <ModernDialog open={open} onClose={handleClose} maxWidth="sm" fullWidth>
          <DialogHeader>
            <Box>
              <Typography variant="h5" fontWeight={800} sx={{ mb: 0.5 }}>
                {editData ? "Edit Article" : "New Article"}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                {editData ? "Update article details" : "Fill in the details below"}
              </Typography>
            </Box>
            <IconButton
              onClick={handleClose}
              sx={{
                width: 40,
                height: 40,
                borderRadius: 2,
                "&:hover": { background: (theme) => alpha(theme.palette.error.main, 0.1) },
              }}
            >
              <CloseIcon />
            </IconButton>
          </DialogHeader>

          <FormSection>
            <ModernTextField
              label="Article Title"
              name="title"
              value={form.title}
              onChange={handleFormChange}
              fullWidth
              required
              disabled={saving}
              placeholder="Enter a compelling title"
            />
            <ModernTextField
              label="Description"
              name="desc"
              value={form.desc}
              onChange={handleFormChange}
              fullWidth
              required
              multiline
              rows={3}
              disabled={saving}
              placeholder="Brief summary of the article"
            />
            <ModernTextField
              label="Article URL"
              name="url"
              value={form.url}
              onChange={handleFormChange}
              fullWidth
              required
              disabled={saving}
              placeholder="https://example.com/article"
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <LinkIcon fontSize="small" color="action" />
                  </InputAdornment>
                ),
              }}
            />
            <Box>
              <Typography variant="subtitle1" fontWeight={600} sx={{ mb: 1 }}>
                Thumbnail Image
              </Typography>
              <input
                type="file"
                accept="image/*"
                onChange={handleThumbnailChange}
                disabled={saving}
                style={{ display: "block", marginBottom: 8 }}
              />
              {thumbnailPreview && (
                <Box sx={{ mb: 2 }}>
                  <img
                    src={thumbnailPreview}
                    alt="Thumbnail Preview"
                    style={{ width: 120, height: 80, objectFit: "cover", borderRadius: 8, border: "1px solid #eee" }}
                  />
                </Box>
              )}
            </Box>

            <TrendingToggle onClick={toggleTrending}>
              <Box>
                <Typography variant="body1" fontWeight={600} sx={{ mb: 0.5 }}>
                  Mark as Trending
                </Typography>
                <Typography variant="caption" color="text.secondary">
                  Highlight this article with a trending badge
                </Typography>
              </Box>
              <ToggleSwitch active={form.is_trending} />
            </TrendingToggle>

            <Box display="flex" gap={2} mt={2}>
              <Button
                fullWidth
                variant="outlined"
                onClick={handleClose}
                disabled={saving}
                sx={{
                  borderRadius: 3,
                  py: 1.5,
                  textTransform: "none",
                  fontWeight: 600,
                  fontSize: 15,
                  color: "text.primary",
                  borderColor: "divider",
                  borderWidth: 2,
                  "&:hover": { 
                    borderWidth: 2,
                    borderColor: "primary.main",
                    background: (theme) => alpha(theme.palette.primary.main, 0.05),
                  },
                }}
              >
                Cancel
              </Button>
              <PrimaryButton
                fullWidth
                variant="contained"
                onClick={handleSave}
                disabled={saving || !form.title || !form.desc || !form.url}
                disableElevation
                sx={{ py: 1.5 }}
              >
                {saving ? (
                  <CircularProgress size={20} sx={{ color: "#fff" }} />
                ) : editData ? (
                  "Update"
                ) : (
                  "Create"
                )}
              </PrimaryButton>
            </Box>
          </FormSection>
        </ModernDialog>
      </PageContainer>
    </DashboardLayout>
  );
}