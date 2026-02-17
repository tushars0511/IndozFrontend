import React, { useEffect, useState } from "react";
import DashboardLayout from "examples/LayoutContainers/DashboardLayout";
import {
  Box,
  Card,
  CardContent,
  Typography,
  TextField,
  InputAdornment,
  CircularProgress,
  Alert,
  Pagination,
  Stack,
  Tabs,
  Tab,
} from "@mui/material";
import { styled, alpha } from "@mui/material/styles";
import SearchIcon from "@mui/icons-material/Search";
import ContactMailIcon from "@mui/icons-material/ContactMail";
import CampaignIcon from "@mui/icons-material/Campaign";
import MeetingRoomIcon from "@mui/icons-material/MeetingRoom";

const API_BASE = process.env.REACT_APP_API_BASE || "http://ec2-15-134-208-12.ap-southeast-2.compute.amazonaws.com:3000/api";

const PageWrapper = styled(Box)(({ theme }) => ({
  minHeight: "100vh",
  background: theme.palette.mode === "dark" ? "#0f172a" : "#f1f5f9",
  padding: "32px",
  [theme.breakpoints.down("md")]: {
    padding: "16px",
  },
}));

const Header = styled(Box)({
  marginBottom: "32px",
});

const IconBox = styled(Box)({
  width: "56px",
  height: "56px",
  borderRadius: "16px",
  background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  boxShadow: "0 8px 24px rgba(102, 126, 234, 0.3)",
});

const StatsBox = styled(Box)(({ theme }) => ({
  background: theme.palette.mode === "dark" ? theme.palette.background.paper : "#ffffff",
  border: `1px solid ${theme.palette.divider}`,
  borderRadius: "20px",
  padding: "20px",
  display: "flex",
  alignItems: "center",
  gap: "16px",
  maxWidth: "300px",
}));

const MainCard = styled(Card)(({ theme }) => ({
  borderRadius: "20px",
  background: theme.palette.mode === "dark" ? theme.palette.background.paper : "#ffffff",
  border: `1px solid ${theme.palette.divider}`,
  boxShadow: "none",
  overflow: "hidden",
}));

const StyledTabs = styled(Tabs)(({ theme }) => ({
  borderBottom: `1px solid ${theme.palette.divider}`,
  padding: "0 24px",
  minHeight: "64px",
  "& .MuiTabs-indicator": {
    height: "3px",
    borderRadius: "3px 3px 0 0",
  },
}));

const StyledTab = styled(Tab)(({ theme }) => ({
  textTransform: "none",
  fontWeight: 600,
  fontSize: "15px",
  minHeight: "64px",
  padding: "12px 24px",
  color: theme.palette.text.secondary,
  "&.Mui-selected": {
    color: theme.palette.primary.main,
  },
  "&:hover": {
    color: theme.palette.primary.main,
    opacity: 0.8,
  },
}));

const ToolbarBox = styled(Box)(({ theme }) => ({
  padding: "24px",
  display: "flex",
  alignItems: "center",
  justifyContent: "space-between",
  gap: "16px",
  borderBottom: `1px solid ${theme.palette.divider}`,
  [theme.breakpoints.down("sm")]: {
    flexDirection: "column",
    alignItems: "stretch",
  },
}));

const SearchInput = styled(TextField)(({ theme }) => ({
  minWidth: "320px",
  "& .MuiOutlinedInput-root": {
    borderRadius: "14px",
    background: theme.palette.mode === "dark" ? theme.palette.grey[800] : theme.palette.grey[100],
    "& fieldset": {
      border: "none",
    },
    "&:hover": {
      background: theme.palette.mode === "dark" ? theme.palette.grey[700] : theme.palette.grey[200],
    },
    "&.Mui-focused": {
      background: theme.palette.mode === "dark" ? theme.palette.grey[800] : theme.palette.grey[100],
      boxShadow: `0 0 0 3px ${alpha(theme.palette.primary.main, 0.1)}`,
    },
  },
  [theme.breakpoints.down("sm")]: {
    minWidth: "100%",
  },
}));

