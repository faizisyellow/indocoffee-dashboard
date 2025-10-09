import { useState, useEffect } from "react";
import { Box, Typography, Paper, Button, Grid, Divider } from "@mui/material";
import { dataStore, type Order } from "../lib/store";
import { useParams, useNavigate } from "react-router";

export function OrderDetail() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [order, setOrder] = useState<Order | null>(null);

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

  if (!order) {
    return <Typography>Loading...</Typography>;
  }

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
        <Typography variant="h5" sx={{ fontWeight: 600, mb: 4 }}>
          Order #{order.orderId}
        </Typography>

        <Box
          sx={{
            border: "1px solid #ccc",
            borderRadius: 1,
            p: 4,
            minHeight: 500,
            position: "relative",
          }}
        >
          <Box sx={{ mb: 4 }}>
            <Typography variant="h6" sx={{ fontWeight: 600, mb: 1 }}>
              {order.status}
            </Typography>
            <Typography variant="body2" color="text.secondary">
              Steps {order.currentStep} of {order.totalSteps}
            </Typography>
          </Box>

          <Grid container spacing={4}>
            <Grid size={{ xs: 12, md: 8 }}>
              {order.items.map((item, index) => (
                <Box key={index} sx={{ mb: 3 }}>
                  <Box
                    sx={{
                      display: "flex",
                      gap: 3,
                      p: 3,
                      bgcolor: "#f5f5f5",
                      borderRadius: 1,
                    }}
                  >
                    <Box
                      sx={{
                        width: 120,
                        height: 120,
                        bgcolor: "white",
                        border: "1px solid #ccc",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        flexShrink: 0,
                        borderRadius: 1,
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
                          }}
                        />
                      ) : (
                        <Box
                          sx={{
                            width: "100%",
                            height: "100%",
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                            bgcolor: "#333",
                            color: "white",
                          }}
                        >
                          <Typography
                            variant="caption"
                            sx={{ fontWeight: 600 }}
                          >
                            INDOCOFFE
                          </Typography>
                        </Box>
                      )}
                    </Box>

                    <Box sx={{ flexGrow: 1 }}>
                      <Typography variant="h5" sx={{ fontWeight: 700, mb: 1 }}>
                        {item.productName}
                      </Typography>
                      <Typography variant="h6" sx={{ fontWeight: 600, mb: 2 }}>
                        ${item.price}
                      </Typography>
                      <Typography
                        variant="body2"
                        sx={{
                          whiteSpace: "pre-line",
                          color: "text.secondary",
                          mb: 2,
                        }}
                      >
                        {item.productDetails}
                      </Typography>
                      <Typography variant="body1" sx={{ fontWeight: 500 }}>
                        {item.quantity}x
                      </Typography>
                    </Box>
                  </Box>
                  {index < order.items.length - 1 && <Divider sx={{ my: 3 }} />}
                </Box>
              ))}
            </Grid>

            <Grid size={{ xs: 12, md: 8 }}>
              <Box sx={{ bgcolor: "#f5f5f5", p: 3, borderRadius: 1 }}>
                <Box sx={{ mb: 3 }}>
                  <Typography variant="body2" sx={{ fontWeight: 600, mb: 0.5 }}>
                    Email
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    {order.customerEmail}
                  </Typography>
                </Box>

                <Box sx={{ mb: 3 }}>
                  <Typography variant="body2" sx={{ fontWeight: 600, mb: 0.5 }}>
                    Name
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    {order.customerName}
                  </Typography>
                </Box>

                <Box sx={{ mb: 3 }}>
                  <Typography variant="body2" sx={{ fontWeight: 600, mb: 0.5 }}>
                    Address
                  </Typography>
                  <Typography
                    variant="body2"
                    color="text.secondary"
                    sx={{ whiteSpace: "pre-line" }}
                  >
                    {order.customerAddress}
                  </Typography>
                </Box>

                <Divider sx={{ my: 3 }} />

                <Box sx={{ mb: 3 }}>
                  <Typography variant="body2" sx={{ fontWeight: 600, mb: 0.5 }}>
                    Order at
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    {order.createdAt}
                  </Typography>
                </Box>

                <Box sx={{ mb: 1 }}>
                  <Typography variant="h6" sx={{ fontWeight: 700, mb: 2 }}>
                    Total
                  </Typography>
                  <Box
                    sx={{
                      display: "flex",
                      justifyContent: "space-between",
                      mb: 1,
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
                      mb: 2,
                    }}
                  >
                    <Typography variant="body2" color="text.secondary">
                      Shipping
                    </Typography>
                    <Typography variant="body2">${order.shipping}</Typography>
                  </Box>
                  <Divider sx={{ my: 2 }} />
                  <Box
                    sx={{
                      display: "flex",
                      justifyContent: "space-between",
                    }}
                  >
                    <Typography variant="h6" sx={{ fontWeight: 700 }}>
                      Total
                    </Typography>
                    <Typography variant="h6" sx={{ fontWeight: 700 }}>
                      ${order.total}
                    </Typography>
                  </Box>
                </Box>
              </Box>
            </Grid>
          </Grid>

          <Box
            sx={{
              position: "absolute",
              bottom: 16,
              right: 16,
            }}
          >
            <Button
              variant="contained"
              onClick={handleNext}
              disabled={order.currentStep >= order.totalSteps}
              sx={{
                bgcolor: "#4A90E2",
                "&:hover": { bgcolor: "#357ABD" },
                textTransform: "none",
                px: 6,
                py: 1.5,
              }}
            >
              Next
            </Button>
          </Box>
        </Box>
      </Box>
    </Paper>
  );
}
