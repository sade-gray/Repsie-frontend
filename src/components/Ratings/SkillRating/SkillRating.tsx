import React, { useEffect, useState } from "react";
import { LocalDining } from "@mui/icons-material";
import { IconContainerProps, Rating, styled } from "@mui/material";
import { ratingProps } from "../ratingClasses";

function SkillRating({ value, readOnly, handleChange }: ratingProps) {
  const [colour, setColour] = useState<
    "success" | "error" | "warning" | "disabled"
  >("disabled");

  // Changes the colour of the rating component based on the value of skill rating
  function changeColour(newValue?: number) {
    setColour(() => {
      // Change the colour of icons to its set value if hovered away
      const colour = !newValue || newValue === -1 ? value || 1 : newValue;
      switch (colour) {
        case 1:
          return "success";
        case 2:
          return "success";
        case 3:
          return "warning";
        case 4:
          return "error";
        case 5:
          return "error";
        default:
          return "disabled";
      }
    });
  }
  // Update the colour of the icons whenever the parent passes a new skill value
  useEffect(() => {
    changeColour();
  }, [value]);

  // Custom icons for each value of the skill rating
  const customIcons: {
    [index: string]: {
      icon: React.ReactElement;
    };
  } = {
    1: { icon: <LocalDining color={colour} fontSize="large" /> },
    2: { icon: <LocalDining color={colour} fontSize="large" /> },
    3: { icon: <LocalDining color={colour} fontSize="large" /> },
    4: { icon: <LocalDining color={colour} fontSize="large" /> },
    5: { icon: <LocalDining color={colour} fontSize="large" /> },
  };
  // Icon wrapper for the rating component
  function IconContainer(props: IconContainerProps) {
    const { value, ...other } = props;
    return <span {...other}>{customIcons[value].icon}</span>;
  }

  // Styles for the rating component
  const StyledRating = styled(Rating)(({ theme }) => ({
    "& .MuiRating-iconEmpty .MuiSvgIcon-root": {
      color: theme.palette.action.disabled,
    },
  }));

  return (
    <StyledRating
      value={value || 1}
      name="skill-rating"
      IconContainerComponent={IconContainer}
      size="large"
      onChangeActive={(e, value) => {
        e.preventDefault();
        // Update the parent's value state if the component is not made readonly
        !readOnly && changeColour(value);
        console.log(value);
      }}
      onChange={(e, value) => {
        e.preventDefault();
        // Update the parent's value state if the component is not made readonly
        // if the handleChange function prop was passed
        !readOnly && handleChange?.(value || 1);
      }}
      readOnly={readOnly}
    />
  );
}

export default SkillRating;
