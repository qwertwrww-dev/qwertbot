const axios = require("axios");

const API_URL = "https://api.nowpayments.io/v1";

async function createPayment({
  priceAmount,
  priceCurrency,
  payCurrency,
  orderId,
  orderDescription,
  successUrl,
  cancelUrl
}) {
  try {
    const response = await axios.post(
      `${API_URL}/invoice`,
      {
        price_amount: priceAmount,
        price_currency: priceCurrency,
        pay_currency: payCurrency,
        order_id: orderId,
        order_description: orderDescription,
        success_url: successUrl,
        cancel_url: cancelUrl
      },
      {
        headers: {
          "x-api-key": process.env.NOWPAYMENTS_API_KEY,
          "Content-Type": "application/json"
        }
      }
    );

    return response.data;

  } catch (err) {
    console.error(err.response?.data || err.message);
    throw err;
  }
}

module.exports = {
  createPayment
};
