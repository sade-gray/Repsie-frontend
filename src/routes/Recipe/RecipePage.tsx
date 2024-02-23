import { PublisherContainer } from "./components/PublisherContainer.tsx";
import Wex from "../../assets/wex.png";
import { getDownloadURL } from "firebase/storage";
import { Box, Skeleton, Stack, Typography, useMediaQuery } from "@mui/material";
import { useNavigate, useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import { ref } from "firebase/storage";
import { contentStorage, recipesCollectionRef } from "../../firebase.ts";
import { doc, getDoc } from "firebase/firestore";
import Editor from "../CreateRecipe/components/Editor.tsx";
import { theme } from "../../theme.ts";
import SkillRating from "@component/Ratings/SkillRating";
import TimeRating from "@component/Ratings/TimeRating/TimeRating.tsx";
import CommentSection from "../MyRecipesPage/Components/CommentSection.tsx";
import useSnackBar from "@context/SnackBarProvider";

export function RecipePage() {
  const recipeId = useParams()["recipeId"];
  const [coverImageUrl, setCoverImageUrl] = useState<string>();
  const defaultImage = "macandcheese.jpg";
  const [recipeContent, setRecipeContent] = useState<any>();
  const isNotTablet = useMediaQuery(theme.breakpoints.up("lg"));
  const navigate = useNavigate();
  const { addSnack } = useSnackBar();

  // Fetch the recipe content on load up
  useEffect(() => {
    getDoc(doc(recipesCollectionRef, recipeId))
      .then((res) => {
        if (res.exists()) {
          setRecipeContent(res.data());
          const imageRef = ref(
            contentStorage,
            `recipeImages/${res.data().image || defaultImage}`
          );
          getDownloadURL(imageRef).then((url) => {
            setCoverImageUrl(url);
          });
        } else {
          addSnack("Recipe not found", "error");
          navigate("/");
        }
      })
      .catch((error) => console.log(error));
  }, []);

  return (
    <main>
      {recipeContent ? (
        <div className="recipe--page--container">
          <div className="recipe--container">
            <div className="recipe--title--container">
              <Typography variant={`${isNotTablet ? "h3" : "h4"}`}>
                {recipeContent?.title || "Loading..."}
              </Typography>
            </div>
            <div className="recipe--image--container">
              {coverImageUrl && (
                <img
                  className="recipe--image"
                  src={coverImageUrl}
                  alt="Recipe cover image"
                />
              )}
            </div>
            <div className="recipe--publisher--container">
              <PublisherContainer
                publisherImageUrl={Wex}
                publisherName="Patriks Baller"
              />
            </div>

            <section className="recipe--rating--container">
              <div>
                <Typography color="text">Time rating</Typography>
                <TimeRating value={recipeContent?.timeRating} readOnly />
              </div>
              <div>
                <Typography color="text">Skill rating</Typography>
                <SkillRating value={recipeContent?.skillRating} readOnly />
              </div>
            </section>

            {/* Recipe Content */}
            <section className="recipe--content--container">
              <Editor
                readOnly
                recipeData={JSON.parse(recipeContent.recipe || "")}
              />
            </section>

            {/* Comments Section */}
            <CommentSection recipeId={"loremipsumdolor"} />
          </div>
        </div>
      ) : (
        // Skeleton
        <div>
          <Stack
            spacing={1}
            className="recipe--page--container"
            alignItems={"center"}
          >
            <Box sx={{ width: "100%" }}>
              <Skeleton
                variant="text"
                animation="wave"
                width={"100%"}
                height={40}
              />
              <Skeleton
                variant="rectangular"
                width={"100%"}
                height={300}
                animation="wave"
              />
            </Box>

            <Box
              sx={{
                display: "flex",
                alignItems: "center",
                gap: "0.5rem",
                width: "100%",
              }}
            >
              <Skeleton
                variant="circular"
                width={40}
                height={40}
                animation="wave"
              />
              <Skeleton variant="text" width={100} height={50} />
            </Box>

            <Box
              sx={{
                display: "flex",
                justifyContent: "space-between",
                width: "100%",
              }}
            >
              <Box>
                <Skeleton variant="text" animation="wave" width={100} />
                <Skeleton variant="rectangular" animation="wave" width={100} />
              </Box>
              <Box>
                <Skeleton variant="text" animation="wave" width={100} />
                <Skeleton variant="rectangular" animation="wave" width={100} />
              </Box>
            </Box>

            <Skeleton
              variant="rectangular"
              animation="wave"
              width={"100%"}
              height={300}
            />
          </Stack>
        </div>
      )}
    </main>
  );
}
