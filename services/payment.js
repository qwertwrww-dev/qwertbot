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
        cancel_url: cancelUrl,
        ipn_callback_url: "https://qwertbot-production.up.railway.app/nowpayments-webhook"
      },
      {
        headers: {
          "x-api-key": process.env.NOWPAYMENTS_API_KEY,
          "Content-Type": "application/json"
        }
      }
    );


    console.log(
      "NOWPAYMENTS RESPONSE:",
      response.data
    );


    return response.data;


  } catch (err) {

    console.log(
      "NOWPAYMENTS ERROR:",
      JSON.stringify(
        err.response?.data || err.message,
        null,
        2
      )
    );

    throw err;

  }

}


module.exports = {
  createPayment
};
