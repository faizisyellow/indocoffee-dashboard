import { useState, useMemo } from "react";
import {
  Box,
  Typography,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Chip,
  Button,
  Stack,
  CircularProgress,
  Alert,
} from "@mui/material";
import { useNavigate } from "react-router";
import { ArrowUpDown } from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import { ordersService } from "../lib/service/orders";
import type { Order, OrderStatus } from "../lib/store";
import type { AxiosError } from "axios";
import type { GetOrdersResponse } from "../lib/service/response/orders";

export function OrdersList() {
  const navigate = useNavigate();

  const [selectedStatus, setSelectedStatus] = useState<OrderStatus | null>(
    null,
  );
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">("desc");
  const [page, setPage] = useState<number>(1);
  const [limit] = useState<number>(10);

  const statusOptions: OrderStatus[] = [
    "confirm",
    "roasting",
    "shipped",
    "complete",
    "cancelled",
  ];

  const {
    data: orders,
    isLoading,
    isError,
    error,
    refetch,
  } = useQuery({
    queryKey: ["orders", selectedStatus, sortOrder, page, limit],
    queryFn: () => {
      const offset = (page - 1) * limit;
      return ordersService.GetOrders(
        selectedStatus ?? undefined,
        sortOrder,
        offset,
        limit,
      );
    },
  });

  const handleRowClick = (orderId: string) => {
    navigate(`/orders/${orderId}`);
  };

  const handleFilterChange = (status: OrderStatus) => {
    setSelectedStatus(selectedStatus === status ? null : status);
    setPage(1);
  };

  const handleSortToggle = () => {
    setSortOrder((prev) => (prev === "asc" ? "desc" : "asc"));
    setPage(1);
  };

  const handlePageChange = (newPage: number) => {
    setPage(newPage);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const getErrorMessage = (): string => {
    const err = error as AxiosError<GetOrdersResponse>;
    if (!err?.response) {
      if (err?.message === "Network Error" || err?.code === "ERR_NETWORK") {
        return "Unable to reach the server. Please check your internet connection and try again.";
      }
      return "A network issue occurred. Please try again.";
    }

    const status = err.response.status;
    switch (status) {
      case 400:
        return "Invalid request. Try again.";
      case 401:
        return "Unauthorized access. Please log in again.";
      case 500:
        return "Our server is having trouble right now. Please try again later.";
      default:
        if (status >= 500) {
          return "Our server is having trouble right now. Please try again later.";
        }
        return "An unexpected error occurred. Please try again.";
    }
  };

  const sortedOrders = useMemo(() => {
    if (!orders) return [];
    return [...orders].sort((a, b) => {
      const dateA = new Date(a.created_at).getTime();
      const dateB = new Date(b.created_at).getTime();
      return sortOrder === "asc" ? dateA - dateB : dateB - dateA;
    });
  }, [orders, sortOrder]);

  const isLastPage = (orders?.length ?? 0) < limit;

  return (
    <Paper
      elevation={0}
      sx={{
        bgcolor: "white",
        borderRadius: 2,
        overflow: "hidden",
      }}
    >
      <Box sx={{ p: 4, bgcolor: "white" }}>
        <Typography variant="h5" sx={{ fontWeight: 600, mb: 3 }}>
          List all Orders
        </Typography>

        <Box
          sx={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            flexWrap: "wrap",
            gap: 2,
            mb: 3,
          }}
        >
          <Stack direction="row" spacing={1}>
            {statusOptions.map((status) => (
              <Chip
                key={status}
                label={status}
                clickable
                color={selectedStatus === status ? "primary" : "default"}
                onClick={() => handleFilterChange(status)}
                variant={selectedStatus === status ? "filled" : "outlined"}
                sx={{
                  fontWeight: 500,
                  textTransform: "capitalize",
                }}
              />
            ))}
          </Stack>

          <Button
            variant="outlined"
            startIcon={<ArrowUpDown size={16} />}
            onClick={handleSortToggle}
            sx={{
              textTransform: "none",
              borderRadius: 2,
              px: 2.5,
              py: 0.5,
              fontWeight: 500,
            }}
          >
            Sort by Date: {sortOrder === "asc" ? "Oldest" : "Newest"}
          </Button>
        </Box>

        {isLoading && (
          <Box sx={{ display: "flex", justifyContent: "center", py: 10 }}>
            <CircularProgress />
          </Box>
        )}

        {isError && (
          <Box sx={{ py: 5 }}>
            <Alert severity="error" sx={{ mb: 2 }}>
              {getErrorMessage()}
            </Alert>
            <Button variant="outlined" onClick={() => refetch()}>
              Retry
            </Button>
          </Box>
        )}

        {!isLoading && !isError && (
          <>
            <Box
              sx={{
                border: "1px solid #ccc",
                borderRadius: 1,
                minHeight: 500,
              }}
            >
              <TableContainer>
                <Table>
                  <TableHead>
                    <TableRow sx={{ bgcolor: "#f5f5f5" }}>
                      <TableCell sx={{ fontWeight: 600 }}>No</TableCell>
                      <TableCell sx={{ fontWeight: 600 }}>
                        Customer Email
                      </TableCell>
                      <TableCell sx={{ fontWeight: 600 }}>Items</TableCell>
                      <TableCell sx={{ fontWeight: 600 }}>
                        Total Price
                      </TableCell>
                      <TableCell sx={{ fontWeight: 600 }}>Status</TableCell>
                      <TableCell sx={{ fontWeight: 600 }}>Order At</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {sortedOrders.map((order: Order, index: number) => (
                      <TableRow
                        key={order.id}
                        onClick={() => handleRowClick(order.id)}
                        sx={{
                          cursor: "pointer",
                          "&:hover": { bgcolor: "#f5f5f5" },
                        }}
                      >
                        <TableCell>{(page - 1) * limit + index + 1}</TableCell>
                        <TableCell>{order.customer_email}</TableCell>
                        <TableCell>{order.items.length}</TableCell>
                        <TableCell>${order.total_price.toFixed(2)}</TableCell>
                        <TableCell>
                          <Chip
                            label={order.status}
                            sx={{
                              borderRadius: 1,
                              fontWeight: 600,
                              textTransform: "capitalize",
                              letterSpacing: 0.2,
                              fontSize: "0.85rem",
                              px: 1.5,
                              backgroundColor: () => {
                                switch (order.status) {
                                  case "confirm":
                                    return "rgba(33, 150, 243, 0.1)";
                                  case "roasting":
                                    return "rgba(255, 152, 0, 0.1)";
                                  case "shipped":
                                    return "rgba(3, 169, 244, 0.1)";
                                  case "complete":
                                    return "rgba(76, 175, 80, 0.1)";
                                  case "cancelled":
                                    return "rgba(244, 67, 54, 0.1)";
                                  default:
                                    return "rgba(158, 158, 158, 0.1)";
                                }
                              },
                              color: (theme) => {
                                switch (order.status) {
                                  case "confirm":
                                    return "#2196f3";
                                  case "roasting":
                                    return "#ff9800";
                                  case "shipped":
                                    return "#03a9f4";
                                  case "complete":
                                    return "#4caf50";
                                  case "cancelled":
                                    return "#f44336";
                                  default:
                                    return theme.palette.text.secondary;
                                }
                              },
                            }}
                          />
                        </TableCell>
                        <TableCell>
                          {new Date(order.created_at).toLocaleString()}
                        </TableCell>
                      </TableRow>
                    ))}

                    {sortedOrders.length === 0 && (
                      <TableRow>
                        <TableCell colSpan={6} align="center" sx={{ py: 5 }}>
                          No orders found.
                        </TableCell>
                      </TableRow>
                    )}
                  </TableBody>
                </Table>
              </TableContainer>
            </Box>

            {/* Pagination controls */}
            <Box
              sx={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                mt: 3,
                px: 2,
              }}
            >
              <Typography variant="body2" color="text.secondary">
                Page {page} • Showing {orders?.length ?? 0} items
              </Typography>
              <Box sx={{ display: "flex", gap: 1, alignItems: "center" }}>
                <Button
                  variant="outlined"
                  size="small"
                  disabled={page === 1}
                  onClick={() => handlePageChange(page - 1)}
                  sx={{
                    textTransform: "none",
                    minWidth: 90,
                  }}
                >
                  Previous
                </Button>
                <Typography
                  variant="body2"
                  sx={{ px: 2, color: "text.secondary" }}
                >
                  Page {page}
                </Typography>
                <Button
                  variant="outlined"
                  size="small"
                  disabled={isLastPage}
                  onClick={() => handlePageChange(page + 1)}
                  sx={{
                    textTransform: "none",
                    minWidth: 90,
                  }}
                >
                  Next
                </Button>
              </Box>
            </Box>
          </>
        )}
      </Box>
    </Paper>
  );
}
