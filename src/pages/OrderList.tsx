import { useState } from "react";
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
} from "@mui/material";
import { dataStore, type Order } from "../lib/store";
import { useNavigate } from "react-router";

export function OrdersList() {
  const navigate = useNavigate();
  const [orders] = useState<Order[]>(dataStore.getOrders());

  const handleRowClick = (orderId: string) => {
    navigate(`/orders/${orderId}`);
  };

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
          List all Orders
        </Typography>

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
                  <TableCell sx={{ fontWeight: 600 }}>Order ID</TableCell>
                  <TableCell sx={{ fontWeight: 600 }}>Products</TableCell>
                  <TableCell sx={{ fontWeight: 600 }}>Total Price</TableCell>
                  <TableCell sx={{ fontWeight: 600 }}>Status</TableCell>
                  <TableCell sx={{ fontWeight: 600 }}>Order At</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {orders.map((order, index) => (
                  <TableRow
                    key={order.id}
                    onClick={() => handleRowClick(order.id)}
                    sx={{
                      cursor: "pointer",
                      "&:hover": {
                        bgcolor: "#f5f5f5",
                      },
                    }}
                  >
                    <TableCell>{index + 1}</TableCell>
                    <TableCell>{order.orderId}</TableCell>
                    <TableCell>{order.items.length}</TableCell>
                    <TableCell>${order.total}</TableCell>
                    <TableCell>
                      <Chip
                        label={order.status}
                        variant="outlined"
                        sx={{
                          borderRadius: 1,
                          fontWeight: 500,
                        }}
                      />
                    </TableCell>
                    <TableCell>{order.createdAt}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        </Box>
      </Box>
    </Paper>
  );
}
