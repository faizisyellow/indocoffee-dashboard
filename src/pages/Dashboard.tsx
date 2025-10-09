import { Typography, Paper } from "@mui/material";

export function Dashboard() {
  return (
    <Paper
      elevation={0}
      sx={{
        p: 4,
        bgcolor: "white",
        borderRadius: 2,
      }}
    >
      <Typography variant="h4" sx={{ fontWeight: 600, mb: 4 }}>
        Welcome to INDOCOFFEE Dashboard
      </Typography>
      <Typography variant="body1" color="text.secondary">
        Use the sidebar to navigate to different sections of the inventory
        management system.
      </Typography>
    </Paper>
  );
}
