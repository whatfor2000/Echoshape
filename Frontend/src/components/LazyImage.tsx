import React, { useState } from "react";
import { Box, IconButton, Typography, Skeleton } from "@mui/material";
import FavoriteIcon from "@mui/icons-material/Favorite";
import FavoriteBorderIcon from "@mui/icons-material/FavoriteBorder";
import DeleteIcon from "@mui/icons-material/Delete";

interface LazyImageProps {
  image: { id: string; src: string; title: string; likes: { userId: string }[] };
  liked: boolean;
  onLike: () => void;
  onDelete: () => void;
  onClick: () => void;
}

const LazyImage: React.FC<LazyImageProps> = ({ image, liked, onLike, onDelete, onClick }) => {
  const [loaded, setLoaded] = useState(false);

  return (
    <Box
      sx={{
        position: "relative",
        borderRadius: 2,
        overflow: "hidden",
        boxShadow: 5,
        width: { xs: "100%", sm: 300, md: 250 },
        height: { xs: "auto", sm: 300, md: 250 },
        cursor: "pointer",
        "&:hover": { transform: "scale(1.03)", transition: "0.3s" },
      }}
      onClick={onClick}
    >
      {!loaded && <Skeleton variant="rectangular" width="100%" height="100%" />}
      <img
        src={image.src}
        alt={image.title}
        style={{
          width: "100%",
          height: "100%",
          objectFit: "cover",
          display: loaded ? "block" : "none",
          opacity: loaded ? 1 : 0,
          transition: "opacity 0.5s ease-in",
        }}
        onLoad={() => setLoaded(true)}
      />

      {loaded && (
        <Box
          sx={{
            position: "absolute",
            bottom: 10,
            right: 10,
            display: "flex",
            alignItems: "center",
            gap: 1,
            backgroundColor: "rgba(0,0,0,0.3)",
            borderRadius: "50px",
            padding: "4px 8px",
          }}
        >
          <IconButton onClick={(e) => { e.stopPropagation(); onLike(); }} sx={{ color: liked ? "red" : "white" }}>
            {liked ? <FavoriteIcon /> : <FavoriteBorderIcon />}
          </IconButton>
          <Typography sx={{ color: "white", fontWeight: "bold" }}>{image.likes.length}</Typography>
          <IconButton onClick={(e) => { e.stopPropagation(); onDelete(); }} sx={{ color: "white" }}>
            <DeleteIcon />
          </IconButton>
        </Box>
      )}
    </Box>
  );
};

export default LazyImage;
