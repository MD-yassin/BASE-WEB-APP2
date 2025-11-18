export async function POST(request) {
  try {
    const body = await request.json();
    const { payerPhone, recipientPhone, amount, bundle } = body;

    if (!payerPhone || !recipientPhone || !amount) {
      return new Response(JSON.stringify({ success: false, error: "Missing fields" }), { status: 400 });
    }

    // env variables
    const shortCode = process.env.MPESA_SHORTCODE;
    const passKey = process.env.MPESA_PASSKEY;
    const consumerKey = process.env.MPESA_CONSUMER_KEY;
    const consumerSecret = process.env.MPESA_CONSUMER_SECRET;
    const callbackUrl = process.env.MPESA_CALLBACK_URL; // must be public for Daraja

    if (!shortCode || !passKey || !consumerKey || !consumerSecret || !callbackUrl) {
      return new Response(JSON.stringify({ success: false, error: "Missing MPESA env variables" }), { status: 500 });
    }

    // timestamp and password
    const timestamp = new Date().toISOString().replace(/[-:T.Z]/g, "").slice(0, 14);
    const password = Buffer.from(shortCode + passKey + timestamp).toString("base64");

    // helper to normalize numbers to 254... format
    const normalize = (num) => {
      if (!num) return "";
      let s = String(num).trim();
      s = s.replace(/\s+/g, "");
      // remove leading + if present
      if (s.startsWith("+")) s = s.slice(1);
      // if starts with 0 replace with 254
      if (/^0\d+/.test(s)) s = "254" + s.slice(1);
      // if starts with 7xxxx (no 0) assume missing leading 0 -> add 254
      if (/^7\d{8}$/.test(s)) s = "254" + s;
      // if already 254... leave as is
      return s;
    };

    const payer = normalize(payerPhone);
    const recipient = normalize(recipientPhone);

    // 1) GET ACCESS TOKEN
    const tokenRes = await fetch(
      "https://api.safaricom.co.ke/oauth/v1/generate?grant_type=client_credentials",
      {
        headers: {
          Authorization:
            "Basic " +
            Buffer.from(`${consumerKey}:${consumerSecret}`).toString("base64"),
        },
      }
    );
    const tokenData = await tokenRes.json();
    const accessToken = tokenData?.access_token;
    if (!accessToken) {
      return new Response(JSON.stringify({ success: false, error: "Failed to get access token", details: tokenData }), { status: 500 });
    }

    // 2) STK PUSH
    const stkBody = {
      BusinessShortCode: shortCode,
      Password: password,
      Timestamp: timestamp,
      TransactionType: "CustomerPayBillOnline",
      Amount: amount,
      PartyA: payer,           // payer (who will get MPESA prompt)
      PartyB: shortCode,      // your paybill/till
      PhoneNumber: payer,     // phone to receive the MPESA prompt (same as payer)
      CallBackURL: callbackUrl,
      AccountReference: `BingwaSokoni:${recipient}`, // include recipient so callback knows who to top up
      TransactionDesc: bundle || "Bingwa Sokoni bundle purchase"
    };

    const stkRes = await fetch("https://api.safaricom.co.ke/mpesa/stkpush/v1/processrequest", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${accessToken}`,
        "Content-Type": "application/json"
      },
      body: JSON.stringify(stkBody)
    });

    const stkData = await stkRes.json();

    // Return whatever daraja returns for frontend logging; save to DB in production
    if (stkData?.ResponseCode === "0" || stkData?.responseCode === "0") {
      // usually ResponseCode === "0" means request accepted
      return new Response(JSON.stringify({
        success: true,
        message: "STK push initiated",
        checkoutRequestID: stkData.CheckoutRequestID || stkData.checkoutRequestId || null,
        daraja: stkData
      }), { status: 200 });
    } else {
      return new Response(JSON.stringify({
        success: false,
        error: stkData?.errorMessage || stkData?.Message || "STK push failed",
        daraja: stkData
      }), { status: 400 });
    }

  } catch (err) {
    return new Response(JSON.stringify({ success: false, error: err.message }), { status: 500 });
  }
}