const TableWrapper = styled(Box)({
  width: "100%",
  overflowX: "auto",
  overflowY: "auto",
  maxHeight: "calc(100vh - 450px)",
  "&::-webkit-scrollbar": {
    width: "8px",
    height: "8px",
  },
  "&::-webkit-scrollbar-track": {
    background: "transparent",
  },
  "&::-webkit-scrollbar-thumb": {
    background: "#cbd5e1",
    borderRadius: "4px",
    "&:hover": {
      background: "#94a3b8",
    },
  },
});

const StyledTable = styled("table")(({ theme }) => ({
  width: "100%",
  borderCollapse: "separate",
  borderSpacing: 0,
}));

const TableHeader = styled("thead")(({ theme }) => ({
  position: "sticky",
  top: 0,
  zIndex: 10,
  backgroundColor: theme.palette.mode === "dark" ? theme.palette.grey[900] : theme.palette.grey[50],
}));

const HeaderCell = styled("th")(({ theme }) => ({
  padding: "16px 20px",
  textAlign: "left",
  fontSize: "12px",
  fontWeight: 600,
  textTransform: "uppercase",
  letterSpacing: "0.8px",
  color: theme.palette.text.secondary,
  borderBottom: `2px solid ${theme.palette.divider}`,
  backgroundColor: theme.palette.mode === "dark" ? theme.palette.grey[900] : theme.palette.grey[50],
  whiteSpace: "nowrap",
}));

const TableBody = styled("tbody")({});

const TableRow = styled("tr")(({ theme }) => ({
  transition: "background-color 0.15s ease",
  "&:hover": {
    backgroundColor: theme.palette.mode === "dark"
      ? alpha(theme.palette.primary.main, 0.08)
      : alpha(theme.palette.primary.main, 0.04),
  },
}));

const DataCell = styled("td")(({ theme }) => ({
  padding: "16px 20px",
  borderBottom: `1px solid ${theme.palette.divider}`,
  fontSize: "14px",
  color: theme.palette.text.primary,
}));

const EmptyBox = styled(Box)({
  textAlign: "center",
  padding: "64px 24px",
});

const EmptyIconBox = styled(Box)(({ theme }) => ({
  width: "100px",
  height: "100px",
  margin: "0 auto 24px",
  borderRadius: "50%",
  background: theme.palette.mode === "dark" ? theme.palette.grey[800] : theme.palette.grey[100],
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
}));

const PaginationBox = styled(Box)(({ theme }) => ({
  padding: "20px 24px",
  borderTop: `1px solid ${theme.palette.divider}`,
  display: "flex",
  alignItems: "center",
  justifyContent: "space-between",
  flexWrap: "wrap",
  gap: "16px",
}));

