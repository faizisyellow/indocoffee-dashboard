import { Alert, IconButton, Collapse } from "@mui/material";
import { X } from "lucide-react";
import { useState } from "react";

const BANNER_STORAGE_KEY = "demoBannerClosed";

const isBannerClosed = () => {
  try {
    return sessionStorage.getItem(BANNER_STORAGE_KEY) === "true";
  } catch {
    return false;
  }
};

export const DemoBanner = () => {
  const [open, setOpen] = useState(() => !isBannerClosed());

  const handleClose = () => {
    setOpen(false);
    try {
      sessionStorage.setItem(BANNER_STORAGE_KEY, "true");
    } catch {
      console.log("error when set banner value");
    }
  };

  return (
    <Collapse in={open}>
      <Alert
        severity="warning"
        action={
          <IconButton
            aria-label="close"
            color="inherit"
            size="small"
            onClick={handleClose}
          >
            <X size={18} />
          </IconButton>
        }
        sx={{
          borderRadius: 0,
          width: "100%",
          "& .MuiAlert-message": {
            width: "100%",
          },
        }}
      >
        This is a demo version - admin is in read-only mode
      </Alert>
    </Collapse>
  );
};
