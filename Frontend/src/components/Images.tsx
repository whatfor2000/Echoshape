import { Typography, Button, IconButton, Box } from "@mui/material"; // เพิ่ม IconButton
import FavoriteIcon from "@mui/icons-material/Favorite"; // เพิ่ม Icon
import FavoriteBorderIcon from "@mui/icons-material/FavoriteBorder"; // เพิ่ม Icon
import React, { useRef, useState } from "react";

interface ImageProps {
  src: string;
  alt: string;
  title: string;
  width?: string | number;
  height?: string | number;
  fallbackSrc?: string;
  //blurred?: boolean;
}

const ImageComponent: React.FC<ImageProps> = ({ src, alt, title, width, height, fallbackSrc }) => {
  const dialogRef = useRef<HTMLDialogElement>(null);

  const openDialog = () => {
    if (dialogRef.current) {
      dialogRef.current.showModal();
    }
  };

  const closeDialog = (e: React.MouseEvent<HTMLDialogElement>) => {
    // ถ้าคลิกที่ dialog แต่ไม่ใช่ที่รูป ให้ปิด dialog
    if (e.target === dialogRef.current) {
      dialogRef.current?.close();
    }
  };

  const handleError = (e: React.SyntheticEvent<HTMLImageElement, Event>) => {
    // ใช้ fallbackSrc ถ้ามี หรือใช้ src เดิมหากไม่มี fallbackSrc
    e.currentTarget.src = fallbackSrc || ""; // ใช้ fallbackSrc หรือค่าเริ่มต้นเป็น string ว่าง
  };

  return (
    <div style={{ display: "flex", flexDirection: "column", alignItems: "center", padding: "20px", fontFamily: 'Bebas Neue', maxWidth: "100%" }}>
      <Typography variant="h6" sx={{ marginBottom: "1rem", fontWeight: 600, fontFamily: 'Bebas Neue', color: "#28378B" }}>
        {title}
      </Typography>

      <div style={{ position: 'relative', width: width || "100%" }}>
        <img
          src={src}
          alt={alt}
          onClick={openDialog} // คลิกเพื่อเปิดรูปขยาย
          onError={handleError}
          style={{
            width: "100%",
            height: height || "auto",
            objectFit: "cover",
            cursor: "pointer",
            transition: "0.3s ease",
            borderRadius: "8px",
          }}
        />
      </div>

      {/* Dialog แสดงภาพขยาย */}
      <dialog ref={dialogRef} onClick={closeDialog} style={{ border: "none", background: "rgba(0, 0, 0, 0.2)", padding: "20px" }}>
        <img
          src={src}
          alt={alt}
          style={{ maxWidth: "90vw", maxHeight: "90vh", borderRadius: "8px" }}
        />
      </dialog>
    </div>
  );
};

export default ImageComponent;