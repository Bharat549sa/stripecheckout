import Stripe from "stripe";
//this is for the envrionment variable here. for the secret key we have quesiton about. 

const stripeSecretKey = process.env.STRIPE_API_KEY;

if (!stripeSecretKey) {
  throw new Error("STRIPE_API_KEY is not set");
}

const stripe = new Stripe(stripeSecretKey);

export default stripe;
