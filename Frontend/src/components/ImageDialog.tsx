import React, { useState } from "react";
import { Dialog, DialogContent, Box, Typography, IconButton } from "@mui/material";
import FavoriteIcon from "@mui/icons-material/Favorite";
import FavoriteBorderIcon from "@mui/icons-material/FavoriteBorder";
import DeleteIcon from "@mui/icons-material/Delete";

interface ImageData {
  id: string;
  title: string;
  src: string;
}

interface Props {
  selectedImage: ImageData | null;
  setSelectedImage: (img: ImageData | null) => void;
  likes: { [key: string]: boolean };
  toggleLike: (id: string) => void;
  deleteImage: (id: string) => void;
  // <<< เพิ่ม Props สำหรับ Anonymous Toggle
  isAnonymous: boolean;
  creatorUsername: string;
  // >>>
}

const ImageDialog: React.FC<Props> = ({ 
  selectedImage, 
  setSelectedImage, 
  likes, 
  toggleLike, 
  deleteImage,
  isAnonymous, // รับค่า isAnonymous
  creatorUsername // รับค่า creatorUsername
}) => {
  
  // กำหนดชื่อผู้สร้างที่จะแสดง (ใช้ Anonymous ถ้า isAnonymous เป็น true)
  const displayedCreator = isAnonymous ? "Anonymous User" : creatorUsername;

  return (
    <Dialog
      open={!!selectedImage}
      onClose={() => setSelectedImage(null)}
      maxWidth="lg"
      fullWidth
      PaperProps={{ sx: { backgroundColor: "#121212", p: 2 } }}
    >
      {selectedImage && (
        <DialogContent sx={{ p: 0 }}>
          {/* รูปเต็ม */}
          <img
            src={selectedImage.src}
            alt={selectedImage.title}
            style={{
              width: "100%",
              maxHeight: "80vh",
              objectFit: "contain",
              display: "block",
            }}
          />

          {/* Info & Actions */}
          <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", mt: 1, px: 1 }}>
            {/* ชื่อรูป (Title) */}
            <Box>
              <Typography variant="h6" color="white">
                {selectedImage.title}
              </Typography>
              {/* แสดงชื่อผู้สร้าง (Creator) */}
              <Typography variant="body2" color="grey.400">
                Creator: <span style={{ color: isAnonymous ? '#ff4081' : 'white', fontWeight: 'bold' }}>{displayedCreator}</span>
              </Typography>
            </Box>

            {/* Actions */}
            <Box>
              <IconButton
                onClick={() => toggleLike(selectedImage.id)}
                sx={{ color: likes[selectedImage.id] ? "red" : "white" }}
              >
                {likes[selectedImage.id] ? <FavoriteIcon /> : <FavoriteBorderIcon />}
              </IconButton>
              <IconButton
                onClick={() => {
                  deleteImage(selectedImage.id);
                  setSelectedImage(null); // ปิด Dialog หลังลบ
                }}
                sx={{ color: "white" }}
              >
                <DeleteIcon />
              </IconButton>
            </Box>
          </Box>
        </DialogContent>
      )}
    </Dialog>
  );
};

export default ImageDialog;