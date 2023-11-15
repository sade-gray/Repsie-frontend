import React, {useEffect, useState} from "react";
import {LocalDining} from "@mui/icons-material";
import {IconContainerProps, Rating, styled} from "@mui/material";

/**
 * Display of skill rating. Editable by default
 * @param value
 * @constructor
 */
function SkillRating({value, readOnly}: any) {
    const [skillRatingValue, setSkillRatingValue] = useState<number>(value);
    const [colour, setColour] = useState<"success" | "error" | "warning" | "disabled">("disabled");
    function changeColour(value?: number) {
        setColour(() => {
            const colour = !value || value === -1 ? skillRatingValue : value;
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

    useEffect(() => {
        changeColour();
    }, [value]);

    const customIcons: {
        [index: string]: {
            icon: React.ReactElement;
        };
    } = {
        1: {icon: <LocalDining color={colour} fontSize='large' />},
        2: {icon: <LocalDining color={colour} fontSize='large' />},
        3: {icon: <LocalDining color={colour} fontSize='large' />},
        4: {icon: <LocalDining color={colour} fontSize='large' />},
        5: {icon: <LocalDining color={colour} fontSize='large' />},
    };

    function IconContainer(props: IconContainerProps) {
        const {value, ...other} = props;
        return <span {...other}>{customIcons[value].icon}</span>;
    }

    const StyledRating = styled(Rating)(({theme}) => ({
        "& .MuiRating-iconEmpty .MuiSvgIcon-root": {
            color: theme.palette.action.disabled,
        },
    }));

    return (
        <StyledRating value={skillRatingValue} name='skill-rating'
                      IconContainerComponent={IconContainer}
                      size='large'
                      onChangeActive={(e, value) => {
                        e.preventDefault();
                        changeColour(value);
                      }}
                      onChange={(e, newValue) => {
                        e.preventDefault();
                        setSkillRatingValue(newValue || 1);
                      }}
                      readOnly={readOnly ?? false}
        />
    )
}

export default SkillRating;
