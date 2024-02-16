import { ratingProps } from "../ratingClasses";
import { AccessTime } from "@mui/icons-material";
import { Rating, styled } from "@mui/material";

function TimeRating({ value, readOnly, handleChange }: ratingProps) {
  const StyledRating = styled(Rating)(({ theme }) => ({
    "& .MuiRating-iconEmpty .MuiSvgIcon-root": {
      color: theme.palette.action.disabled,
    },
  }));

  return (
    <StyledRating
      value={value}
      name="time-rating"
      size="large"
      icon={<AccessTime fontSize="large" color="secondary" />}
      emptyIcon={<AccessTime fontSize="large" />}
      onChange={(e, newValue) => {
        e.preventDefault();
        !readOnly && handleChange?.(newValue || 1);
      }}
      readOnly={readOnly}
    />
  );
}

export default TimeRating;
