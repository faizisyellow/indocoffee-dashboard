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
  Dialog,
  DialogTitle,
  DialogContent,
  DialogContentText,
  DialogActions,
  Alert,
  capitalize,
} from "@mui/material";
import { X } from "lucide-react";
import { useForm } from "@tanstack/react-form";
import * as yup from "yup";
import { type Product } from "../lib/store";
import { useNavigate, useParams } from "react-router";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { AxiosError } from "axios";
import { inventoryService } from "../lib/service/inventory";
import type { EditProductResponse } from "../lib/service/response/inventory";

const productSchema = yup.object({
  bean: yup.number().required("Bean is required"),
  roasted: yup.string().required("Roasted is required"),
  form: yup.number().required("Form is required"),
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
  const queryClient = useQueryClient();
  const [product, setProduct] = useState<Product | null>(null);
  const [imagePreview, setImagePreview] = useState<string>("");
  const [newImageFile, setNewImageFile] = useState<File | null>(null);
  const [confirmDialogOpen, setConfirmDialogOpen] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});

  const userRole = localStorage.getItem("role");
  const isSuperAdmin = userRole === "super admin";

  const resultGetProduct = useQuery({
    queryKey: ["products", id],
    queryFn: () => inventoryService.GetProduct(Number(id)),
    enabled: !!id,
  });

  const resultGetBeans = useQuery({
    queryKey: ["beans"],
    queryFn: () => inventoryService.GetBeans(),
  });

  const resultGetForms = useQuery({
    queryKey: ["forms"],
    queryFn: () => inventoryService.GetForms(),
  });

  useEffect(() => {
    if (resultGetProduct.data) {
      setProduct(resultGetProduct.data);
      if (resultGetProduct.data.image) {
        setImagePreview(resultGetProduct.data.image);
      }
    }
  }, [resultGetProduct.data]);

  const editProductMutation = useMutation({
    mutationFn: (variables: { formData: FormData; productId: number }) =>
      inventoryService.EditProduct(variables.formData, variables.productId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["products"] });
      navigate("/inventory/products");
    },
  });

  const getErrorMessage = (): string => {
    const error = editProductMutation.error as AxiosError<EditProductResponse>;

    if (!error?.response) {
      if (error?.message === "Network Error" || error?.code === "ERR_NETWORK") {
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
        return "You don't have permission to update this product.";
      case 404:
        return "Product not found.";
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
      if (!id) return;

      try {
        await productSchema.validate(
          {
            bean: Number(value.bean),
            roasted: value.roasted,
            form: Number(value.form),
            price: Number(value.price),
            quantity: Number(value.quantity),
          },
          { abortEarly: false },
        );

        setErrors({});

        const formData = new FormData();
        const metadata = {
          bean: Number(value.bean),
          roasted: value.roasted,
          form: Number(value.form),
          price: Number(value.price),
          quantity: Number(value.quantity),
        };
        formData.append("metadata", JSON.stringify(metadata));

        if (newImageFile) {
          formData.append("file", newImageFile);
        }

        editProductMutation.mutate({ formData, productId: Number(id) });
      } catch (err) {
        if (err instanceof yup.ValidationError) {
          const validationErrors: Record<string, string> = {};
          err.inner.forEach((e) => {
            if (e.path) validationErrors[e.path] = e.message;
          });
          setErrors(validationErrors);
        }
      }
    },
  });

  useEffect(() => {
    if (product) {
      form.setFieldValue("bean", String(product.bean_id) || "");
      form.setFieldValue("roasted", product.roasted?.toLowerCase() || "");
      form.setFieldValue("form", String(product.form_id) || "");
      form.setFieldValue("price", product.price?.toString() || "");
      form.setFieldValue("quantity", product.quantity?.toString() || "");
      form.setFieldValue("image", product.image || "");
    }
  }, [product, form]);

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setNewImageFile(file);
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
    setNewImageFile(null);
    form.setFieldValue("image", "");
  };

  const handleSubmitClick = (e: React.FormEvent) => {
    e.preventDefault();
    e.stopPropagation();
    (document.activeElement as HTMLElement)?.blur();
    setConfirmDialogOpen(true);
  };

  const handleConfirmSubmit = () => {
    setConfirmDialogOpen(false);
    if (!isSuperAdmin) {
      return;
    }
    form.handleSubmit();
  };

  const handleCancelSubmit = () => {
    setConfirmDialogOpen(false);
  };

  if (
    resultGetProduct.isLoading ||
    resultGetBeans.isLoading ||
    resultGetForms.isLoading
  ) {
    return <Typography>Loading...</Typography>;
  }

  if (!product) {
    return <Typography>Product not found</Typography>;
  }

  return (
    <>
      <Paper
        elevation={0}
        sx={{ bgcolor: "white", borderRadius: 2, overflow: "hidden" }}
      >
        <Box sx={{ p: 4, bgcolor: "white" }}>
          <Typography variant="h5" sx={{ fontWeight: 600, mb: 4 }}>
            Update Product #{id}
          </Typography>

          {editProductMutation.error && (
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
            <form onSubmit={handleSubmitClick}>
              <Grid container spacing={3}>
                {/* Bean Select */}
                <Grid size={{ xs: 12, md: 6 }}>
                  <form.Field name="bean">
                    {(field) => (
                      <Box>
                        <Typography variant="body2" sx={{ mb: 1 }}>
                          Bean
                        </Typography>
                        <FormControl fullWidth error={!!errors.bean}>
                          <Select
                            value={field.state.value || ""}
                            onChange={(e) => field.handleChange(e.target.value)}
                            displayEmpty
                          >
                            <MenuItem value="" disabled>
                              {resultGetBeans.isLoading
                                ? "Loading..."
                                : "Select bean"}
                            </MenuItem>
                            {resultGetBeans.data?.map((bean) => (
                              <MenuItem key={bean.id} value={String(bean.id)}>
                                {capitalize(bean.name)}
                              </MenuItem>
                            ))}
                          </Select>
                        </FormControl>
                        {errors.bean && (
                          <Typography
                            variant="caption"
                            color="error"
                            sx={{ mt: 0.5 }}
                          >
                            {errors.bean}
                          </Typography>
                        )}
                      </Box>
                    )}
                  </form.Field>
                </Grid>

                {/* Roasted Select */}
                <Grid size={{ xs: 12, md: 6 }}>
                  <form.Field name="roasted">
                    {(field) => (
                      <Box>
                        <Typography variant="body2" sx={{ mb: 1 }}>
                          Roasted
                        </Typography>
                        <FormControl fullWidth error={!!errors.roasted}>
                          <Select
                            value={field.state.value || ""}
                            onChange={(e) => field.handleChange(e.target.value)}
                            displayEmpty
                          >
                            <MenuItem value="" disabled>
                              Select roasted level
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
                            sx={{ mt: 0.5 }}
                          >
                            {errors.roasted}
                          </Typography>
                        )}
                      </Box>
                    )}
                  </form.Field>
                </Grid>

                {/* Form Select */}
                <Grid size={{ xs: 12, md: 6 }}>
                  <form.Field name="form">
                    {(field) => (
                      <Box>
                        <Typography variant="body2" sx={{ mb: 1 }}>
                          Form
                        </Typography>
                        <FormControl fullWidth error={!!errors.form}>
                          <Select
                            value={field.state.value || ""}
                            onChange={(e) => field.handleChange(e.target.value)}
                            displayEmpty
                          >
                            <MenuItem value="" disabled>
                              {resultGetForms.isLoading
                                ? "Loading..."
                                : "Select form"}
                            </MenuItem>
                            {resultGetForms.data?.map((formItem) => (
                              <MenuItem
                                key={formItem.id}
                                value={String(formItem.id)}
                              >
                                {capitalize(formItem.name)}
                              </MenuItem>
                            ))}
                          </Select>
                        </FormControl>
                        {errors.form && (
                          <Typography
                            variant="caption"
                            color="error"
                            sx={{ mt: 0.5 }}
                          >
                            {errors.form}
                          </Typography>
                        )}
                      </Box>
                    )}
                  </form.Field>
                </Grid>

                {/* Price */}
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
                            sx={{ mt: 0.5 }}
                          >
                            {errors.price}
                          </Typography>
                        )}
                      </Box>
                    )}
                  </form.Field>
                </Grid>

                {/* Quantity */}
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
                            sx={{ mt: 0.5 }}
                          >
                            {errors.quantity}
                          </Typography>
                        )}
                      </Box>
                    )}
                  </form.Field>
                </Grid>

                <Grid size={{ xs: 12 }}>
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
                  {errors.image && (
                    <Typography
                      variant="caption"
                      color="error"
                      sx={{ mt: 0.5 }}
                    >
                      {errors.image}
                    </Typography>
                  )}
                </Grid>
              </Grid>

              <Box sx={{ display: "flex", justifyContent: "flex-end", mt: 4 }}>
                <Button
                  type="submit"
                  variant="contained"
                  disabled={editProductMutation.isPending}
                  sx={{
                    bgcolor: "#4A90E2",
                    "&:hover": { bgcolor: "#357ABD" },
                    px: 6,
                    py: 1.5,
                    textTransform: "none",
                    fontSize: "1rem",
                  }}
                >
                  {editProductMutation.isPending ? "Saving..." : "Save"}
                </Button>
              </Box>
            </form>
          </Box>
        </Box>
      </Paper>

      <Dialog open={confirmDialogOpen} onClose={handleCancelSubmit}>
        <DialogTitle id="confirm-dialog-title">Confirm Update</DialogTitle>
        <DialogContent>
          <DialogContentText id="confirm-dialog-description">
            Are you sure you want to update this product?
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button
            onClick={handleCancelSubmit}
            color="inherit"
            sx={{ textTransform: "none" }}
          >
            Cancel
          </Button>
          <Button
            onClick={handleConfirmSubmit}
            variant="contained"
            color="primary"
            sx={{ textTransform: "none" }}
            autoFocus
            disabled={!isSuperAdmin}
          >
            Confirm
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
}
