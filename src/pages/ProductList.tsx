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
  Select,
  MenuItem,
  FormControl,
  Checkbox,
  FormControlLabel,
  Accordion,
  AccordionSummary,
  AccordionDetails,
} from "@mui/material";
import { dataStore, type Product } from "../lib/store";
import { useNavigate } from "react-router";
import { ChevronDown, Filter } from "lucide-react";

export function ProductsList() {
  const navigate = useNavigate();
  const [products, setProducts] = useState<Product[]>(dataStore.getProducts());
  const [selectedBeans, setSelectedBeans] = useState<string[]>([]);
  const [selectedForms, setSelectedForms] = useState<string[]>([]);
  const [selectedRoasted, setSelectedRoasted] = useState<string[]>([]);
  const [sortBy, setSortBy] = useState<string>("");
  const [filterDrawerOpen, setFilterDrawerOpen] = useState<boolean>(false);

  const handleDelete = (id: string) => {
    dataStore.deleteProduct(id);
    setProducts(dataStore.getProducts());
  };

  const handleEdit = (id: string) => {
    navigate(`/inventory/products/edit/${id}`);
  };

  const getFilteredAndSortedProducts = () => {
    let filtered = [...products];
    if (selectedBeans.length > 0) {
      filtered = filtered.filter((p) => selectedBeans.includes(p.bean));
    }
    if (selectedForms.length > 0) {
      filtered = filtered.filter((p) => selectedForms.includes(p.form));
    }
    if (selectedRoasted.length > 0) {
      filtered = filtered.filter((p) => selectedRoasted.includes(p.roasted));
    }

    if (sortBy === "price-asc") filtered.sort((a, b) => a.price - b.price);
    else if (sortBy === "price-desc")
      filtered.sort((a, b) => b.price - a.price);
    else if (sortBy === "quantity-asc")
      filtered.sort((a, b) => a.quantity - b.quantity);
    else if (sortBy === "quantity-desc")
      filtered.sort((a, b) => b.quantity - a.quantity);
    else if (sortBy === "bean")
      filtered.sort((a, b) => a.bean.localeCompare(b.bean));

    return filtered;
  };

  const displayedProducts = getFilteredAndSortedProducts();

  const uniqueBeans = Array.from(new Set(products.map((p) => p.bean))).filter(
    Boolean,
  );
  const uniqueForms = Array.from(new Set(products.map((p) => p.form))).filter(
    Boolean,
  );
  const uniqueRoasted = Array.from(
    new Set(products.map((p) => p.roasted)),
  ).filter(Boolean);

  const handleBeanToggle = (bean: string) => {
    setSelectedBeans((prev) =>
      prev.includes(bean) ? prev.filter((b) => b !== bean) : [...prev, bean],
    );
  };

  const handleFormToggle = (form: string) => {
    setSelectedForms((prev) =>
      prev.includes(form) ? prev.filter((f) => f !== form) : [...prev, form],
    );
  };

  const handleRoastedToggle = (roasted: string) => {
    setSelectedRoasted((prev) =>
      prev.includes(roasted)
        ? prev.filter((r) => r !== roasted)
        : [...prev, roasted],
    );
  };

  return (
    <Paper
      elevation={0}
      sx={{
        borderRadius: 2,
        overflow: "hidden",
      }}
    >
      <Box sx={{ p: 4 }}>
        <Typography variant="h5" sx={{ fontWeight: 600, mb: 4 }}>
          List all Products
        </Typography>

        {/* Filter and Sort Row */}
        <Box
          sx={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            mb: 3,
            position: "relative",
          }}
        >
          {/* Filter Button */}
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
              <Filter size={18} strokeWidth={1.8} /> Filters
            </Button>

            {/* Filter Panel */}
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

                  {/* Bean Filter */}
                  <Accordion
                    defaultExpanded
                    disableGutters
                    elevation={0}
                    sx={{
                      "&:before": { display: "none" },
                      borderBottom: "1px solid",
                      borderColor: "divider",
                    }}
                  >
                    <AccordionSummary expandIcon={<ChevronDown size={16} />}>
                      <Typography sx={{ fontWeight: 600 }}>Bean</Typography>
                    </AccordionSummary>
                    <AccordionDetails>
                      <Box
                        sx={{
                          display: "flex",
                          flexDirection: "column",
                          gap: 1,
                        }}
                      >
                        {uniqueBeans.map((bean) => (
                          <FormControlLabel
                            key={bean}
                            control={
                              <Checkbox
                                checked={selectedBeans.includes(bean)}
                                onChange={() => handleBeanToggle(bean)}
                                size="small"
                              />
                            }
                            label={bean}
                          />
                        ))}
                      </Box>
                    </AccordionDetails>
                  </Accordion>

                  {/* Form Filter */}
                  <Accordion
                    defaultExpanded
                    disableGutters
                    elevation={0}
                    sx={{
                      "&:before": { display: "none" },
                      borderBottom: "1px solid",
                      borderColor: "divider",
                    }}
                  >
                    <AccordionSummary expandIcon={<ChevronDown size={16} />}>
                      <Typography sx={{ fontWeight: 600 }}>Form</Typography>
                    </AccordionSummary>
                    <AccordionDetails>
                      <Box
                        sx={{
                          display: "flex",
                          flexDirection: "column",
                          gap: 1,
                        }}
                      >
                        {uniqueForms.map((form) => (
                          <FormControlLabel
                            key={form}
                            control={
                              <Checkbox
                                checked={selectedForms.includes(form)}
                                onChange={() => handleFormToggle(form)}
                                size="small"
                              />
                            }
                            label={form}
                          />
                        ))}
                      </Box>
                    </AccordionDetails>
                  </Accordion>

                  {/* Roasted Filter */}
                  <Accordion
                    defaultExpanded
                    disableGutters
                    elevation={0}
                    sx={{
                      "&:before": { display: "none" },
                    }}
                  >
                    <AccordionSummary expandIcon={<ChevronDown size={16} />}>
                      <Typography sx={{ fontWeight: 600 }}>Roasted</Typography>
                    </AccordionSummary>
                    <AccordionDetails>
                      <Box
                        sx={{
                          display: "flex",
                          flexDirection: "column",
                          gap: 1,
                        }}
                      >
                        {uniqueRoasted.map((roasted) => (
                          <FormControlLabel
                            key={roasted}
                            control={
                              <Checkbox
                                checked={selectedRoasted.includes(roasted)}
                                onChange={() => handleRoastedToggle(roasted)}
                                size="small"
                              />
                            }
                            label={roasted}
                          />
                        ))}
                      </Box>
                    </AccordionDetails>
                  </Accordion>
                </Box>
              </Paper>
            )}
          </Box>

          {/* Sort Dropdown */}
          <FormControl sx={{ minWidth: 200 }}>
            <Select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              displayEmpty
              size="small"
              sx={{
                borderRadius: 2,
                bgcolor: "background.paper",
              }}
            >
              <MenuItem value="">
                <em>Sort by</em>
              </MenuItem>
              <MenuItem value="price-asc">Price: Low to High</MenuItem>
              <MenuItem value="price-desc">Price: High to Low</MenuItem>
              <MenuItem value="quantity-asc">Quantity: Low to High</MenuItem>
              <MenuItem value="quantity-desc">Quantity: High to Low</MenuItem>
              <MenuItem value="bean">Bean: A to Z</MenuItem>
            </Select>
          </FormControl>
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
                  <TableCell sx={{ fontWeight: 600 }}></TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {displayedProducts.map((product, index) => (
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
                          Delete
                        </Button>
                        <Button
                          onClick={() => handleEdit(product.id)}
                          sx={{
                            color: "text.secondary",
                            textTransform: "none",
                          }}
                        >
                          Edit
                        </Button>
                      </Box>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>

          <Box sx={{ position: "absolute", bottom: 16, right: 16 }}>
            <Button
              variant="contained"
              onClick={() => navigate("/inventory/products/create")}
              sx={{
                bgcolor: "#4A90E2",
                "&:hover": { bgcolor: "#357ABD" },
                textTransform: "none",
                px: 4,
                borderRadius: 2,
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
