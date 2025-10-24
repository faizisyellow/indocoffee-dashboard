import { useState } from "react";
import {
  Box,
  Typography,
  Paper,
  Button,
  Grid,
  Divider,
  CircularProgress,
  Alert,
  Chip,
  capitalize,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogContentText,
  DialogActions,
  Snackbar,
} from "@mui/material";
import { useParams, useNavigate } from "react-router";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import type { AxiosError } from "axios";
import type { Order, OrderStatus } from "../lib/store";
import { ordersService } from "../lib/service/orders";

function getErrorMessageFromStatus(error?: AxiosError): string {
  if (!error) return "An unexpected error occurred.";
  const status = error.response?.status;

  if (!status) {
    if (error.message === "Network Error" || error.code === "ERR_NETWORK") {
      return "Unable to reach the server. Please check your internet connection.";
    }
    return "A network issue occurred. Please try again.";
  }

  switch (status) {
    case 400:
      return "Invalid request. Please try again.";
    case 401:
    case 403:
    case 404:
      return "The requested order was not found or you don't have access.";
    case 500:
      return "Server error. Please try again later.";
    default:
      return "An unexpected error occurred. Please try again.";
  }
}

export function OrderDetail() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  const [showAll, setShowAll] = useState(false);
  const [confirmDialog, setConfirmDialog] = useState<{
    open: boolean;
    nextStatus?: OrderStatus;
  }>({ open: false });
  const [showSnackbar, setShowSnackbar] = useState(false);
  const userRole = localStorage.getItem("role");
  const isSuperAdmin = userRole === "super admin";

  const {
    data: order,
    isLoading,
    isError,
    error,
  } = useQuery<Order, AxiosError>({
    queryKey: ["orders", id],
    queryFn: async () => {
      if (!id) throw new Error("Order ID not found");
      return ordersService.GetOrder(id);
    },
    retry: false,
  });

  const resultUpdateOrderStatus = useMutation({
    mutationFn: (payload: { id: string; status: OrderStatus }) =>
      ordersService.UpdateStatusOrder(payload.id, payload.status),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["orders", id] });
      setShowSnackbar(true);
      setConfirmDialog({ open: false });
    },
    onError: () => {
      (document.activeElement as HTMLElement)?.blur();
      setConfirmDialog({ open: false });
    },
  });

  function handleUpdateStatusOrder(currentStatus: OrderStatus) {
    if (!id) return;
    if (currentStatus === "cancelled" || currentStatus === "complete") return;

    const statusFlow: OrderStatus[] = [
      "confirm",
      "roasting",
      "shipped",
      "complete",
    ];

    const currentIndex = statusFlow.indexOf(currentStatus);
    const nextStatus = statusFlow[currentIndex + 1];
    if (!nextStatus) return;

    setConfirmDialog({ open: true, nextStatus });
  }

  function confirmUpdate() {
    if (!id || !confirmDialog.nextStatus) return;
    resultUpdateOrderStatus.mutate({ id, status: confirmDialog.nextStatus });
  }

  if (isLoading)
    return (
      <Box sx={{ display: "flex", justifyContent: "center", mt: 10 }}>
        <CircularProgress />
      </Box>
    );

  if (isError)
    return (
      <Box sx={{ p: 3 }}>
        <Alert severity="error" sx={{ mb: 2 }}>
          {getErrorMessageFromStatus(error)}
        </Alert>
        <Button
          variant="contained"
          color="primary"
          onClick={() => navigate("/orders")}
        >
          Back to Orders
        </Button>
      </Box>
    );

  if (!order) return <Typography>No order found.</Typography>;

  const displayedItems = showAll ? order.items : order.items.slice(0, 2);

  return (
    <>
      <Paper
        elevation={0}
        sx={{
          bgcolor: "white",
          borderRadius: 2,
          overflow: "hidden",
        }}
      >
        <Box sx={{ p: 3, bgcolor: "white" }}>
          <Typography variant="h6" sx={{ fontWeight: 600, mb: 3 }}>
            Order #{order.id}
          </Typography>

          <Box
            sx={{
              border: "1px solid #ddd",
              borderRadius: 1.5,
              p: 3,
              minHeight: 480,
              position: "relative",
            }}
          >
            {/* Header Row */}
            <Box
              sx={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                mb: 3,
              }}
            >
              <Box>
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
                          return "rgba(33,150,243,0.1)";
                        case "roasting":
                          return "rgba(255,152,0,0.1)";
                        case "shipped":
                          return "rgba(3,169,244,0.1)";
                        case "complete":
                          return "rgba(76,175,80,0.1)";
                        case "cancelled":
                          return "rgba(244,67,54,0.1)";
                        default:
                          return "rgba(158,158,158,0.1)";
                      }
                    },
                    color: () => {
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
                          return "#757575";
                      }
                    },
                  }}
                />
                <Typography
                  variant="body2"
                  color="text.secondary"
                  sx={{ marginTop: 1 }}
                >
                  Order placed at {new Date(order.created_at).toLocaleString()}
                </Typography>
              </Box>

              <Button
                variant="contained"
                onClick={() =>
                  handleUpdateStatusOrder(order.status as OrderStatus)
                }
                disabled={
                  order.status === "cancelled" ||
                  order.status === "complete" ||
                  resultUpdateOrderStatus.isPending ||
                  !isSuperAdmin
                }
                sx={{
                  bgcolor:
                    order.status === "cancelled" || order.status === "complete"
                      ? "#ccc"
                      : "#4A90E2",
                  textTransform: "none",
                  px: 5,
                  py: 1.25,
                  fontSize: "0.875rem",
                  "&:hover": {
                    bgcolor:
                      order.status === "cancelled" ||
                      order.status === "complete"
                        ? "#ccc"
                        : "#357ABD",
                  },
                }}
              >
                {resultUpdateOrderStatus.isPending
                  ? "Updating..."
                  : order.status === "complete"
                    ? "Completed"
                    : order.status === "cancelled"
                      ? "Cancelled"
                      : (() => {
                          const statusFlow: OrderStatus[] = [
                            "confirm",
                            "roasting",
                            "shipped",
                            "complete",
                          ];
                          const currentIndex = statusFlow.indexOf(
                            order.status as OrderStatus,
                          );
                          const nextStatus = statusFlow[currentIndex + 1];
                          return nextStatus
                            ? `Next: ${capitalize(nextStatus)}`
                            : "Next";
                        })()}
              </Button>
            </Box>

            {resultUpdateOrderStatus.isError && (
              <Alert
                severity="error"
                sx={{
                  mb: 2,
                  borderRadius: 1,
                  fontSize: "0.875rem",
                  bgcolor: "rgba(244, 67, 54, 0.05)",
                }}
              >
                {getErrorMessageFromStatus(
                  resultUpdateOrderStatus.error as AxiosError,
                )}
              </Alert>
            )}

            {/* Main Grid */}
            <Grid container spacing={3}>
              {/* Left: Items */}
              <Grid size={{ xs: 12, md: 7 }}>
                {displayedItems.map((item, index) => (
                  <Box key={item.id} sx={{ mb: 2 }}>
                    <Box
                      sx={{
                        display: "flex",
                        gap: 2,
                        p: 2,
                        bgcolor: "#fafafa",
                        borderRadius: 1,
                        alignItems: "center",
                      }}
                    >
                      <Box
                        sx={{
                          width: 80,
                          height: 80,
                          bgcolor: "white",
                          border: "1px solid #ccc",
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center",
                          borderRadius: 1,
                          flexShrink: 0,
                        }}
                      >
                        {item.image ? (
                          <img
                            src={item.image}
                            alt={item.bean_name}
                            style={{
                              width: "100%",
                              height: "100%",
                              objectFit: "cover",
                            }}
                          />
                        ) : (
                          <Typography variant="caption" fontWeight={600}>
                            INDOCOFFEE
                          </Typography>
                        )}
                      </Box>

                      <Box sx={{ flexGrow: 1 }}>
                        <Typography
                          variant="subtitle1"
                          sx={{ fontWeight: 700, mb: 0.5 }}
                        >
                          {capitalize(item.bean_name)}
                        </Typography>
                        <Typography
                          variant="body2"
                          sx={{ mb: 0.5, color: "text.secondary" }}
                        >
                          ${item.price}
                        </Typography>
                        <Typography variant="body2" color="text.secondary">
                          {capitalize(item.roasted)} /{" "}
                          {capitalize(item.form_name)}
                        </Typography>
                        <Typography variant="body2" sx={{ fontWeight: 500 }}>
                          Qty: {item.order_quantity}
                        </Typography>
                      </Box>
                    </Box>
                    {index < displayedItems.length - 1 && (
                      <Divider sx={{ my: 2 }} />
                    )}
                  </Box>
                ))}

                {order.items.length > 2 && (
                  <Box sx={{ textAlign: "center", mt: 1 }}>
                    <Button
                      variant="text"
                      onClick={() => setShowAll(!showAll)}
                      sx={{
                        textTransform: "none",
                        fontWeight: 600,
                        color: "#4A90E2",
                        fontSize: "0.875rem",
                      }}
                    >
                      {showAll
                        ? "Show less"
                        : `Show more (${order.items.length - 2} more)`}
                    </Button>
                  </Box>
                )}
              </Grid>

              {/* Right: Summary */}
              <Grid size={{ xs: 12, md: 5 }}>
                <Box
                  sx={{
                    bgcolor: "#f9f9f9",
                    p: 2.5,
                    borderRadius: 1,
                    fontSize: "0.875rem",
                  }}
                >
                  {[
                    ["Email", order.customer_email],
                    ["Name", order.customer_name],
                    ["Address", `${order.street}, ${order.city}`],
                    ["Phone", order.phone_number],
                    ["Alt. Phone", order.alternative_phone_number],
                    ["Order at", new Date(order.created_at).toLocaleString()],
                  ].map(([label, value], i) => (
                    <Box key={i} sx={{ mb: 1.5 }}>
                      <Typography
                        variant="body2"
                        sx={{ fontWeight: 600, mb: 0.25 }}
                      >
                        {label}
                      </Typography>
                      <Typography variant="body2" color="text.secondary">
                        {value}
                      </Typography>
                    </Box>
                  ))}

                  <Divider sx={{ my: 2 }} />

                  <Box>
                    <Typography
                      variant="subtitle1"
                      sx={{ fontWeight: 700, mb: 1 }}
                    >
                      Total
                    </Typography>
                    <Box
                      sx={{
                        display: "flex",
                        justifyContent: "space-between",
                        mb: 0.5,
                      }}
                    >
                      <Typography variant="body2" color="text.secondary">
                        Total Price
                      </Typography>
                      <Typography variant="body2">
                        ${order.total_price.toFixed(2)}
                      </Typography>
                    </Box>
                  </Box>
                </Box>
              </Grid>
            </Grid>
          </Box>
        </Box>
      </Paper>

      <Dialog
        open={confirmDialog.open}
        onClose={() => setConfirmDialog({ open: false })}
      >
        <DialogTitle>Confirm Status Update</DialogTitle>
        <DialogContent>
          <DialogContentText>
            Are you sure you want to update the order status to{" "}
            <strong>{confirmDialog.nextStatus}</strong>?
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button
            onClick={() => setConfirmDialog({ open: false })}
            color="inherit"
          >
            Cancel
          </Button>
          <Button
            onClick={confirmUpdate}
            color="primary"
            variant="contained"
            disabled={resultUpdateOrderStatus.isPending}
          >
            {resultUpdateOrderStatus.isPending ? "Updating..." : "Confirm"}
          </Button>
        </DialogActions>
      </Dialog>

      <Snackbar
        open={showSnackbar}
        autoHideDuration={3000}
        onClose={() => setShowSnackbar(false)}
        anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
      >
        <Alert severity="success" sx={{ width: "100%" }}>
          Order status updated successfully!
        </Alert>
      </Snackbar>
    </>
  );
}
