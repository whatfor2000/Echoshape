import React, { useState } from "react";
import Script from "react-load-script";
import {
  Box,
  Button,
  Card,
  CardContent,
  CardHeader,
  FormControl,
  Grid,
  TextField,
  Typography,
  ToggleButtonGroup,
  ToggleButton,
} from "@mui/material";


declare global {
  interface Window {
    Omise: any;
  }
}

interface SubscriptionFormProps {
  amount: number;
  planId: string;
}

const SubscriptionForm: React.FC<SubscriptionFormProps> = ({ amount, planId }) => {
  const [omiseLoaded, setOmiseLoaded] = useState(false);
  const [paymentMethod, setPaymentMethod] = useState<"card" | "promptpay">("card");
  const [qrUrl, setQrUrl] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const handleScriptLoad = () => {
    console.log("Omise.js loaded!");
    setOmiseLoaded(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (paymentMethod === "card") {
      if (!omiseLoaded || !window.Omise) {
        alert("Omise not ready yet, please wait...");
        return;
      }

      const card = {
        name: (document.getElementById("name") as HTMLInputElement).value,
        number: (document.getElementById("number") as HTMLInputElement).value,
        expiration_month: (document.getElementById("exp_month") as HTMLInputElement).value,
        expiration_year: (document.getElementById("exp_year") as HTMLInputElement).value,
        security_code: (document.getElementById("cvc") as HTMLInputElement).value,
      };

      window.Omise.createToken("card", card, (status: number, response: any) => {
        if (status === 200) {
          console.log("Card Token:", response.id);
          // TODO: ส่ง token ไป backend เพื่อสร้าง subscription
        } else {
          alert("Payment failed: " + response.message);
        }
      });
    } else if (paymentMethod === "promptpay") {
      setLoading(true);
      try {
        const res = await fetch("http://localhost:3000/omise/promptpay", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ amount }),
        });
        const data = await res.json();
        setQrUrl(data.promptpayUrl); // ดึง QR code URL จาก backend
      } catch (error: any) {
        alert("Error creating PromptPay charge: " + error.message);
      } finally {
        setLoading(false);
      }
    }
  };

  return (
    <Box sx={{ display: "flex", justifyContent: "center", mt: 6 }}>
      <Script url="https://cdn.omise.co/omise.js" onLoad={handleScriptLoad} />

      <Card sx={{ maxWidth: 480, width: "100%", p: 2, borderRadius: 3, boxShadow: 6 }}>
        <CardHeader
          title="ECHOSHAPE SUBSCRIPTION"
          subheader={`Subscribe for ${amount} THB`}
          titleTypographyProps={{ align: "center", fontWeight: "bold" }}
          subheaderTypographyProps={{ align: "center" }}
        />
        <CardContent>
          <Box textAlign="center" mb={3}>
            <Typography variant="body2" color="text.secondary">
              เลือกวิธีการชำระเงิน
            </Typography>
            <ToggleButtonGroup
              color="primary"
              value={paymentMethod}
              exclusive
              onChange={(_, val) => val && setPaymentMethod(val)}
              sx={{ mt: 1 }}
            >
              <ToggleButton value="card">บัตรเครดิต / เดบิต</ToggleButton>
              <ToggleButton value="promptpay">PromptPay</ToggleButton>
            </ToggleButtonGroup>
          </Box>

          <form onSubmit={handleSubmit}>
            {paymentMethod === "card" && (
              <Box>
                <FormControl fullWidth margin="normal">
                  <TextField id="name" label="Cardholder Name" required />
                </FormControl>
                <FormControl fullWidth margin="normal">
                  <TextField id="number" label="Card Number" required />
                </FormControl>
                <Grid container spacing={2}>
                  <Grid item xs={4}>
                    <TextField id="exp_month" label="MM" required />
                  </Grid>
                  <Grid item xs={4}>
                    <TextField id="exp_year" label="YY" required />
                  </Grid>
                  <Grid item xs={4}>
                    <TextField id="cvc" label="CVC" required />
                  </Grid>
                </Grid>
                <Button
                  type="submit"
                  variant="contained"
                  fullWidth
                  sx={{ mt: 3, py: 1.5, fontWeight: "bold" }}
                >
                  Subscribe {amount} THB
                </Button>
              </Box>
            )}

            {paymentMethod === "promptpay" && (
              <Box textAlign="center" my={3}>
                <Typography variant="body1" gutterBottom>
                  สแกน QR เพื่อชำระ {amount} THB
                </Typography>
                <Box
                  sx={{
                    width: 200,
                    height: 200,
                    borderRadius: 2,
                    mx: "auto",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    bgcolor: qrUrl ? "transparent" : "#eee",
                  }}
                >
                  {qrUrl ? (
                    <img src={qrUrl} alt="PromptPay QR" style={{ width: 200, height: 200 }} />
                  ) : loading ? (
                    <Typography variant="caption">กำลังสร้าง QR...</Typography>
                  ) : (
                    <Typography variant="caption" color="text.secondary">
                      QR CODE
                    </Typography>
                  )}
                </Box>
                <Button
                  type="submit"
                  variant="contained"
                  fullWidth
                  sx={{ mt: 3, py: 1.5, fontWeight: "bold" }}
                >
                  Generate QR
                </Button>
              </Box>
              
            )}
          </form>
        </CardContent>
      </Card>
    </Box>
  );
};

export default SubscriptionForm;
