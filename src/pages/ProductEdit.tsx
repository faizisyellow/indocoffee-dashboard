import { useState, useEffect } from "react";

import {
  Box,
  Typography,
  Paper,
  TextField,
  Button,
  Grid,
  IconButton,
  FormControl,
  Select,
  MenuItem,
} from "@mui/material";
import { X } from "lucide-react";
import { useForm } from "@tanstack/react-form";
import * as yup from "yup";
import { dataStore, type Product } from "../lib/store";
import { useNavigate, useParams } from "react-router";

const productSchema = yup.object({
  bean: yup.string().required("Bean is required"),
  roasted: yup.string().required("Roasted is required"),
  form: yup.string().required("Form is required"),
  size: yup.string().required("Size is required"),
  price: yup
    .number()
    .required("Price is required")
    .positive("Price must be positive"),
  quantity: yup
    .number()
    .required("Quantity is required")
    .min(0, "Quantity must be 0 or greater"),
});

export function ProductEdit() {
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();
  const [product, setProduct] = useState<Product | null>(null);
  const [imagePreview, setImagePreview] = useState<string>("");

  useEffect(() => {
    if (id) {
      const foundProduct = dataStore.getProduct(id);
      if (foundProduct) {
        setProduct(foundProduct);
        setImagePreview(foundProduct.image || "");
      } else {
        navigate("/inventory/products");
      }
    }
  }, [id, navigate]);

  const form = useForm({
    defaultValues: {
      bean: product?.bean || "",
      roasted: product?.roasted || "",
      form: product?.form || "",
      price: product?.price.toString() || "",
      quantity: product?.quantity.toString() || "",
      image: product?.image || "",
    },
    onSubmit: async ({ value }) => {
      if (!id) return;

      try {
        await productSchema.validate({
          bean: value.bean,
          roasted: value.roasted,
          form: value.form,
          price: Number(value.price),
          quantity: Number(value.quantity),
        });

        dataStore.updateProduct(id, {
          bean: value.bean,
          roasted: value.roasted,
          form: value.form,
          price: Number(value.price),
          quantity: Number(value.quantity),
          image: value.image,
        });

        navigate("/inventory/products");
      } catch (error) {
        console.error("Validation error:", error);
      }
    },
  });

  useEffect(() => {
    if (product) {
      form.setFieldValue("bean", product.bean);
      form.setFieldValue("roasted", product.roasted);
      form.setFieldValue("form", product.form);
      form.setFieldValue("price", product.price.toString());
      form.setFieldValue("quantity", product.quantity.toString());
      form.setFieldValue("image", product.image || "");
    }
  }, [product, form]);

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        const result = reader.result as string;
        setImagePreview(result);
        form.setFieldValue("image", result);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleRemoveImage = () => {
    setImagePreview("");
    form.setFieldValue("image", "");
  };

  if (!product) {
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
          Update Product #{id}
        </Typography>

        <Box
          sx={{
            border: "1px solid #ccc",
            borderRadius: 1,
            p: 4,
            minHeight: 500,
          }}
        >
          <form
            onSubmit={(e) => {
              e.preventDefault();
              e.stopPropagation();
              form.handleSubmit();
            }}
          >
            <Grid container spacing={3}>
              <Grid size={{ xs: 12, md: 6 }}>
                <form.Field name="bean">
                  {(field) => (
                    <Box>
                      <Typography variant="body2" sx={{ mb: 1 }}>
                        Bean
                      </Typography>
                      <FormControl fullWidth>
                        <Select
                          value={field.state.value}
                          onChange={(e) => field.handleChange(e.target.value)}
                          displayEmpty
                        >
                          <MenuItem value="Arabica">Arabica</MenuItem>
                          <MenuItem value="Robusta">Robusta</MenuItem>
                          <MenuItem value="Liberica">Liberica</MenuItem>
                          <MenuItem value="Excelsa">Excelsa</MenuItem>
                        </Select>
                      </FormControl>
                    </Box>
                  )}
                </form.Field>
              </Grid>

              <Grid size={{ xs: 12, md: 6 }}>
                <form.Field name="roasted">
                  {(field) => (
                    <Box>
                      <Typography variant="body2" sx={{ mb: 1 }}>
                        Roasted
                      </Typography>
                      <FormControl fullWidth>
                        <Select
                          value={field.state.value}
                          onChange={(e) => field.handleChange(e.target.value)}
                          displayEmpty
                        >
                          <MenuItem value="Light">Light</MenuItem>
                          <MenuItem value="Medium">Medium</MenuItem>
                          <MenuItem value="Medium-Dark">Medium-Dark</MenuItem>
                          <MenuItem value="Dark">Dark</MenuItem>
                        </Select>
                      </FormControl>
                    </Box>
                  )}
                </form.Field>
              </Grid>

              <Grid size={{ xs: 12, md: 6 }}>
                <form.Field name="form">
                  {(field) => (
                    <Box>
                      <Typography variant="body2" sx={{ mb: 1 }}>
                        Form
                      </Typography>
                      <FormControl fullWidth>
                        <Select
                          value={field.state.value}
                          onChange={(e) => field.handleChange(e.target.value)}
                          displayEmpty
                        >
                          <MenuItem value="1">Whole Bean</MenuItem>
                          <MenuItem value="2">Ground</MenuItem>
                        </Select>
                      </FormControl>
                    </Box>
                  )}
                </form.Field>
              </Grid>

              <Grid size={{ xs: 12, md: 6 }}>
                <form.Field name="price">
                  {(field) => (
                    <Box>
                      <Typography variant="body2" sx={{ mb: 1 }}>
                        Price
                      </Typography>
                      <TextField
                        fullWidth
                        type="number"
                        value={field.state.value}
                        onChange={(e) => field.handleChange(e.target.value)}
                        placeholder="Enter price"
                      />
                    </Box>
                  )}
                </form.Field>
              </Grid>

              <Grid size={{ xs: 12, md: 6 }}>
                <form.Field name="quantity">
                  {(field) => (
                    <Box>
                      <Typography variant="body2" sx={{ mb: 1 }}>
                        Quantity
                      </Typography>
                      <TextField
                        fullWidth
                        type="number"
                        value={field.state.value}
                        onChange={(e) => field.handleChange(e.target.value)}
                        placeholder="Enter quantity"
                      />
                    </Box>
                  )}
                </form.Field>
              </Grid>

              <Grid size={{ xs: 12 }}>
                <Box
                  sx={{
                    border: "1px solid #ccc",
                    borderRadius: 1,
                    height: 300,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    bgcolor: "#f5f5f5",
                    position: "relative",
                    cursor: "pointer",
                  }}
                  onClick={() =>
                    !imagePreview &&
                    document.getElementById("image-upload")?.click()
                  }
                >
                  {imagePreview && (
                    <IconButton
                      onClick={(e) => {
                        e.stopPropagation();
                        handleRemoveImage();
                      }}
                      sx={{
                        position: "absolute",
                        top: 8,
                        right: 8,
                        bgcolor: "white",
                        "&:hover": { bgcolor: "#f5f5f5" },
                      }}
                    >
                      <X size={20} />
                    </IconButton>
                  )}
                  {imagePreview ? (
                    <Box sx={{ width: "100%", height: "100%", p: 2 }}>
                      <img
                        src={imagePreview}
                        alt="Preview"
                        style={{
                          width: "100%",
                          height: "100%",
                          objectFit: "contain",
                        }}
                      />
                      <Typography
                        variant="h6"
                        sx={{ textAlign: "center", mt: 2 }}
                      >
                        Image
                      </Typography>
                    </Box>
                  ) : (
                    <Typography variant="h6" color="text.secondary">
                      Upload Image
                    </Typography>
                  )}
                  <input
                    id="image-upload"
                    type="file"
                    accept="image/*"
                    style={{ display: "none" }}
                    onChange={handleImageUpload}
                  />
                </Box>
              </Grid>
            </Grid>

            <Box sx={{ display: "flex", justifyContent: "flex-end", mt: 4 }}>
              <Button
                type="submit"
                variant="contained"
                sx={{
                  bgcolor: "#4A90E2",
                  "&:hover": { bgcolor: "#357ABD" },
                  px: 6,
                  py: 1.5,
                  textTransform: "none",
                  fontSize: "1rem",
                }}
              >
                Save
              </Button>
            </Box>
          </form>
        </Box>
      </Box>
    </Paper>
  );
}
