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
} from "@mui/material";
import { dataStore, type Bean } from "../lib/store";

export function Beans() {
  const [beans, setBeans] = useState<Bean[]>(dataStore.getBeans());
  const [newBeanName, setNewBeanName] = useState("");
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editingName, setEditingName] = useState("");

  const handleAdd = () => {
    if (newBeanName.trim()) {
      dataStore.addBean({ name: newBeanName });
      setBeans(dataStore.getBeans());
      setNewBeanName("");
    }
  };

  const handleDelete = (id: string) => {
    dataStore.deleteBean(id);
    setBeans(dataStore.getBeans());
  };

  const handleEdit = (bean: Bean) => {
    setEditingId(bean.id);
    setEditingName(bean.name);
  };

  const handleSaveEdit = () => {
    if (editingId && editingName.trim()) {
      dataStore.updateBean(editingId, { name: editingName });
      setBeans(dataStore.getBeans());
      setEditingId(null);
      setEditingName("");
    }
  };

  const handleCancelEdit = () => {
    setEditingId(null);
    setEditingName("");
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
          Beans of coffee
        </Typography>

        <Box
          sx={{
            border: "1px solid #ccc",
            borderRadius: 1,
            p: 3,
            minHeight: 500,
          }}
        >
          <Box sx={{ display: "flex", gap: 2, mb: 3 }}>
            <TextField
              fullWidth
              placeholder="Add bean here ..."
              value={newBeanName}
              onChange={(e) => setNewBeanName(e.target.value)}
              onKeyPress={(e) => e.key === "Enter" && handleAdd()}
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
            >
              ADD
            </Button>
          </Box>

          <List sx={{ p: 0 }}>
            {beans.map((bean) => (
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
                      sx={{ flexGrow: 1, mr: 2, bgcolor: "white" }}
                    />
                    <Box sx={{ display: "flex", gap: 1 }}>
                      <Button
                        onClick={handleSaveEdit}
                        variant="contained"
                        size="small"
                      >
                        Save
                      </Button>
                      <Button
                        onClick={handleCancelEdit}
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
                      >
                        Delete
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
    </Paper>
  );
}
