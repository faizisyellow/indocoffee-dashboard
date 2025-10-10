import {
  Box,
  TextField,
  Button,
  Typography,
  Paper,
  Alert,
  CircularProgress,
} from "@mui/material";
import * as yup from "yup";
import { useForm } from "@tanstack/react-form";
import { useMutation } from "@tanstack/react-query";
import { authService } from "../lib/service/auth";
import type { LoginRequest } from "../lib/service/request/login";
import { AxiosError } from "axios";
import type { Login } from "../lib/store";
import type { LoginResponse } from "../lib/service/response/login";
import { useState } from "react";
import { useNavigate } from "react-router";

export function Login() {
  const [validationErrors, setValidationErrors] = useState<{
    email?: string;
    password?: string;
  }>({});
  const [authorize, setAuthorize] = useState(true);

  const navigate = useNavigate();

  const loginSchema = yup.object({
    email: yup
      .string()
      .email("Invalid email format")
      .required("Email is required"),
    password: yup.string().required("Password is required"),
  });

  const mutation = useMutation({
    mutationFn: authService.login.bind(authService),
    onSuccess: (data: Login) => {
      if (
        data.user.role_name != "admin" &&
        data.user.role_name != "super admin"
      ) {
        setAuthorize(false);
        return;
      }

      localStorage.setItem("token", data.token);
      navigate("/");
    },
  });

  const form = useForm({
    defaultValues: {
      email: "",
      password: "",
    },
    onSubmit: async ({ value }) => {
      try {
        setValidationErrors({});

        await loginSchema.validate(
          {
            email: value.email,
            password: value.password,
          },
          { abortEarly: false },
        );

        mutation.mutate(value as LoginRequest);
      } catch (error) {
        if (error instanceof yup.ValidationError) {
          const errors: { email?: string; password?: string } = {};

          error.inner.forEach((err) => {
            if (err.path) {
              errors[err.path as keyof typeof errors] = err.message;
            }
          });

          setValidationErrors(errors);
        }
      }
    },
  });

  const getErrorMessage = (): string => {
    const error = mutation.error as AxiosError<LoginResponse>;

    if (!error.response) {
      if (error.message === "Network Error" || error.code === "ERR_NETWORK") {
        return "Unable to reach the server. Please check your internet connection and try again.";
      }
      return "A network issue occurred. Please try again.";
    }

    const status = error.response.status;
    const backendError = error.response.data?.error ?? "";

    if (status === 400 || backendError.toLowerCase().includes("validation")) {
      return "Some of your inputs are invalid. Please review the form and try again.";
    }

    if (status === 401 || status === 404) {
      return "Invalid email or password. Please try again.";
    }

    if (status >= 500) {
      return "Our server is having trouble right now. Please try again later.";
    }

    return backendError || "An unexpected error occurred. Please try again.";
  };

  return (
    <Box
      sx={{
        minHeight: "100vh",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        bgcolor: "#f5f5f5",
      }}
    >
      <Paper
        elevation={3}
        sx={{
          p: 4,
          maxWidth: 400,
          width: "100%",
        }}
      >
        <Typography
          variant="h4"
          component="h1"
          gutterBottom
          sx={{ fontWeight: 700, mb: 3 }}
        >
          INDOCOFFEE
        </Typography>
        <Typography variant="h6" gutterBottom sx={{ mb: 3 }}>
          Login
        </Typography>

        {mutation.isError && mutation.error && (
          <Alert severity="error" sx={{ mb: 2 }}>
            {getErrorMessage()}
          </Alert>
        )}

        {mutation.isSuccess && authorize && (
          <Alert severity="success" sx={{ mb: 2 }}>
            Login successful!
          </Alert>
        )}

        {!authorize && (
          <Alert severity="warning" sx={{ mb: 2 }}>
            You don't have permission to login!
          </Alert>
        )}

        <form
          onSubmit={(e) => {
            e.preventDefault();
            e.stopPropagation();
            form.handleSubmit();
          }}
        >
          <form.Field name="email">
            {(field) => (
              <TextField
                fullWidth
                label="Email"
                type="email"
                value={field.state.value}
                onChange={(e) => {
                  field.handleChange(e.target.value);
                  if (validationErrors.email) {
                    setValidationErrors((prev) => ({
                      ...prev,
                      email: undefined,
                    }));
                  }
                }}
                margin="normal"
                required
                disabled={mutation.isPending}
                error={!!validationErrors.email}
                helperText={validationErrors.email}
              />
            )}
          </form.Field>

          <form.Field name="password">
            {(field) => (
              <TextField
                fullWidth
                label="Password"
                type="password"
                value={field.state.value}
                onChange={(e) => {
                  field.handleChange(e.target.value);
                  if (validationErrors.password) {
                    setValidationErrors((prev) => ({
                      ...prev,
                      password: undefined,
                    }));
                  }
                }}
                margin="normal"
                required
                disabled={mutation.isPending}
                error={!!validationErrors.password}
                helperText={validationErrors.password}
              />
            )}
          </form.Field>

          <Button
            fullWidth
            type="submit"
            variant="contained"
            sx={{ mt: 3, py: 1.5 }}
            disabled={mutation.isPending}
          >
            {mutation.isPending ? <CircularProgress size={24} /> : "Login"}
          </Button>
        </form>

        <Typography variant="body2" sx={{ mt: 3, color: "text.secondary" }}>
          Demo credentials: admin@indocoffe.com / password123
        </Typography>
      </Paper>
    </Box>
  );
}
