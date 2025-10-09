import { useState, useEffect } from "react";
import { Box, Typography, Paper, Button, Grid, Divider } from "@mui/material";
import { dataStore, type Order } from "../lib/store";
import { useParams, useNavigate } from "react-router";

export function OrderDetail() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [order, setOrder] = useState<Order | null>(null);
  const [showAll, setShowAll] = useState(false);

  useEffect(() => {
    if (id) {
      const foundOrder = dataStore.getOrder(id);
      if (foundOrder) {
        setOrder(foundOrder);
      } else {
        navigate("/orders");
      }
    }
  }, [id, navigate]);

  const handleNext = () => {
    if (order && order.currentStep < order.totalSteps) {
      const updatedOrder = dataStore.updateOrderStep(
        order.id,
        order.currentStep + 1,
      );
      if (updatedOrder) {
        setOrder(updatedOrder);
      }
    }
  };

  if (!order) return <Typography>Loading...</Typography>;

  const displayedItems = showAll ? order.items : order.items.slice(0, 2);

  return (
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
          Order #{order.orderId}
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
          {/* Header Row: Status + Next button */}
          <Box
            sx={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              mb: 3,
            }}
          >
            <Box>
              <Typography variant="subtitle1" sx={{ fontWeight: 600, mb: 0.5 }}>
                {order.status}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Steps {order.currentStep} of {order.totalSteps}
              </Typography>
            </Box>

            <Button
              variant="contained"
              onClick={handleNext}
              disabled={order.currentStep >= order.totalSteps}
              sx={{
                bgcolor: "#4A90E2",
                "&:hover": { bgcolor: "#357ABD" },
                textTransform: "none",
                px: 5,
                py: 1.25,
                fontSize: "0.875rem",
              }}
            >
              Next
            </Button>
          </Box>

          {/* Main Grid */}
          <Grid
            container
            spacing={3}
            sx={{
              maxWidth: "1000px",
              margin: "0 auto",
              transition: "max-width 0.3s ease",
            }}
          >
            {/* LEFT: Items */}
            <Grid size={{ xs: 12, md: 7 }}>
              {displayedItems.map((item, index) => (
                <Box key={index} sx={{ mb: 2 }}>
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
                    {/* Product Image */}
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
                      {item.productImage ? (
                        <img
                          src={item.productImage}
                          alt={item.productName}
                          style={{
                            width: "100%",
                            height: "100%",
                            objectFit: "cover",
                            borderRadius: "6px",
                          }}
                        />
                      ) : (
                        <Typography variant="caption" fontWeight={600}>
                          INDOCOFFEE
                        </Typography>
                      )}
                    </Box>

                    {/* Info */}
                    <Box sx={{ flexGrow: 1 }}>
                      <Typography
                        variant="subtitle1"
                        sx={{ fontWeight: 700, mb: 0.5 }}
                      >
                        {item.productName}
                      </Typography>
                      <Typography
                        variant="body2"
                        sx={{ mb: 0.5, color: "text.secondary" }}
                      >
                        ${item.price}
                      </Typography>
                      <Typography
                        variant="body2"
                        color="text.secondary"
                        sx={{
                          mb: 0.5,
                          whiteSpace: "pre-line",
                        }}
                      >
                        {item.productDetails}
                      </Typography>
                      <Typography variant="body2" sx={{ fontWeight: 500 }}>
                        Qty: {item.quantity}
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

            {/* RIGHT: Summary */}
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
                  ["Email", order.customerEmail],
                  ["Name", order.customerName],
                  ["Address", order.customerAddress],
                  ["Order at", order.createdAt],
                ].map(([label, value], i) => (
                  <Box key={i} sx={{ mb: 1.5 }}>
                    <Typography
                      variant="body2"
                      sx={{ fontWeight: 600, mb: 0.25 }}
                    >
                      {label}
                    </Typography>
                    <Typography
                      variant="body2"
                      color="text.secondary"
                      sx={label === "Address" ? { whiteSpace: "pre-line" } : {}}
                    >
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
                      Sub total
                    </Typography>
                    <Typography variant="body2">${order.subtotal}</Typography>
                  </Box>
                  <Box
                    sx={{
                      display: "flex",
                      justifyContent: "space-between",
                      mb: 1,
                    }}
                  >
                    <Typography variant="body2" color="text.secondary">
                      Shipping
                    </Typography>
                    <Typography variant="body2">${order.shipping}</Typography>
                  </Box>
                  <Divider sx={{ my: 1 }} />
                  <Box
                    sx={{
                      display: "flex",
                      justifyContent: "space-between",
                    }}
                  >
                    <Typography variant="body1" sx={{ fontWeight: 700 }}>
                      Total
                    </Typography>
                    <Typography variant="body1" sx={{ fontWeight: 700 }}>
                      ${order.total}
                    </Typography>
                  </Box>
                </Box>
              </Box>
            </Grid>
          </Grid>
        </Box>
      </Box>
    </Paper>
  );
}
