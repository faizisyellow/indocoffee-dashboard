import { useState } from "react";
import {
  Box,
  Typography,
  Paper,
  Button,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
} from "@mui/material";
import { dataStore, type Product } from "../lib/store";
import { useNavigate } from "react-router";

export function ProductsList() {
  const navigate = useNavigate();
  const [products, setProducts] = useState<Product[]>(dataStore.getProducts());

  const handleDelete = (id: string) => {
    dataStore.deleteProduct(id);
    setProducts(dataStore.getProducts());
  };

  const handleEdit = (id: string) => {
    navigate(`/inventory/products/edit/${id}`);
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
          List all Products
        </Typography>

        <Box
          sx={{
            border: "1px solid #ccc",
            borderRadius: 1,
            minHeight: 500,
            position: "relative",
          }}
        >
          <TableContainer>
            <Table>
              <TableHead>
                <TableRow sx={{ bgcolor: "#f5f5f5" }}>
                  <TableCell sx={{ fontWeight: 600 }}>No</TableCell>
                  <TableCell sx={{ fontWeight: 600 }}>Cover</TableCell>
                  <TableCell sx={{ fontWeight: 600 }}>Bean</TableCell>
                  <TableCell sx={{ fontWeight: 600 }}>Roasted</TableCell>
                  <TableCell sx={{ fontWeight: 600 }}>Form</TableCell>
                  <TableCell sx={{ fontWeight: 600 }}>Price</TableCell>
                  <TableCell sx={{ fontWeight: 600 }}>Quantity</TableCell>
                  <TableCell sx={{ fontWeight: 600 }}></TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {products.map((product, index) => (
                  <TableRow key={product.id}>
                    <TableCell>{index + 1}</TableCell>
                    <TableCell>
                      <Box
                        sx={{
                          width: 60,
                          height: 60,
                          border: "1px solid #ccc",
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center",
                          bgcolor: "#f5f5f5",
                          borderRadius: 1,
                        }}
                      >
                        {product.image ? (
                          <img
                            src={product.image}
                            alt={product.bean}
                            style={{
                              width: "100%",
                              height: "100%",
                              objectFit: "cover",
                            }}
                          />
                        ) : (
                          <Typography variant="caption">IMG</Typography>
                        )}
                      </Box>
                    </TableCell>
                    <TableCell>{product.bean}</TableCell>
                    <TableCell>{product.roasted}</TableCell>
                    <TableCell>{product.form}</TableCell>
                    <TableCell>${product.price}</TableCell>
                    <TableCell>{product.quantity}</TableCell>
                    <TableCell>
                      <Box sx={{ display: "flex", gap: 1 }}>
                        <Button
                          onClick={() => handleDelete(product.id)}
                          sx={{
                            color: "text.secondary",
                            textTransform: "none",
                          }}
                        >
                          delete
                        </Button>
                        <Button
                          onClick={() => handleEdit(product.id)}
                          sx={{
                            color: "text.secondary",
                            textTransform: "none",
                          }}
                        >
                          edit
                        </Button>
                      </Box>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>

          <Box
            sx={{
              position: "absolute",
              bottom: 16,
              right: 16,
            }}
          >
            <Button
              variant="contained"
              onClick={() => navigate("/inventory/products/create")}
              sx={{
                bgcolor: "#4A90E2",
                "&:hover": { bgcolor: "#357ABD" },
                textTransform: "none",
                px: 4,
              }}
            >
              Add product
            </Button>
          </Box>
        </Box>
      </Box>
    </Paper>
  );
}
