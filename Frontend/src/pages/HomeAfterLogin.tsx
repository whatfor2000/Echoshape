import React, { useEffect, useState } from "react";
import Cookies from "js-cookie";
import axios from "axios";
import {
  Box,
  Grid,
  IconButton,
  Typography,
  Dialog,
  Tooltip,
  Snackbar,
  Alert,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
} from "@mui/material";
import FavoriteIcon from "@mui/icons-material/Favorite";
import FavoriteBorderIcon from "@mui/icons-material/FavoriteBorder";
import FacebookIcon from "@mui/icons-material/Facebook";
import ShareIcon from "@mui/icons-material/Share";
import ContentCopyIcon from "@mui/icons-material/ContentCopy";
import { useNavigate } from "react-router-dom";

interface User {
  id: string;
  name: string;
  planId: string;
  maxGenerate: number;
}

interface ImageData {
  id: string;
  title: string;
  src: string;
  likes: { userId: string }[];
}

const Home: React.FC = () => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [images, setImages] = useState<ImageData[]>([]);
  const [likes, setLikes] = useState<{ [key: string]: boolean }>({});
  const [selectedImage, setSelectedImage] = useState<ImageData | null>(null);
  const [shareDialogOpen, setShareDialogOpen] = useState(false);
  const [shareImage, setShareImage] = useState<ImageData | null>(null);
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const navigate = useNavigate();

  // Fetch user
  useEffect(() => {
    async function fetchUser() {
      try {
        const token = Cookies.get("access_token");
        if (!token) {
          setLoading(false);
          return;
        }
        const res = await fetch(`${import.meta.env.VITE_BACKEND_URL}/users/profile`, {
          headers: { Authorization: `Bearer ${token}` },
          credentials: "include",
        });
        if (!res.ok) throw new Error(`Failed to fetch user: ${res.status}`);
        const data = await res.json();
        setUser({
          ...data,
          maxGenerate: data.planId === "subscription" ? 50 : 2,
        });
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    }
    fetchUser();
  }, []);

  // Fetch images
  useEffect(() => {
    async function fetchImages() {
      try {
        const res = await axios.get(`${import.meta.env.VITE_BACKEND_URL}/images`);
        setImages(res.data);

        const initialLikes: { [key: string]: boolean } = {};
        res.data.forEach((img: ImageData) => {
          initialLikes[img.id] = img.likes.some((like) => like.userId === user?.id);
        });
        setLikes(initialLikes);
      } catch (err) {
        console.error("Error fetching images:", err);
      }
    }
    if (!loading) fetchImages();
  }, [loading, user?.id]);

  const toggleLike = async (imageId: string) => {
    if (!user?.id) {
      alert("You must login first!");
      navigate("/login");
      return;
    }

    try {
      const res = await axios.post(`${import.meta.env.VITE_BACKEND_URL}/likes/toggle`, {
        userId: user.id,
        imageId,
      });

      setLikes((prev) => ({ ...prev, [imageId]: res.data.liked }));

      // Update likes count locally
      setImages((prevImages) =>
        prevImages.map((img) =>
          img.id === imageId
            ? {
                ...img,
                likes: res.data.liked
                  ? [...img.likes, { userId: user.id }]
                  : img.likes.filter((l) => l.userId !== user.id),
              }
            : img
        )
      );
    } catch (err) {
      console.error(err);
    }
  };

  // Share functions
  const shareToFacebook = (imgUrl: string) => {
    const shareUrl = `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(imgUrl)}`;
    window.open(shareUrl, "_blank", "width=600,height=400");
  };

  const shareToLine = (imgUrl: string) => {
    const shareUrl = `https://social-plugins.line.me/lineit/share?url=${encodeURIComponent(imgUrl)}`;
    window.open(shareUrl, "_blank", "width=600,height=400");
  };

  const copyLink = async (imgUrl: string) => {
    try {
      await navigator.clipboard.writeText(imgUrl);
      setSnackbarOpen(true);
    } catch (err) {
      console.error("Failed to copy:", err);
    }
  };

  if (loading) return <div>Loading...</div>;

  return (
    <>
      <Grid container spacing={4} sx={{ paddingX: { xs: 2, sm: 5, md: "10vw" } }}>
        {images.map((img) => (
          <Grid
            item
            key={img.id}
            xs={12}
            sm={6}
            md={3}
            lg={2.4}
            sx={{ display: "flex", justifyContent: "center" }}
          >
            <Box
              sx={{
                position: "relative",
                borderRadius: "20px",
                overflow: "hidden",
                boxShadow: 5,
                width: { xs: "100%", sm: 300, md: 250 },
                height: { xs: "auto", sm: 300, md: 250 },
                transition: "transform 0.3s",
                "&:hover": { transform: "scale(1.05)" },
                cursor: "pointer",
              }}
            >
              <img
                src={img.src}
                alt={img.title}
                style={{ width: "100%", height: "100%", objectFit: "cover", display: "block" }}
                onClick={() => setSelectedImage(img)}
              />

              {/* Bottom right icons */}
              <Box
                sx={{
                  position: "absolute",
                  bottom: 10,
                  right: 10,
                  display: "flex",
                  alignItems: "center",
                  gap: 1,
                  backgroundColor: "rgba(0,0,0,0.4)",
                  borderRadius: "50px",
                  padding: "4px 8px",
                }}
              >
                {/* Like */}
                <IconButton
                  onClick={(e) => {
                    e.stopPropagation();
                    toggleLike(img.id);
                  }}
                  sx={{ color: likes[img.id] ? "red" : "white" }}
                >
                  {likes[img.id] ? <FavoriteIcon fontSize="large" /> : <FavoriteBorderIcon fontSize="large" />}
                </IconButton>
                <Typography sx={{ color: "white", fontWeight: "bold" }}>{img.likes.length}</Typography>

                {/* Share button */}
                <Tooltip title="Share">
                  <IconButton
                    onClick={(e) => {
                      e.stopPropagation();
                      setShareImage(img);
                      setShareDialogOpen(true);
                    }}
                    sx={{ color: "white" }}
                  >
                    <ShareIcon />
                  </IconButton>
                </Tooltip>
              </Box>
            </Box>
          </Grid>
        ))}
      </Grid>

      {/* Modal แสดงภาพเต็ม */}
      <Dialog open={!!selectedImage} onClose={() => setSelectedImage(null)} maxWidth="lg">
        {selectedImage && (
          <img
            src={selectedImage.src}
            alt={selectedImage.title}
            loading="lazy"
            style={{ width: "100%", height: "auto", display: "block" }}
          />
        )}
      </Dialog>

      {/* Dialog Share */}
      <Dialog open={shareDialogOpen} onClose={() => setShareDialogOpen(false)}>
        <DialogTitle>แชร์ภาพนี้</DialogTitle>
        <DialogContent
          sx={{
            display: "flex",
            justifyContent: "center",
            gap: 3,
            padding: 3,
          }}
        >
          {shareImage && (
            <>
              <Tooltip title="Share on Facebook">
                <IconButton onClick={() => shareToFacebook(shareImage.src)} sx={{ color: "#1877f2" }}>
                  <FacebookIcon fontSize="large" />
                </IconButton>
              </Tooltip>

              <Tooltip title="Share on LINE">
                <IconButton onClick={() => shareToLine(shareImage.src)}>
                  <img
                    src="https://upload.wikimedia.org/wikipedia/commons/4/41/LINE_logo.svg"
                    alt="LINE"
                    width={32}
                    height={32}
                  />
                </IconButton>
              </Tooltip>

              <Tooltip title="Copy image URL">
                <IconButton onClick={() => copyLink(shareImage.src)} sx={{ color: "gray" }}>
                  <ContentCopyIcon fontSize="large" />
                </IconButton>
              </Tooltip>
            </>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setShareDialogOpen(false)}>Close</Button>
        </DialogActions>
      </Dialog>

      {/* Snackbar แจ้งว่า Copy แล้ว */}
      <Snackbar
        open={snackbarOpen}
        autoHideDuration={2000}
        onClose={() => setSnackbarOpen(false)}
        anchorOrigin={{ vertical: "bottom", horizontal: "center" }}
      >
        <Alert
          onClose={() => setSnackbarOpen(false)}
          severity="success"
          variant="filled"
          sx={{ width: "100%" }}
        >
          📋 Copied image link!
        </Alert>
      </Snackbar>
    </>
  );
};

export default Home;
