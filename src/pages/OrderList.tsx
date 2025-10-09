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
} from "@mui/material";
import { dataStore, type Order } from "../lib/store";
import { useNavigate } from "react-router";
import { ArrowUpDown } from "lucide-react";

export function OrdersList() {
  const navigate = useNavigate();
  const [orders] = useState<Order[]>(dataStore.getOrders());

  const [selectedStatus, setSelectedStatus] = useState<string | null>(null);
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">("desc");

  const handleRowClick = (orderId: string) => {
    navigate(`/orders/${orderId}`);
  };

  const statusOptions = ["Pending", "Processing", "Shipped", "Completed"];

  const handleFilterChange = (status: string) => {
    setSelectedStatus(selectedStatus === status ? null : status);
  };

  const handleSortToggle = () => {
    setSortOrder(sortOrder === "asc" ? "desc" : "asc");
  };

  const filteredOrders = useMemo(() => {
    let result = [...orders];

    if (selectedStatus) {
      result = result.filter(
        (order) => order.status.toLowerCase() === selectedStatus.toLowerCase(),
      );
    }

    result.sort((a, b) => {
      const dateA = new Date(a.createdAt).getTime();
      const dateB = new Date(b.createdAt).getTime();
      return sortOrder === "asc" ? dateA - dateB : dateB - dateA;
    });

    return result;
  }, [orders, selectedStatus, sortOrder]);

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
                {filteredOrders.map((order, index) => (
                  <TableRow
                    key={order.id}
                    onClick={() => handleRowClick(order.id)}
                    sx={{
                      cursor: "pointer",
                      "&:hover": { bgcolor: "#f5f5f5" },
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