export default function InquiryManagement() {
  const [activeTab, setActiveTab] = useState(0);
  const [hireStudioRequests, setHireStudioRequests] = useState([]);
  const [adsQuoteInquiries, setAdsQuoteInquiries] = useState([]);
  const [filteredData, setFilteredData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [page, setPage] = useState(0);
  const rowsPerPage = 50;
  const [searchQuery, setSearchQuery] = useState("");

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    setLoading(true);
    setError(null);
    try {
      const [hireRes, adsRes] = await Promise.all([
        fetch(`${API_BASE}/hire-studio-requests`),
        fetch(`${API_BASE}/ads-quote-inquiries`),
      ]);

      const hireData = await hireRes.json();
      const adsData = await adsRes.json();

      if (!hireData.success) throw new Error(hireData.message || "Failed to fetch hire studio requests");
      if (!adsData.success) throw new Error(adsData.message || "Failed to fetch ads quote inquiries");

      // Sort by date (newest first)
      const sortedHire = [...hireData.requests].sort((a, b) => {
        const dateA = new Date(a.createdAt || 0);
        const dateB = new Date(b.createdAt || 0);
        return dateB - dateA;
      });

      const sortedAds = [...adsData.inquiries].sort((a, b) => {
        const dateA = new Date(a.createdAt || 0);
        const dateB = new Date(b.createdAt || 0);
        return dateB - dateA;
      });

      setHireStudioRequests(sortedHire);
      setAdsQuoteInquiries(sortedAds);
      setFilteredData(activeTab === 0 ? sortedHire : sortedAds);
    } catch (e) {
      setError(e.message);
      console.error("Error loading data:", e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const currentData = activeTab === 0 ? hireStudioRequests : adsQuoteInquiries;
    if (searchQuery.trim() === "") {
      setFilteredData(currentData);
      setPage(0);
    } else {
      const query = searchQuery.toLowerCase();
      const filtered = currentData.filter((item) => {
        const userName = item.user?.name?.toLowerCase() || "";
        const userEmail = item.user?.email?.toLowerCase() || "";
        const itemEmail = item.email?.toLowerCase() || "";
        const itemPhone = item.phoneNumber?.toLowerCase() || "";
        const itemQuery = item.query?.toLowerCase() || "";
        return (
          userName.includes(query) ||
          userEmail.includes(query) ||
          itemEmail.includes(query) ||
          itemPhone.includes(query) ||
          itemQuery.includes(query)
        );
      });
      setFilteredData(filtered);
      setPage(0);
    }
  }, [searchQuery, activeTab, hireStudioRequests, adsQuoteInquiries]);

  const handleTabChange = (event, newValue) => {
    setActiveTab(newValue);
    setSearchQuery("");
    setPage(0);
  };

  const totalPages = Math.ceil(filteredData.length / rowsPerPage);
  const handlePageChange = (event, value) => {
    setPage(value - 1);
  };

  const startIndex = page * rowsPerPage;
  const endIndex = Math.min(startIndex + rowsPerPage, filteredData.length);
  const paginatedData = filteredData.slice(startIndex, endIndex);

  const formatDate = (dateString) => {
    if (!dateString) return "N/A";
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const currentData = activeTab === 0 ? hireStudioRequests : adsQuoteInquiries;
  const totalCount = currentData.length;

  return (
    <DashboardLayout>
      <PageWrapper>
        <Header>
          <Box display="flex" alignItems="center" gap={2} mb={3}>
            <IconBox>
              <ContactMailIcon sx={{ color: "#fff", fontSize: 28 }} />
            </IconBox>
            <Box flex={1}>
              <Typography variant="h3" fontWeight={800} sx={{ mb: 0.5, letterSpacing: "-0.02em" }}>
                Inquiry Management
              </Typography>
              <Typography variant="body1" color="text.secondary" fontWeight={500}>
                Manage studio requests and advertising inquiries
              </Typography>
            </Box>
          </Box>

          {!loading && totalCount > 0 && (
            <StatsBox>
              <IconBox>
                {activeTab === 0 ? (
                  <MeetingRoomIcon sx={{ color: "#fff", fontSize: 24 }} />
                ) : (
                  <CampaignIcon sx={{ color: "#fff", fontSize: 24 }} />
                )}
              </IconBox>
              <Box>
                <Typography variant="h4" fontWeight={700}>
                  {totalCount}
                </Typography>
                <Typography variant="body2" color="text.secondary" fontWeight={500}>
                  {activeTab === 0 ? "Studio Requests" : "Ad Inquiries"}
                </Typography>
              </Box>
            </StatsBox>
          )}
        </Header>

        <MainCard>
          <StyledTabs value={activeTab} onChange={handleTabChange}>
            <StyledTab
              icon={<MeetingRoomIcon sx={{ mr: 1 }} />}
              iconPosition="start"
              label="Hire Studio Requests"
            />
            <StyledTab
              icon={<CampaignIcon sx={{ mr: 1 }} />}
              iconPosition="start"
              label="Ads Quote Inquiries"
            />
          </StyledTabs>

          <ToolbarBox>
            <SearchInput
              placeholder="Search by name, email, phone, or query..."
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
            <Typography variant="body2" color="text.secondary" fontWeight={500}>
              {filteredData.length} {filteredData.length === 1 ? "inquiry" : "inquiries"}
            </Typography>
          </ToolbarBox>

          <CardContent sx={{ p: 0 }}>
            {loading ? (
              <Box display="flex" justifyContent="center" alignItems="center" minHeight={400}>
                <CircularProgress size={48} thickness={4} />
              </Box>
            ) : error ? (
              <Box sx={{ p: 3 }}>
                <Alert severity="error">{error}</Alert>
              </Box>
            ) : filteredData.length === 0 ? (
              <EmptyBox>
                <EmptyIconBox>
                  {activeTab === 0 ? (
                    <MeetingRoomIcon sx={{ fontSize: 48, color: "text.secondary", opacity: 0.5 }} />
                  ) : (
                    <CampaignIcon sx={{ fontSize: 48, color: "text.secondary", opacity: 0.5 }} />
                  )}
                </EmptyIconBox>
                <Typography variant="h5" fontWeight={700} gutterBottom>
                  {searchQuery ? "No inquiries found" : "No inquiries yet"}
                </Typography>
                <Typography variant="body1" color="text.secondary" sx={{ maxWidth: 400, mx: "auto" }}>
                  {searchQuery
                    ? "Try adjusting your search query"
                    : `No ${activeTab === 0 ? "studio requests" : "ad inquiries"} have been submitted yet`}
                </Typography>
              </EmptyBox>
            ) : (
              <>
                <TableWrapper>
                  <StyledTable>
                    <TableHeader>
                      <tr>
                        <HeaderCell style={{ width: "80px" }}>S.No</HeaderCell>
                        <HeaderCell style={{ width: "15%" }}>User Name</HeaderCell>
                        <HeaderCell style={{ width: "20%" }}>Email</HeaderCell>
                        <HeaderCell style={{ width: "13%" }}>Phone</HeaderCell>
                        <HeaderCell style={{ width: "32%" }}>Query</HeaderCell>
                        <HeaderCell style={{ width: "calc(20% - 80px)" }}>Date</HeaderCell>
                      </tr>
                    </TableHeader>
                    <TableBody>
                      {paginatedData.map((item, index) => (
                        <TableRow key={item.id || index}>
                          <DataCell style={{ width: "80px" }}>
                            <Typography variant="body2" fontWeight={500} color="text.secondary">
                              {startIndex + index + 1}
                            </Typography>
                          </DataCell>
                          <DataCell style={{ width: "15%" }}>
                            <Typography
                              variant="body2"
                              fontWeight={600}
                              sx={{
                                overflow: "hidden",
                                textOverflow: "ellipsis",
                                whiteSpace: "nowrap",
                              }}
                            >
                              {item.user?.name || "User deleted"}
                            </Typography>
                          </DataCell>
                          <DataCell style={{ width: "20%" }}>
                            <Typography
                              variant="body2"
                              color="text.secondary"
                              sx={{
                                overflow: "hidden",
                                textOverflow: "ellipsis",
                                whiteSpace: "nowrap",
                              }}
                            >
                              {item.email || "N/A"}
                            </Typography>
                          </DataCell>
                          <DataCell style={{ width: "13%" }}>
                            <Typography
                              variant="body2"
                              color="text.secondary"
                              sx={{
                                overflow: "hidden",
                                textOverflow: "ellipsis",
                                whiteSpace: "nowrap",
                              }}
                            >
                              {item.phoneNumber || "N/A"}
                            </Typography>
                          </DataCell>
                          <DataCell style={{ width: "32%" }}>
                            <Typography
                              variant="body2"
                              color="text.secondary"
                              sx={{
                                overflow: "hidden",
                                textOverflow: "ellipsis",
                                display: "-webkit-box",
                                WebkitLineClamp: 2,
                                WebkitBoxOrient: "vertical",
                              }}
                            >
                              {item.query || "N/A"}
                            </Typography>
                          </DataCell>
                          <DataCell style={{ width: "calc(20% - 80px)" }}>
                            <Typography
                              variant="body2"
                              color="text.secondary"
                              sx={{
                                overflow: "hidden",
                                textOverflow: "ellipsis",
                                whiteSpace: "nowrap",
                              }}
                            >
                              {formatDate(item.createdAt)}
                            </Typography>
                          </DataCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </StyledTable>
                </TableWrapper>
                {filteredData.length > 0 && (
                  <PaginationBox>
                    <Typography variant="body2" color="text.secondary">
                      {filteredData.length === 0
                        ? "0"
                        : `${startIndex + 1}-${endIndex}`} of {filteredData.length}
                    </Typography>
                    <Stack spacing={2} direction="row">
                      <Pagination
                        count={totalPages}
                        page={page + 1}
                        onChange={handlePageChange}
                        color="primary"
                        showFirstButton
                        showLastButton
                        siblingCount={1}
                        boundaryCount={1}
                        size="medium"
                        disabled={totalPages <= 1}
                      />
                    </Stack>
                  </PaginationBox>
                )}
              </>
            )}
          </CardContent>
        </MainCard>
      </PageWrapper>
    </DashboardLayout>
  );
}
