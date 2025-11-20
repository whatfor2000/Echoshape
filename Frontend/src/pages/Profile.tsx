import React, { useEffect, useState } from 'react';
import {
  Box, Typography, Avatar, Paper,
  LinearProgress, Grid, Button // <<-- Import Button
} from '@mui/material';
import Cookies from 'js-cookie';
import ImageDialog from '../components/ImageDialog';

interface UserProfile {
  id: string;
  username: string;
  email: string | null;
  picture: string | null;
  planId: string | null;
  subscriptionStatus: string | null;
  nextBillingAt: string | null;
  usedThisMonth: number;
  maxGenerate: number;
}

interface ImageData {
  id: string;
  src: string;
  title: string;
  likes: { userId: string }[];
}

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

  const token = Cookies.get('access_token');

  useEffect(() => {
    async function fetchProfile() {
      try {
        const res = await fetch(`${import.meta.env.VITE_BACKEND_URL}/users/profile`, {
          headers: { Authorization: `Bearer ${token}` },
          credentials: 'include'
        });
        const data = await res.json();
        setUser({
          ...data,
          maxGenerate: data.planId === 'subscription' ? 50 : 2
        });
      } catch (err) {
        console.error(err);
      }
    }

    async function fetchImages() {
      try {
        const res = await fetch(`${import.meta.env.VITE_BACKEND_URL}/images/me`, {
          headers: { Authorization: `Bearer ${token}` },
          credentials: 'include'
        });
        const data = await res.json();
        setImages(data);

        const initialLikes: { [key: string]: boolean } = {};
        // ใช้ `data` ที่เพิ่ง fetch มา และ user id จาก state (อาจจะยังไม่ทันอัปเดต)
        // หรือใช้วิธีที่ดีกว่าคือการกำหนด likes หลังจากที่ profile ถูก fetch แล้ว
        // แต่ในโค้ดปัจจุบัน ให้ใช้ user?.id ที่มีอยู่แล้ว หรือปรับ logic การ fetch
        // (หมายเหตุ: การพึ่งพา user?.id ใน useEffect dependency array อาจทำให้เกิด warning)

      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    }

    fetchProfile().then(fetchImages);
  }, [token]); // ลบ user?.id ออกจาก dependency array เพื่อลดโอกาสเกิด infinite loop หรือ warning

    // อัปเดต likes หลังจาก user ถูก load แล้ว
    useEffect(() => {
        if (user && images.length > 0) {
            const initialLikes: { [key: string]: boolean } = {};
            images.forEach(img => {
                initialLikes[img.id] = img.likes.some(like => like.userId === user.id);
            });
            setLikes(initialLikes);
        }
    }, [user, images]);


  const toggleLike = async (imageId: string) => {
    if (!user?.id) return alert('You must login first!');

    try {
      const res = await fetch(`${import.meta.env.VITE_BACKEND_URL}/likes/toggle`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
        body: JSON.stringify({ userId: user.id, imageId })
      });
      const data = await res.json();
      setLikes(prev => ({ ...prev, [imageId]: data.liked }));
    } catch (err) {
      console.error(err);
    }
  };

  const deleteImage = async (imageId: string) => {
    if (!window.confirm('Are you sure you want to delete this image?')) return;
    try {
      await fetch(`${import.meta.env.VITE_BACKEND_URL}/images/${imageId}`, {
        method: 'DELETE',
        headers: { Authorization: `Bearer ${token}` },
      });
      setImages(prev => prev.filter(img => img.id !== imageId));
      if (selectedImage?.id === imageId) setSelectedImage(null); // ใช้ setSelectedImage(null) แทน setOpenModal(false)
    } catch (err) {
      console.error(err);
    }
  };

  // ฟังก์ชันสำหรับสลับสถานะ Anonymous
  const toggleAnonymous = () => {
    setIsAnonymous(prev => !prev);
  };

  if (loading) return <Typography sx={{ color: '#fff' }}>Loading...</Typography>;
  if (!user) return <Typography sx={{ color: '#fff' }}>No user data</Typography>;

  const progress = Math.min((user.usedThisMonth / user.maxGenerate) * 100, 100);

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

          {/* 2. ปุ่ม Anonymous Toggle */}
          <Button 
            variant="outlined" 
            onClick={toggleAnonymous}
            sx={{ 
              color: isAnonymous ? 'red' : 'green', 
              borderColor: isAnonymous ? 'red' : 'green',
            }}
          >
            {isAnonymous ? 'Show Name' : 'Go Anonymous'}
          </Button>
        </Box>
      </Paper>

      {/* Image History Grid */}
      <Typography variant="h6" sx={{ mb: 2 }}>History</Typography>
          <Grid container spacing={2}>
      {images.map(img => (
        <Grid item key={img.id} xs={12} sm={6} md={3}>
          <img
            src={img.src}
            alt={img.title}
            style={{ width: '100%', height: 'auto', display: 'block', cursor: "pointer", aspectRatio: '1/1', objectFit: 'cover' }}
            onClick={() => setSelectedImage(img)}
          />
        </Grid>
      ))}
    </Grid>

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