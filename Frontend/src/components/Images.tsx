import { Typography, Button, IconButton } from "@mui/material"; // เพิ่ม IconButton
import FavoriteIcon from "@mui/icons-material/Favorite"; // เพิ่ม Icon
import FavoriteBorderIcon from "@mui/icons-material/FavoriteBorder"; // เพิ่ม Icon
import React, { useRef, useState } from "react"; 

interface ImageProps {
  src: string;
  alt: string;
  title: string; // ชื่อภาพ
  ownerName: string; // <<< เพิ่ม prop ชื่อเจ้าของภาพจริงๆ
  width?: string | number;
  height?: string | number;
  fallbackSrc?: string;
}

const ImageComponent: React.FC<ImageProps> = ({ src, alt, title, ownerName, width, height, fallbackSrc }) => { // <<< รับ ownerName
  const dialogRef = useRef<HTMLDialogElement>(null);
  
  const [isAnonymous, setIsAnonymous] = useState(false);
  const [isLiked, setIsLiked] = useState(false); // สถานะ Like ของรูปภาพ

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
  
  // ฟังก์ชันสำหรับ toggle Like
  const toggleLike = () => {
    setIsLiked((prev) => !prev);
    // ในโค้ดจริง คุณจะเรียก API เพื่อบันทึก Like ตรงนี้
  };

  // ชื่อเจ้าของภาพที่จะแสดงผล
  const displayedOwnerName = isAnonymous ? "Anonymous Creator" : ownerName; // <<< ใช้ ownerName แทน title


  return (
    <div style={{ display: "flex", flexDirection: "column", alignItems: "center", padding: "20px", fontFamily: 'Bebas Neue', maxWidth: "100%" }}>
      
      {/* ส่วนหัว: Title */}
      <div style={{ display: "flex", alignItems: "center", marginBottom: "1rem", maxWidth: "100%", padding: "0 10px" }}>
        
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
          {/* ชื่อภาพ */}
          {title} 
        </Typography>

        {/* ปุ่ม Anonymous Toggle - ย้ายมาใกล้กับ Like/Owner */}
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
      
      {/* 🌟 ส่วน Like และแสดงชื่อเจ้าของภาพ (ใหม่) */}
      <div style={{ display: "flex", alignItems: "center", marginTop: "10px", width: "100%", justifyContent: "space-between" /* เปลี่ยนเป็น space-between */ }}>
          <Box sx={{ display: 'flex', alignItems: 'center' }}>
            <IconButton onClick={toggleLike} color="primary">
                {isLiked ? <FavoriteIcon color="error" /> : <FavoriteBorderIcon />}
            </IconButton>
            
            {/* แสดงชื่อเจ้าของภาพ */}
            <Typography variant="body1" sx={{ marginLeft: "10px" }}>
                Owner: <span style={{ fontWeight: 'bold', color: isAnonymous ? '#9e9e9e' : '#28378B' }}>
                    {displayedOwnerName}
                </span>
            </Typography>
          </Box>
          
          {/* ปุ่ม Anonymous สำหรับภาพนี้ */}
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
            {isAnonymous ? "Show Name" : "Hide Name"}
          </Button>

      </div>

      {/* Dialog แสดงภาพขยาย */}
      <dialog ref={dialogRef} onClick={closeDialog} style={{ border: "none", background: "rgba(0, 0, 0, 0.2)", padding: "20px" }}>
        <img
          src={src}
          alt={alt}
          style={{ maxWidth: "90vw", maxHeight: "90vh", borderRadius: "8px" }}
        />
        {/* อาจจะเพิ่มชื่อเจ้าของภาพใน Dialog นี้ด้วยก็ได้ */}
        <Typography variant="caption" sx={{ color: 'white', display: 'block', textAlign: 'center', marginTop: '10px' }}>
            Owner: {displayedOwnerName}
        </Typography>
      </dialog>
    </div>
  );
};

export default ImageComponent;