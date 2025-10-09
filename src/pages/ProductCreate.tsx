import { useState } from "react";
import { Box, Typography, Paper, TextField, Button, Grid } from "@mui/material";
import { useForm } from "@tanstack/react-form";
import * as yup from "yup";
import { dataStore } from "../lib/store";
import { useNavigate } from "react-router";

const productSchema = yup.object({
  bean: yup.string().required("Bean is required"),
  roasted: yup.string().required("Roasted is required"),
  form: yup.string().required("Form is required"),
  image: yup.string().required("Image is required"),
  price: yup
    .number()
    .required("Price is required")
    .positive("Price must be positive"),
  quantity: yup
    .number()
    .required("Quantity is required")
    .min(0, "Quantity must be 0 or greater"),
});

export function ProductCreate() {
  const navigate = useNavigate();
  const [imagePreview, setImagePreview] = useState<string>("");
  const [errors, setErrors] = useState<Record<string, string>>({});

  const form = useForm({
    defaultValues: {
      bean: "",
      roasted: "",
      form: "",
      price: "",
      quantity: "",
      image: "",
    },
    onSubmit: async ({ value }) => {
      try {
        await productSchema.validate(
          {
            bean: value.bean,
            roasted: value.roasted,
            form: value.form,
            image: value.image,
            price: value.price === "" ? undefined : Number(value.price),
            quantity:
              value.quantity === "" ? undefined : Number(value.quantity),
          },
          { abortEarly: false },
        );

        setErrors({});

        dataStore.addProduct({
          bean: value.bean,
          roasted: value.roasted,
          form: value.form,
          price: Number(value.price),
          quantity: Number(value.quantity),
          image: value.image,
        });

        navigate("/inventory/products");
      } catch (error) {
        if (error instanceof yup.ValidationError) {
          const validationErrors: Record<string, string> = {};
          error.inner.forEach((err) => {
            if (err.path) {
              validationErrors[err.path] = err.message;
            }
          });
          setErrors(validationErrors);
        }
      }
    },
  });

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
          Add New Products
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
                      <TextField
                        fullWidth
                        value={field.state.value}
                        onChange={(e) => field.handleChange(e.target.value)}
                        placeholder="Enter bean type"
                        error={!!errors.bean}
                      />
                      {errors.bean && (
                        <Typography
                          variant="caption"
                          color="error"
                          sx={{ mt: 0.5, display: "block" }}
                        >
                          {errors.bean}
                        </Typography>
                      )}
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
                      <TextField
                        fullWidth
                        value={field.state.value}
                        onChange={(e) => field.handleChange(e.target.value)}
                        placeholder="Enter roast level"
                        error={!!errors.roasted}
                      />
                      {errors.roasted && (
                        <Typography
                          variant="caption"
                          color="error"
                          sx={{ mt: 0.5, display: "block" }}
                        >
                          {errors.roasted}
                        </Typography>
                      )}
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
                      <TextField
                        fullWidth
                        value={field.state.value}
                        onChange={(e) => field.handleChange(e.target.value)}
                        placeholder="Enter form"
                        error={!!errors.form}
                      />
                      {errors.form && (
                        <Typography
                          variant="caption"
                          color="error"
                          sx={{ mt: 0.5, display: "block" }}
                        >
                          {errors.form}
                        </Typography>
                      )}
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
                        error={!!errors.price}
                      />
                      {errors.price && (
                        <Typography
                          variant="caption"
                          color="error"
                          sx={{ mt: 0.5, display: "block" }}
                        >
                          {errors.price}
                        </Typography>
                      )}
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
                        error={!!errors.quantity}
                      />
                      {errors.quantity && (
                        <Typography
                          variant="caption"
                          color="error"
                          sx={{ mt: 0.5, display: "block" }}
                        >
                          {errors.quantity}
                        </Typography>
                      )}
                    </Box>
                  )}
                </form.Field>
              </Grid>

              <Grid size={{ xs: 12 }}>
                <Box>
                  <Box
                    sx={{
                      border: errors.image
                        ? "1px solid #d32f2f"
                        : "1px solid #ccc",
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
                      document.getElementById("image-upload")?.click()
                    }
                  >
                    {imagePreview ? (
                      <img
                        src={imagePreview}
                        alt="Preview"
                        style={{
                          maxWidth: "100%",
                          maxHeight: "100%",
                          objectFit: "contain",
                        }}
                      />
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
                  {errors.image && (
                    <Typography
                      variant="caption"
                      color="error"
                      sx={{ mt: 0.5, display: "block" }}
                    >
                      {errors.image}
                    </Typography>
                  )}
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
                Add
              </Button>
            </Box>
          </form>
        </Box>
      </Box>
    </Paper>
  );
}
