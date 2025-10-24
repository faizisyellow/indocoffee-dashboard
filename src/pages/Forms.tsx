import { useState } from "react";
import {
  Box,
  Typography,
  Paper,
  TextField,
  Button,
  List,
  ListItem,
  ListItemText,
  Alert,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  CircularProgress,
} from "@mui/material";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { inventoryService } from "../lib/service/inventory";
import type { Form } from "../lib/store";
import { AxiosError } from "axios";
import * as yup from "yup";
import type { EditFormResponse } from "../lib/service/response/inventory";

export function Forms() {
  const [newFormName, setNewFormName] = useState("");
  const [createError, setCreateError] = useState<string | null>(null);
  const [editError, setEditError] = useState<string | null>(null);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [editingName, setEditingName] = useState("");
  const [confirmAction, setConfirmAction] = useState<{
    type: "create" | "edit" | "delete" | null;
    id: number | null;
  }>({ type: null, id: null });

  const userRole = localStorage.getItem("role");
  const isSuperAdmin = userRole === "super admin";

  const queryClient = useQueryClient();

  const formSchema = yup.object({
    name: yup
      .string()
      .trim()
      .required("Form name is required")
      .min(5, "Form name must be at least 2 characters")
      .max(12, "Form name must be at most 10 characters"),
  });

  const editFormSchema = yup.object({
    name: yup
      .string()
      .trim()
      .required("Form name is required")
      .min(5, "Form name must be at least 2 characters")
      .max(12, "Form name must be at most 10 characters"),
  });

  const {
    data: forms,
    isLoading,
    isError,
  } = useQuery({
    queryKey: ["forms"],
    queryFn: inventoryService.GetForms.bind(inventoryService),
  });

  const createFormMutation = useMutation({
    mutationFn: (payload: { name: string }) =>
      inventoryService.CreateForm(payload.name),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["forms"] });
      setNewFormName("");
      setCreateError(null);
    },
    onError: (error: AxiosError) => {
      setCreateError(
        error.response?.status === 409
          ? "A form with that name already exists."
          : "Failed to create form. Please try again.",
      );
    },
  });

  const editFormMutation = useMutation({
    mutationFn: (payload: { id: number; name: string }) =>
      inventoryService.EditForm(payload.id, payload.name),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["forms"] });
      setEditingId(null);
      setEditingName("");
      setEditError(null);
      setConfirmAction({ type: null, id: null });
    },
    onError: () => {
      setEditError("Failed to edit form. Please try again.");
      setConfirmAction({ type: null, id: null });
    },
  });

  const deleteFormMutation = useMutation({
    mutationFn: (id: number) => inventoryService.DeleteForm(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["forms"] });
      setConfirmAction({ type: null, id: null });
    },
    onError: () => {
      setConfirmAction({ type: null, id: null });
    },
  });

  const getErrorMessage = (): string => {
    const error = editFormMutation.error as AxiosError<EditFormResponse>;

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
        return "You don't have permission to update this form.";
      case 404:
        return "Form not found.";
      case 409:
        return "A form with a similar name already exists.";
      case 429:
        return "Too many requests. Please slow down and try again later.";
      case 500:
        return "Our server is having trouble right now. Please try again later.";
      default:
        if (status >= 500) {
          return "Our server is having trouble right now. Please try again later.";
        }
        return "An unexpected error occurred. Please try again.";
    }
  };

  const handleAdd = async () => {
    try {
      await formSchema.validate({ name: newFormName });
      setCreateError(null);
      if (isSuperAdmin) {
        createFormMutation.mutate({ name: newFormName });
      }
    } catch (err) {
      if (err instanceof yup.ValidationError) {
        setCreateError(err.message);
      } else {
        setCreateError("An unexpected error occurred");
      }
      setConfirmAction({ type: null, id: null });
    }
  };

  const handleEdit = (form: Form) => {
    setEditingId(form.id);
    setEditingName(form.name);
    setEditError(null);
  };

  const handleSaveEdit = async () => {
    if (!editingId) return;

    try {
      await editFormSchema.validate({ name: editingName });
      setEditError(null);
      setConfirmAction({ type: "edit", id: editingId });
    } catch (err) {
      if (err instanceof yup.ValidationError) {
        setEditError(err.message);
      } else {
        setEditError("An unexpected error occurred during validation");
      }
      setConfirmAction({ type: null, id: null });
    }
  };

  const handleDelete = (id: number) => {
    setConfirmAction({ type: "delete", id });
  };

  const handleConfirmAction = () => {
    if (!confirmAction.type || !confirmAction.id) return;
    if (confirmAction.type === "delete") {
      deleteFormMutation.mutate(confirmAction.id);
    } else if (confirmAction.type === "edit" && editingName.trim()) {
      editFormMutation.mutate({
        id: confirmAction.id,
        name: editingName,
      });
    }
  };

  const confirmDialogTitle =
    confirmAction.type === "delete"
      ? "Confirm Delete"
      : confirmAction.type === "edit"
        ? "Confirm Edit"
        : "";

  const confirmDialogText =
    confirmAction.type === "delete"
      ? "Are you sure you want to delete this form? This action cannot be undone."
      : confirmAction.type === "edit"
        ? `Are you sure you want to rename this form to "${editingName}"?`
        : "";

  if (isLoading) {
    return (
      <Box sx={{ display: "flex", justifyContent: "center", p: 4 }}>
        <CircularProgress />
      </Box>
    );
  }

  if (isError) {
    return (
      <Alert severity="error">
        Failed to load forms. Please refresh the page.
      </Alert>
    );
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
          Forms of Coffee
        </Typography>

        {editFormMutation.isError && (
          <Alert severity="error" sx={{ mb: 2 }}>
            {getErrorMessage()}
          </Alert>
        )}

        <Box sx={{ display: "flex", gap: 2, mb: 3 }}>
          <TextField
            fullWidth
            placeholder="Add form here..."
            value={newFormName}
            onChange={(e) => setNewFormName(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && handleAdd()}
            error={!!createError}
            helperText={createError || ""}
            sx={{ bgcolor: "white" }}
          />
          <Button
            variant="contained"
            onClick={handleAdd}
            sx={{
              minWidth: 100,
              bgcolor: "#4A90E2",
              "&:hover": { bgcolor: "#357ABD" },
            }}
            disabled={createFormMutation.isPending || !isSuperAdmin}
          >
            {createFormMutation.isPending ? (
              <CircularProgress size={20} color="inherit" />
            ) : (
              "ADD"
            )}
          </Button>
        </Box>

        <Box
          sx={{
            border: "1px solid #ccc",
            borderRadius: 1,
            p: 3,
            minHeight: 500,
          }}
        >
          <List sx={{ p: 0 }}>
            {forms?.map((form) => (
              <ListItem
                key={form.id}
                sx={{
                  border: "1px solid #ccc",
                  borderRadius: 1,
                  mb: 2,
                  bgcolor: "#f5f5f5",
                  display: "flex",
                  justifyContent: "space-between",
                }}
              >
                {editingId === form.id ? (
                  <>
                    <TextField
                      value={editingName}
                      onChange={(e) => setEditingName(e.target.value)}
                      size="small"
                      error={!!editError && editingId === form.id}
                      sx={{ flexGrow: 1, mr: 2, bgcolor: "white" }}
                    />

                    <Box sx={{ display: "flex", gap: 1 }}>
                      <Button
                        onClick={handleSaveEdit}
                        variant="contained"
                        size="small"
                        disabled={editFormMutation.isPending || !isSuperAdmin}
                      >
                        {editFormMutation.isPending ? (
                          <CircularProgress size={18} color="inherit" />
                        ) : (
                          "Save"
                        )}
                      </Button>
                      <Button
                        onClick={() => {
                          setEditingId(null);
                          setEditingName("");
                        }}
                        variant="outlined"
                        size="small"
                      >
                        Cancel
                      </Button>
                    </Box>
                  </>
                ) : (
                  <>
                    <ListItemText primary={form.name} />
                    <Box sx={{ display: "flex", gap: 1 }}>
                      <Button
                        onClick={() => handleDelete(form.id)}
                        sx={{ color: "text.secondary" }}
                        disabled={deleteFormMutation.isPending || !isSuperAdmin}
                      >
                        {deleteFormMutation.isPending &&
                        confirmAction.id === form.id ? (
                          <CircularProgress size={18} color="inherit" />
                        ) : (
                          "Delete"
                        )}
                      </Button>
                      <Button
                        onClick={() => handleEdit(form)}
                        sx={{ color: "text.secondary" }}
                      >
                        Edit
                      </Button>
                    </Box>
                  </>
                )}
              </ListItem>
            ))}
          </List>
        </Box>
      </Box>

      <Dialog
        open={!!confirmAction.type}
        onClose={() => setConfirmAction({ type: null, id: null })}
      >
        <DialogTitle>{confirmDialogTitle}</DialogTitle>
        <DialogContent>
          <DialogContentText>{confirmDialogText}</DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button
            onClick={() => setConfirmAction({ type: null, id: null })}
            color="inherit"
          >
            Cancel
          </Button>
          <Button
            onClick={handleConfirmAction}
            color="primary"
            variant="contained"
            disabled={
              editFormMutation.isPending ||
              deleteFormMutation.isPending ||
              !isSuperAdmin
            }
          >
            {editFormMutation.isPending || deleteFormMutation.isPending ? (
              <CircularProgress size={20} color="inherit" />
            ) : (
              "Confirm"
            )}
          </Button>
        </DialogActions>
      </Dialog>
    </Paper>
  );
}
