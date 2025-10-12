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
import type { Bean } from "../lib/store";
import { AxiosError } from "axios";
import * as yup from "yup";
import type { EditBeanResponse } from "../lib/service/response/inventory";

export function Beans() {
  const [newBeanName, setNewBeanName] = useState("");
  const [createError, setCreateError] = useState<string | null>(null);
  const [editError, setEditError] = useState<string | null>(null);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [editingName, setEditingName] = useState("");
  const [confirmAction, setConfirmAction] = useState<{
    type: "create" | "edit" | "delete" | null;
    id: number | null;
  }>({ type: null, id: null });

  const queryClient = useQueryClient();

  const beanSchema = yup.object({
    name: yup
      .string()
      .trim()
      .required("Bean name is required")
      .min(2, "Bean name must be at least 2 characters")
      .max(10, "Bean name must be at most 10 characters"),
  });

  const editBeanSchema = yup.object({
    name: yup
      .string()
      .trim()
      .required("Bean name is required")
      .min(2, "Bean name must be at least 2 characters")
      .max(10, "Bean name must be at most 10 characters"),
  });

  const {
    data: beans,
    isLoading,
    isError,
  } = useQuery({
    queryKey: ["beans"],
    queryFn: inventoryService.GetBeans.bind(inventoryService),
  });

  const createBeanMutation = useMutation({
    mutationFn: (payload: { name: string }) =>
      inventoryService.CreateBean(payload.name),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["beans"] });
      setNewBeanName("");
      setCreateError(null);
    },
    onError: (error: AxiosError) => {
      setCreateError(
        error.response?.status === 409
          ? "A bean with that name already exists."
          : "Failed to create bean. Please try again.",
      );
    },
  });

  const editBeanMutation = useMutation({
    mutationFn: (payload: { id: number; name: string }) =>
      inventoryService.EditBean(payload.id, payload.name),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["beans"] });
      setEditingId(null);
      setEditingName("");
      setEditError(null);
      setConfirmAction({ type: null, id: null });
    },
    onError: () => {
      setEditError("Failed to edit bean. Please try again.");
      setConfirmAction({ type: null, id: null });
    },
  });

  const deleteBeanMutation = useMutation({
    mutationFn: (id: number) => inventoryService.DeleteBean(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["beans"] });
      setConfirmAction({ type: null, id: null });
    },
  });

  const getErrorMessage = (): string => {
    const error = editBeanMutation.error as AxiosError<EditBeanResponse>;

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
        return "You don't have permission to update this bean.";
      case 404:
        return "Bean not found.";
      case 409:
        return "A bean with a similar name already exists.";
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
      await beanSchema.validate({ name: newBeanName });
      setCreateError(null);
      createBeanMutation.mutate({ name: newBeanName });
    } catch (err) {
      if (err instanceof yup.ValidationError) {
        setCreateError(err.message);
      } else {
        setCreateError("An unexpected error occurred");
      }
      setConfirmAction({ type: null, id: null });
    }
  };

  const handleEdit = (bean: Bean) => {
    setEditingId(bean.id);
    setEditingName(bean.name);
    setEditError(null);
  };

  const handleSaveEdit = async () => {
    if (!editingId) return;

    try {
      await editBeanSchema.validate({ name: editingName });
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

  const confirmDialogTitle =
    confirmAction.type === "delete"
      ? "Confirm Delete"
      : confirmAction.type === "edit"
        ? "Confirm Edit"
        : "";

  const confirmDialogText =
    confirmAction.type === "delete"
      ? "Are you sure you want to delete this bean? This action cannot be undone."
      : confirmAction.type === "edit"
        ? `Are you sure you want to rename this bean to "${editingName}"?`
        : "";

  const handleConfirmAction = () => {
    if (!confirmAction.type || !confirmAction.id) return;
    if (confirmAction.type === "delete") {
      deleteBeanMutation.mutate(confirmAction.id);
    } else if (confirmAction.type === "edit" && editingName.trim()) {
      editBeanMutation.mutate({
        id: confirmAction.id,
        name: editingName,
      });
    }
  };

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
        Failed to load beans. Please refresh the page.
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
          Beans of Coffee
        </Typography>

        {editBeanMutation.isError && (
          <Alert severity="error" sx={{ mb: 2 }}>
            {getErrorMessage()}
          </Alert>
        )}

        <Box sx={{ display: "flex", gap: 2, mb: 3 }}>
          <TextField
            fullWidth
            placeholder="Add bean here..."
            value={newBeanName}
            onChange={(e) => setNewBeanName(e.target.value)}
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
            disabled={createBeanMutation.isPending}
          >
            {createBeanMutation.isPending ? (
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
            {beans?.map((bean) => (
              <ListItem
                key={bean.id}
                sx={{
                  border: "1px solid #ccc",
                  borderRadius: 1,
                  mb: 2,
                  bgcolor: "#f5f5f5",
                  display: "flex",
                  justifyContent: "space-between",
                }}
              >
                {editingId === bean.id ? (
                  <>
                    <TextField
                      value={editingName}
                      onChange={(e) => setEditingName(e.target.value)}
                      size="small"
                      error={!!editError && editingId === bean.id}
                      sx={{ flexGrow: 1, mr: 2, bgcolor: "white" }}
                    />

                    <Box sx={{ display: "flex", gap: 1 }}>
                      <Button
                        onClick={handleSaveEdit}
                        variant="contained"
                        size="small"
                        disabled={editBeanMutation.isPending}
                      >
                        {editBeanMutation.isPending ? (
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
                    <ListItemText primary={bean.name} />
                    <Box sx={{ display: "flex", gap: 1 }}>
                      <Button
                        onClick={() => handleDelete(bean.id)}
                        sx={{ color: "text.secondary" }}
                        disabled={deleteBeanMutation.isPending}
                      >
                        {deleteBeanMutation.isPending &&
                        confirmAction.id === bean.id ? (
                          <CircularProgress size={18} color="inherit" />
                        ) : (
                          "Delete"
                        )}
                      </Button>
                      <Button
                        onClick={() => handleEdit(bean)}
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
              editBeanMutation.isPending || deleteBeanMutation.isPending
            }
          >
            {editBeanMutation.isPending || deleteBeanMutation.isPending ? (
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
