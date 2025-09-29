//import React from 'react';
import { Container, Typography } from '@mui/material';
import SubscriptionForm from '../components/SubscriptionForm';

const SubscriptionPage = () => {
  return (
    <Container>
      <Typography variant="h4" textAlign="center" mt={4} mb={4} sx={{ fontFamily: 'Bebas Neue', fontWeight: 'bold' ,color: '#fff'}}>
        Echoshape Subscription
      </Typography>
      <SubscriptionForm planId="premium_299" amount={299} />
    </Container>
  );
};

export default SubscriptionPage;
