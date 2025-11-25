import React, { useEffect, useState } from 'react';
import {
  Box, Typography, Avatar, Paper,
  LinearProgress, Grid, Button // <<-- Import Button
} from '@mui/material';
import Cookies from 'js-cookie';
import ImageDialog from '../components/ImageDialog';

// ... (Interface และโค้ดส่วนอื่นๆ คงเดิม)

const ProfilePage: React.FC = () => {
  const [user, setUser] = useState<UserProfile | null>(null);
  const [images, setImages] = useState<ImageData[]>([]);
  const [likes, setLikes] = useState<{ [key: string]: boolean }>({});
  const [loading, setLoading] = useState(true);

  // Modal state
  const [openModal, setOpenModal] = useState(false);
  const [selectedImage, setSelectedImage] = useState<ImageData | null>(null);
  
  // 1. สถานะ Anonymous Toggle
  const [isAnonymous, setIsAnonymous] = useState(false);

  // ... (โค้ด useEffect, toggleLike, deleteImage คงเดิม)

  // ฟังก์ชันสำหรับสลับสถานะ Anonymous
  const toggleAnonymous = () => {
    setIsAnonymous(prev => !prev);
  };

  // ... (โค้ด return)
  return (
    <Box sx={{ padding: '2rem', maxWidth: '1000px', margin: '0 auto', color: '#fff' }}>
      {/* Profile Info */}
      <Paper sx={{ padding: 3, borderRadius: 2, backgroundColor: 'rgba(255,255,255,0.1)', mb: 4 }}>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
          <Avatar src={user.picture || undefined} sx={{ width: 80, height: 80 }} />
          <Box>
            <Typography variant="h5">{user.username}</Typography>
            <Typography variant="body2" color="grey.300">{user.email}</Typography>
            <Typography variant="body2" color="grey.300">
              Subscription: {user.subscriptionStatus || 'Free'}
            </Typography>
            {user.nextBillingAt && (
              <Typography variant="body2" color="grey.300">
                Next Billing: {new Date(user.nextBillingAt).toLocaleDateString()}
              </Typography>
            )}
          </Box>
        </Box>
        <Box sx={{ mt: 3, display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end' }}>
          <Box sx={{ flexGrow: 1, mr: 2 }}>
            <Typography variant="body2">Images generated this month: {user.usedThisMonth} / {user.maxGenerate}</Typography>
            <LinearProgress variant="determinate" value={progress} sx={{ height: 10, borderRadius: 5, mt: 1 }} />
          </Box>

          {/* 2. ปุ่ม Anonymous Toggle (Global setting สำหรับ ImageDialog) */}
          <Button 
            variant="outlined" 
            onClick={toggleAnonymous}
            sx={{ 
              color: isAnonymous ? 'red' : 'green', 
              borderColor: isAnonymous ? 'red' : 'green',
            }}
          >
            {isAnonymous ? 'Show Name (Dialog)' : 'Go Anonymous (Dialog)'}
          </Button>
        </Box>
      </Paper>
{/* ... (Image History Grid คงเดิม) */}
    {/* 3. ส่งสถานะ isAnonymous ไปยัง ImageDialog */}
    <ImageDialog
      selectedImage={selectedImage}
      setSelectedImage={setSelectedImage}
      likes={likes}
      toggleLike={toggleLike}
      deleteImage={deleteImage}
      isAnonymous={isAnonymous} // <<-- ส่ง prop นี้ไป
      creatorUsername={user.username} // <<-- ส่งชื่อผู้สร้างไป
    />
    </Box>
  );
};

export default ProfilePage;