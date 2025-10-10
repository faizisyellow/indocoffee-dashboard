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
  Accordion,
  AccordionSummary,
  AccordionDetails,
  CircularProgress,
  Alert,
} from "@mui/material";
import { useNavigate } from "react-router";
import { ArrowUpDown, ChevronDown, Filter } from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import { inventoryService } from "../lib/service/inventory";

export function ProductsList() {
  const navigate = useNavigate();
  const [sortBy, setSortBy] = useState<string>("asc");
  const [filterDrawerOpen, setFilterDrawerOpen] = useState<boolean>(false);

  const {
    isPending,
    isError,
    data: products,
    error,
  } = useQuery({
    queryKey: ["products"],
    queryFn: inventoryService.GetProducts.bind(inventoryService),
  });

  function handleSortToggle() {
    setSortBy(sortBy === "asc" ? "desc" : "asc");
  }

  return (
    <Paper elevation={0} sx={{ borderRadius: 2, overflow: "hidden" }}>
      <Box sx={{ p: 4 }}>
        <Box
          sx={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            mb: 4,
          }}
        >
          <Typography variant="h5" sx={{ fontWeight: 600 }}>
            List all Products
          </Typography>

          <Button
            variant="contained"
            onClick={() => navigate("/inventory/products/create")}
            sx={{
              bgcolor: "#4A90E2",
              "&:hover": { bgcolor: "#357ABD" },
              textTransform: "none",
              px: 4,
              borderRadius: 1,
            }}
          >
            Add product
          </Button>
        </Box>

        <Box
          sx={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            mb: 3,
            position: "relative",
          }}
        >
          <Box sx={{ position: "relative" }}>
            <Button
              variant="outlined"
              onClick={() => setFilterDrawerOpen(!filterDrawerOpen)}
              sx={{
                textTransform: "none",
                borderRadius: 2,
                px: 2.5,
                py: 1,
                borderColor: "divider",
                bgcolor: filterDrawerOpen ? "action.hover" : "background.paper",
                boxShadow: filterDrawerOpen ? 2 : 0,
                display: "flex",
                alignItems: "center",
                gap: 1,
              }}
            >
              <Filter size={18} strokeWidth={1.8} />
              Filters
            </Button>

            {filterDrawerOpen && (
              <Paper
                elevation={6}
                sx={{
                  position: "absolute",
                  top: "calc(100% + 8px)",
                  left: 0,
                  width: 340,
                  maxHeight: 500,
                  overflow: "auto",
                  zIndex: 1000,
                  borderRadius: 3,
                  border: "1px solid",
                  borderColor: "divider",
                  backdropFilter: "blur(8px)",
                }}
              >
                <Box sx={{ p: 3 }}>
                  <Box
                    sx={{
                      display: "flex",
                      justifyContent: "space-between",
                      alignItems: "center",
                      mb: 3,
                    }}
                  >
                    <Typography variant="h6" sx={{ fontWeight: 600 }}>
                      Filters
                    </Typography>
                    <Button
                      onClick={() => setFilterDrawerOpen(false)}
                      sx={{
                        minWidth: "auto",
                        color: "text.secondary",
                        fontSize: 18,
                      }}
                    >
                      ✕
                    </Button>
                  </Box>

                  {["Bean", "Form", "Roasted"].map((title) => (
                    <Accordion
                      key={title}
                      defaultExpanded
                      disableGutters
                      elevation={0}
                    >
                      <AccordionSummary expandIcon={<ChevronDown size={16} />}>
                        <Typography sx={{ fontWeight: 600 }}>
                          {title}
                        </Typography>
                      </AccordionSummary>
                      <AccordionDetails>
                        <Typography variant="body2" color="text.secondary">
                          Coming soon...
                        </Typography>
                      </AccordionDetails>
                    </Accordion>
                  ))}
                </Box>
              </Paper>
            )}
          </Box>

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
            Sort by Date: {sortBy === "asc" ? "Oldest" : "Newest"}
          </Button>
        </Box>

        {/* Table */}
        <Box
          sx={{
            border: "1px solid",
            borderColor: "divider",
            borderRadius: 2,
            minHeight: 500,
            overflow: "hidden",
            position: "relative",
          }}
        >
          {isPending && (
            <Box
              sx={{
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
                minHeight: 500,
              }}
            >
              <CircularProgress />
            </Box>
          )}

          {isError && (
            <Box sx={{ p: 4 }}>
              <Alert severity="error">
                Error loading products: {error?.message || "Unknown error"}
              </Alert>
            </Box>
          )}

          {!isPending && !isError && products && (
            <TableContainer>
              <Table>
                <TableHead>
                  <TableRow sx={{ bgcolor: "grey.50" }}>
                    <TableCell sx={{ fontWeight: 600 }}>No</TableCell>
                    <TableCell sx={{ fontWeight: 600 }}>Cover</TableCell>
                    <TableCell sx={{ fontWeight: 600 }}>Bean</TableCell>
                    <TableCell sx={{ fontWeight: 600 }}>Roasted</TableCell>
                    <TableCell sx={{ fontWeight: 600 }}>Form</TableCell>
                    <TableCell sx={{ fontWeight: 600 }}>Price</TableCell>
                    <TableCell sx={{ fontWeight: 600 }}>Quantity</TableCell>
                    <TableCell sx={{ fontWeight: 600 }}>Actions</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {products.length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={8} align="center" sx={{ py: 8 }}>
                        <Typography variant="body1" color="text.secondary">
                          No products found
                        </Typography>
                      </TableCell>
                    </TableRow>
                  ) : (
                    products.map((product, index) => (
                      <TableRow
                        key={product.id}
                        hover
                        sx={{
                          transition: "background-color 0.2s ease",
                          "&:hover": { bgcolor: "action.hover" },
                        }}
                      >
                        <TableCell>{index + 1}</TableCell>
                        <TableCell>
                          <Box
                            sx={{
                              width: 60,
                              height: 60,
                              borderRadius: 2,
                              overflow: "hidden",
                              bgcolor: "grey.100",
                              display: "flex",
                              alignItems: "center",
                              justifyContent: "center",
                            }}
                          >
                            {product.image ? (
                              <img
                                src={product.image}
                                alt={product.bean?.name}
                                style={{
                                  width: "100%",
                                  height: "100%",
                                  objectFit: "cover",
                                }}
                              />
                            ) : (
                              <Typography
                                variant="caption"
                                color="text.secondary"
                              >
                                No Image
                              </Typography>
                            )}
                          </Box>
                        </TableCell>
                        <TableCell>{product.bean?.name}</TableCell>
                        <TableCell>{product.roasted}</TableCell>
                        <TableCell>{product.form?.name}</TableCell>
                        <TableCell>${product.price.toFixed(2)}</TableCell>
                        <TableCell>{product.quantity}</TableCell>
                        <TableCell>
                          <Box sx={{ display: "flex", gap: 1 }}>
                            <Button
                              onClick={() =>
                                window.confirm("Delete this product?")
                              }
                              sx={{
                                color: "error.main",
                                textTransform: "none",
                                "&:hover": { bgcolor: "error.lighter" },
                              }}
                            >
                              Delete
                            </Button>
                            <Button
                              onClick={() =>
                                navigate(
                                  `/inventory/products/edit/${product.id}`,
                                )
                              }
                              sx={{
                                color: "primary.main",
                                textTransform: "none",
                                "&:hover": { bgcolor: "primary.lighter" },
                              }}
                            >
                              Edit
                            </Button>
                          </Box>
                        </TableCell>
                      </TableRow>
                    ))
                  )}
                </TableBody>
              </Table>
            </TableContainer>
          )}
        </Box>
      </Box>
    </Paper>
  );
}
