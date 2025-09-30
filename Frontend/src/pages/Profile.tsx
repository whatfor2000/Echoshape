import React, { useEffect, useState } from 'react';
import { Box, Typography, Avatar, Paper, LinearProgress } from '@mui/material';
import Cookies from 'js-cookie';

interface UserProfile {
  id: string;
  email: string | null;
  username: string;
  provider: string | null;
  picture: string | null;
  subscriptionStatus: string | null;
  planId: string | null;
  nextBillingAt: Date | null;
  usedThisMonth: number;
  maxGenerate: number; // สามารถกำหนดจาก planId
}

const UserProfilePage: React.FC = () => {
  const [user, setUser] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchUser() {
      try {
        const res = await fetch('http://localhost:3000/users/profile', {
            headers: {
            'Authorization': `Bearer ${Cookies.get('access_token')}`,
            },
            credentials: 'include',
        });
        if (!res.ok) throw new Error('Failed to fetch user');
        const data = await res.json();
        setUser({
          ...data,
          maxGenerate: data.planId === 'subscription' ? 50 : 2, // Free 2, Subscription 50
        });
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    }
    fetchUser();
  }, []);

  if (loading) return <Typography sx={{ color: '#fff' }}>Loading...</Typography>;
  if (!user) return <Typography sx={{ color: '#fff' }}>No user data found.</Typography>;

  const progress = Math.min((user.usedThisMonth / user.maxGenerate) * 100, 100);

  return (
    <Box sx={{ padding: '2rem', maxWidth: '600px', margin: '0 auto', color: '#fff' }}>
      <Paper sx={{ padding: 3, borderRadius: 2, backgroundColor: 'rgba(255,255,255,0.1)' }}>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
          <Avatar src={user.picture || undefined} sx={{ width: 80, height: 80 }} />
          <Box>
            <Typography variant="h5" color='white'>{user.username}</Typography>
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

        <Box sx={{ mt: 4 }}>
          <Typography variant="body2" color='white'>Images generated this month: {user.usedThisMonth} / {user.maxGenerate}</Typography>
          <LinearProgress variant="determinate" value={progress} sx={{ height: 10, borderRadius: 5, mt: 1 }} />
        </Box>
      </Paper>
    </Box>
  );
};

export default UserProfilePage;
