import { useState } from "react";
import {
  Box,
  Typography,
  Paper,
  TextField,
  Button,
  Grid,
  Select,
  MenuItem,
  FormControl,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogContentText,
  DialogActions,
  Alert,
  capitalize,
} from "@mui/material";
import { useForm } from "@tanstack/react-form";
import { useMutation, useQuery } from "@tanstack/react-query";
import { AxiosError } from "axios";
import * as yup from "yup";
import { useNavigate } from "react-router";
import { inventoryService } from "../lib/service/inventory";
import type { CreateProductResponse } from "../lib/service/response/inventory";

const productSchema = yup.object({
  bean: yup.number().required("Bean is required"),
  roasted: yup.string().required("Roasted is required"),
  form: yup.number().required("Form is required"),
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

interface ProductFormData {
  bean: number;
  roasted: string;
  form: number;
  price: number;
  quantity: number;
  image: string;
}

export function ProductCreate() {
  const navigate = useNavigate();
  const [imagePreview, setImagePreview] = useState<string>("");
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [openDialog, setOpenDialog] = useState(false);
  const [data, setData] = useState<ProductFormData | null>(null);

  const resultGetBeans = useQuery({
    queryKey: ["beans"],
    queryFn: inventoryService.GetBeans.bind(inventoryService),
  });

  const resultGetForms = useQuery({
    queryKey: ["forms"],
    queryFn: inventoryService.GetForms.bind(inventoryService),
  });

  const mutation = useMutation({
    mutationFn: inventoryService.createProduct.bind(inventoryService),
    onSuccess: () => {
      navigate("/inventory/products");
    },
  });

  const getErrorMessage = (): string => {
    const error = mutation.error as AxiosError<CreateProductResponse>;

    if (!error.response) {
      if (error.message === "Network Error" || error.code === "ERR_NETWORK") {
        return "Unable to reach the server. Please check your internet connection and try again.";
      }
      return "A network issue occurred. Please try again.";
    }

    const status = error.response.status;

    switch (status) {
      case 400:
        return "Invalid request. Please check your input and try again.";

      case 401:
        return "You are not authorized to perform this action. Please log in again.";

      case 403:
        return "You don't have permission to create products.";

      case 409:
        return "A product with similar details already exists.";

      case 500:
        return "Our server is having trouble right now. Please try again later.";

      default:
        if (status >= 500) {
          return "Our server is having trouble right now. Please try again later.";
        }
        return "An unexpected error occurred. Please try again.";
    }
  };

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
            bean: value.bean === "" ? undefined : Number(value.bean),
            roasted: value.roasted,
            form: value.form === "" ? undefined : Number(value.form),
            image: value.image,
            price: value.price === "" ? undefined : Number(value.price),
            quantity:
              value.quantity === "" ? undefined : Number(value.quantity),
          },
          { abortEarly: false },
        );

        setErrors({});

        setData({
          bean: Number(value.bean),
          roasted: value.roasted,
          form: Number(value.form),
          price: Number(value.price),
          quantity: Number(value.quantity),
          image: value.image,
        });
        setOpenDialog(true);
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
      setImageFile(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        const result = reader.result as string;
        setImagePreview(result);
        form.setFieldValue("image", result);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleDialogClose = () => {
    setOpenDialog(false);
    setData(null);
  };

  const handleDialogConfirm = () => {
    if (data) {
      const formData = new FormData();

      if (imageFile) {
        formData.append("file", imageFile);
      }

      const metadata = {
        bean: data.bean,
        roasted: data.roasted,
        form: data.form,
        price: data.price,
        quantity: data.quantity,
      };
      formData.append("metadata", JSON.stringify(metadata));

      mutation.mutate(formData);
      setOpenDialog(false);
    }
  };

  return (
    <>
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

          {mutation.error && (
            <Alert severity="error" sx={{ mb: 3 }}>
              {getErrorMessage()}
            </Alert>
          )}

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
                        <FormControl fullWidth error={!!errors.bean}>
                          <Select
                            value={field.state.value}
                            onChange={(e) => field.handleChange(e.target.value)}
                            displayEmpty
                            disabled={resultGetBeans.isLoading}
                          >
                            <MenuItem value="" disabled>
                              {resultGetBeans.isLoading
                                ? "Loading..."
                                : "Select bean type"}
                            </MenuItem>
                            {resultGetBeans?.data?.map((bean) => (
                              <MenuItem key={bean.id} value={bean.id}>
                                {capitalize(bean.name)}
                              </MenuItem>
                            ))}
                          </Select>
                        </FormControl>
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
                        <FormControl fullWidth error={!!errors.roasted}>
                          <Select
                            value={field.state.value}
                            onChange={(e) => field.handleChange(e.target.value)}
                            displayEmpty
                          >
                            <MenuItem value="" disabled>
                              Enter roast level
                            </MenuItem>
                            <MenuItem value="light">Light</MenuItem>
                            <MenuItem value="medium">Medium</MenuItem>
                            <MenuItem value="dark">Dark</MenuItem>
                          </Select>
                        </FormControl>
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
                        <FormControl fullWidth error={!!errors.form}>
                          <Select
                            value={field.state.value}
                            onChange={(e) => field.handleChange(e.target.value)}
                            displayEmpty
                            disabled={resultGetForms.isLoading}
                          >
                            <MenuItem value="" disabled>
                              {resultGetForms.isLoading
                                ? "Loading..."
                                : "Select form"}
                            </MenuItem>
                            {resultGetForms?.data?.map((form) => (
                              <MenuItem key={form.id} value={form.id}>
                                {capitalize(form.name)}
                              </MenuItem>
                            ))}
                          </Select>
                        </FormControl>
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
                  disabled={mutation.isPending}
                  sx={{
                    bgcolor: "#4A90E2",
                    "&:hover": { bgcolor: "#357ABD" },
                    textTransform: "none",
                    px: 4,
                    borderRadius: 1,
                  }}
                >
                  {mutation.isPending ? "Adding..." : "Add"}
                </Button>
              </Box>
            </form>
          </Box>
        </Box>
      </Paper>

      <Dialog
        open={openDialog}
        onClose={handleDialogClose}
        aria-labelledby="confirm-dialog-title"
        aria-describedby="confirm-dialog-description"
      >
        <DialogTitle id="confirm-dialog-title">
          Confirm Product Creation
        </DialogTitle>
        <DialogContent>
          <DialogContentText id="confirm-dialog-description">
            Are you sure you want to add this product? Please review the details
            before confirming.
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button
            onClick={handleDialogClose}
            sx={{ textTransform: "none" }}
            disabled={mutation.isPending}
          >
            Cancel
          </Button>
          <Button
            onClick={handleDialogConfirm}
            variant="contained"
            autoFocus
            disabled={mutation.isPending}
            sx={{
              bgcolor: "#4A90E2",
              "&:hover": { bgcolor: "#357ABD" },
              textTransform: "none",
            }}
          >
            {mutation.isPending ? "Creating..." : "Confirm"}
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
}
