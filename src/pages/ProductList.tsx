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
  Radio,
  FormControlLabel,
  capitalize,
} from "@mui/material";
import { useNavigate } from "react-router";
import { ArrowUpDown, ChevronDown, Filter } from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import { inventoryService } from "../lib/service/inventory";

export function ProductsList() {
  const navigate = useNavigate();
  const [sortBy, setSortBy] = useState<"asc" | "desc">("asc");
  const [filterDrawerOpen, setFilterDrawerOpen] = useState<boolean>(false);
  const [selectedBean, setSelectedBean] = useState<string>("");
  const [selectedForm, setSelectedForm] = useState<string>("");
  const [selectedRoasted, setSelectedRoasted] = useState<string>("");
  const [page, setPage] = useState<number>(1);
  const [limit] = useState<number>(2);

  const {
    isPending,
    isError,
    data: productsResponse,
    error,
  } = useQuery({
    queryKey: [
      "products",
      selectedBean,
      selectedForm,
      selectedRoasted,
      sortBy,
      page,
      limit,
    ],
    queryFn: () => {
      const offset = (page - 1) * limit;
      return inventoryService.GetProducts(
        selectedBean,
        selectedForm,
        selectedRoasted,
        sortBy,
        offset,
        limit,
      );
    },
  });

  const resultGetBeans = useQuery({
    queryKey: ["beans"],
    queryFn: inventoryService.GetBeans.bind(inventoryService),
  });

  const resultGetForms = useQuery({
    queryKey: ["forms"],
    queryFn: inventoryService.GetForms.bind(inventoryService),
  });

  const products = productsResponse || [];
  const isLastPage = products.length < limit;

  function handleSortToggle() {
    setSortBy(sortBy === "asc" ? "desc" : "asc");
    setPage(1);
  }

  function handleBeanToggle(beanId: string) {
    setSelectedBean(selectedBean === beanId ? "" : beanId);
    setPage(1);
  }

  function handleFormToggle(formId: string) {
    setSelectedForm(selectedForm === formId ? "" : formId);
    setPage(1);
  }

  function handleRoastedToggle(roasted: string) {
    setSelectedRoasted(selectedRoasted === roasted ? "" : roasted);
    setPage(1);
  }

  function handleClearFilters() {
    setSelectedBean("");
    setSelectedForm("");
    setSelectedRoasted("");
    setPage(1);
  }

  function handlePageChange(newPage: number) {
    setPage(newPage);
    window.scrollTo({ top: 0, behavior: "smooth" });
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
                    <Box sx={{ display: "flex", gap: 1 }}>
                      <Button
                        onClick={handleClearFilters}
                        size="small"
                        sx={{
                          textTransform: "none",
                          color: "text.secondary",
                          fontSize: 13,
                        }}
                      >
                        Clear all
                      </Button>
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
                        {title === "Bean" ? (
                          <Box
                            sx={{ display: "flex", flexDirection: "column" }}
                          >
                            {resultGetBeans.data?.map((bean) => (
                              <FormControlLabel
                                key={bean.id}
                                control={
                                  <Radio
                                    checked={selectedBean === bean.id}
                                    onChange={() => handleBeanToggle(bean.id)}
                                    size="small"
                                  />
                                }
                                label={capitalize(bean.name)}
                                sx={{ mb: 0.5 }}
                              />
                            ))}
                          </Box>
                        ) : title === "Form" ? (
                          <Box
                            sx={{ display: "flex", flexDirection: "column" }}
                          >
                            {resultGetForms.data?.map((form) => (
                              <FormControlLabel
                                key={form.id}
                                control={
                                  <Radio
                                    checked={selectedForm === form.id}
                                    onChange={() => handleFormToggle(form.id)}
                                    size="small"
                                  />
                                }
                                label={capitalize(form.name)}
                                sx={{ mb: 0.5 }}
                              />
                            ))}
                          </Box>
                        ) : (
                          <Box
                            sx={{ display: "flex", flexDirection: "column" }}
                          >
                            {["light", "medium", "dark"].map((roasted) => (
                              <FormControlLabel
                                key={roasted}
                                control={
                                  <Radio
                                    checked={selectedRoasted === roasted}
                                    onChange={() =>
                                      handleRoastedToggle(roasted)
                                    }
                                    size="small"
                                  />
                                }
                                label={capitalize(roasted)}
                                sx={{ mb: 0.5 }}
                              />
                            ))}
                          </Box>
                        )}
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
                      <TableCell
                        colSpan={8}
                        rowSpan={10}
                        align="center"
                        sx={{ py: 8 }}
                      >
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
                        <TableCell>{(page - 1) * limit + index + 1}</TableCell>
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
                        <TableCell>{capitalize(product.bean.name)}</TableCell>
                        <TableCell>{capitalize(product.roasted)}</TableCell>
                        <TableCell>{capitalize(product.form.name)}</TableCell>
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

        {!isPending && !isError && (
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
              Page {page} • Showing {products.length} items
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
        )}
      </Box>
    </Paper>
  );
}
