import { Box, TextField } from "@mui/material";

export function HeaderSearchBox() {
  return (
    <Box sx={{ maxWidth: "100%" }}>
      <TextField
        fullWidth
        variant="filled"
        label="Search"
        autoComplete="off"
        color="primary"
        sx={{ backgroundColor: "rgba(255, 255, 255, 0.2)" }}
        InputLabelProps={{
          style: {
            color: "white",
          },
        }}
        InputProps={{
          style: {
            color: "white",
          },
        }}
      />
    </Box>
  );
}
