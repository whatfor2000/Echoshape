import { Typography, Button } from "@mui/material"; 
import React, { useRef, useState } from "react"; 

interface ImageProps {
  src: string;
  alt: string;
  title: string;
  width?: string | number;
  height?: string | number;
  fallbackSrc?: string;
}

const ImageComponent: React.FC<ImageProps> = ({ src, alt, title, width, height, fallbackSrc }) => {
  const dialogRef = useRef<HTMLDialogElement>(null);
  
  const [isAnonymous, setIsAnonymous] = useState(false);

  const openDialog = () => {
    if (dialogRef.current) {
      dialogRef.current.showModal();
    }
  };

  const closeDialog = (e: React.MouseEvent<HTMLDialogElement>) => {
    
    if (e.target === dialogRef.current) {
      dialogRef.current?.close();
    }
  };

  const handleError = (e: React.SyntheticEvent<HTMLImageElement, Event>) => {
    
    e.currentTarget.src = fallbackSrc || ""; 
  };

  
  const toggleAnonymous = () => {
    setIsAnonymous((prev) => !prev);
  };

  return (
    <div style={{ display: "flex", flexDirection: "column", alignItems: "center", padding: "20px", fontFamily: 'Bebas Neue', maxWidth: "100%" }}>
      
      {/* ส่วนหัว: Title และปุ่ม Anonymous */}
      <div style={{ display: "flex", alignItems: "center", marginBottom: "1rem", maxWidth: "100%", padding: "0 10px" }}>
        
        {/* 3. แสดง Title ตามสถานะ isAnonymous */}
        <Typography 
          variant="h6" 
          sx={{ 
            fontWeight: 600, 
            fontFamily: 'Bebas Neue', 
            color: "#28378B",
            margin: 0,
            marginRight: "10px", 
            whiteSpace: "nowrap", 
            overflow: "hidden",
            textOverflow: "ellipsis",
          }}
        >
          {isAnonymous ? "Anonymous" : title}
        </Typography>
        
        {/* ปุ่มสลับโหมด Anonymous */}
        <Button 
          onClick={toggleAnonymous}
          variant="outlined" 
          size="small"
          sx={{ 
            minWidth: 'auto', 
            padding: '3px 8px', 
            fontSize: '0.75rem' 
          }}
        >
          {isAnonymous ? "Show Name" : "Go Anonymous"}
        </Button>
      </div>

      <img
        src={src}
        alt={alt}
        onClick={openDialog} 
        onError={handleError}
        style={{
          width: width ? width : "100%",
          height: height ? height : "auto",
          objectFit: "cover",
          cursor: "pointer", 
        }}
      />
      
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