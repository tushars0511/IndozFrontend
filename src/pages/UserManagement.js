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
        MenuItem,
        Select,
        FormControl,
        InputLabel,
    } from "@mui/material";
    import { styled, alpha } from "@mui/material/styles";
    import SearchIcon from "@mui/icons-material/Search";
    import PeopleOutlineIcon from "@mui/icons-material/PeopleOutline";

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

    export default function UserManagement() {
    // ...existing state and effects...
    const [users, setUsers] = useState([]);
    const [filteredUsers, setFilteredUsers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [page, setPage] = useState(0);
    const rowsPerPage = 50;
    const [searchQuery, setSearchQuery] = useState("");

    useEffect(() => {
        setLoading(true);
        fetch(`${API_BASE}/users`)
        .then((res) => res.json())
        .then((data) => {
            if (!data.success) throw new Error(data.message || "Failed to fetch users");
            const sortedUsers = [...data.users].sort((a, b) => {
            const dateA = new Date(a.created_at || a.createdAt || 0);
            const dateB = new Date(b.created_at || b.createdAt || 0);
            return dateB - dateA;
            });
            setUsers(sortedUsers);
            setFilteredUsers(sortedUsers);
            setError(null);
        })
        .catch((e) => setError(e.message))
        .finally(() => setLoading(false));
    }, []);

    useEffect(() => {
        if (searchQuery.trim() === "") {
        setFilteredUsers(users);
        setPage(0);
        } else {
        const query = searchQuery.toLowerCase();
        const filtered = users.filter(
            (user) =>
            user.name?.toLowerCase().includes(query) ||
            user.email?.toLowerCase().includes(query)
        );
        setFilteredUsers(filtered);
        setPage(0);
        }
    }, [searchQuery, users]);

    const totalPages = Math.ceil(filteredUsers.length / rowsPerPage);
    const handlePageChange = (event, value) => {
        setPage(value - 1);
    };
    // rowsPerPage is fixed at 50; no handler needed
    const startIndex = page * rowsPerPage;
    const endIndex = Math.min(startIndex + rowsPerPage, filteredUsers.length);
    const paginatedUsers = filteredUsers.slice(startIndex, endIndex);

    return (
        <DashboardLayout>
        <PageWrapper>
            <Header>
            <Box display="flex" alignItems="center" gap={2} mb={3}>
                <IconBox>
                <PeopleOutlineIcon sx={{ color: "#fff", fontSize: 28 }} />
                </IconBox>
                <Box flex={1}>
                <Typography variant="h3" fontWeight={800} sx={{ mb: 0.5, letterSpacing: "-0.02em" }}>
                    User Management
                </Typography>
                <Typography variant="body1" color="text.secondary" fontWeight={500}>
                    Manage and monitor all registered users
                </Typography>
                </Box>
            </Box>

            {!loading && users.length > 0 && (
                <StatsBox>
                <IconBox>
                    <PeopleOutlineIcon sx={{ color: "#fff", fontSize: 24 }} />
                </IconBox>
                <Box>
                    <Typography variant="h4" fontWeight={700}>
                    {users.length}
                    </Typography>
                    <Typography variant="body2" color="text.secondary" fontWeight={500}>
                    Total Users
                    </Typography>
                </Box>
                </StatsBox>
            )}
            </Header>

            <MainCard>
            <ToolbarBox>
                <SearchInput
                placeholder="Search by name or email..."
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
                {filteredUsers.length} {filteredUsers.length === 1 ? "user" : "users"}
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
                ) : filteredUsers.length === 0 ? (
                <EmptyBox>
                    <EmptyIconBox>
                    <PeopleOutlineIcon sx={{ fontSize: 48, color: "text.secondary", opacity: 0.5 }} />
                    </EmptyIconBox>
                    <Typography variant="h5" fontWeight={700} gutterBottom>
                    {searchQuery ? "No users found" : "No users yet"}
                    </Typography>
                    <Typography variant="body1" color="text.secondary" sx={{ maxWidth: 400, mx: "auto" }}>
                    {searchQuery
                        ? "Try adjusting your search query"
                        : "Users will appear here once they register"}
                    </Typography>
                </EmptyBox>
                ) : (
                <>
                    <TableWrapper>
                    <StyledTable>
                        <TableHeader>
                        <tr>
                            <HeaderCell style={{ width: "100px" }}>S.No</HeaderCell>
                            <HeaderCell style={{ width: "35%" }}>Name</HeaderCell>
                            <HeaderCell style={{ width: "calc(65% - 100px)" }}>Email</HeaderCell>
                        </tr>
                        </TableHeader>
                        <TableBody>
                        {paginatedUsers.map((user, index) => (
                            <TableRow key={user.id || index}>
                            <DataCell style={{ width: "100px" }}>
                                <Typography variant="body2" fontWeight={500} color="text.secondary">
                                {startIndex + index + 1}
                                </Typography>
                            </DataCell>
                            <DataCell style={{ width: "35%" }}>
                                <Typography
                                variant="body2"
                                fontWeight={600}
                                sx={{
                                    overflow: "hidden",
                                    textOverflow: "ellipsis",
                                    whiteSpace: "nowrap",
                                }}
                                >
                                {user.name}
                                </Typography>
                            </DataCell>
                            <DataCell style={{ width: "calc(65% - 100px)" }}>
                                <Typography
                                variant="body2"
                                color="text.secondary"
                                sx={{
                                    overflow: "hidden",
                                    textOverflow: "ellipsis",
                                    whiteSpace: "nowrap",
                                }}
                                >
                                {user.email}
                                </Typography>
                            </DataCell>
                            </TableRow>
                        ))}
                        </TableBody>
                    </StyledTable>
                    </TableWrapper>
          {filteredUsers.length > 0 && (
            <PaginationBox>
              <Typography variant="body2" color="text.secondary">
                {filteredUsers.length === 0
                  ? "0"
                  : `${startIndex + 1}-${endIndex}`} of {filteredUsers.length}
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