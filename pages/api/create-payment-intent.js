import Stripe from 'stripe';

// Use your Stripe secret key from environment variables
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

export default async function handler(req, res) {
  if (req.method === 'POST') {
    try {
      const { amount, bookingDetails } = req.body;

      // Validate amount
      if (!amount || amount < 50) {
        return res.status(400).json({ error: 'Invalid amount' });
      }

      // Create PaymentIntent for inline payments
      const paymentIntent = await stripe.paymentIntents.create({
        amount,
        currency: 'usd',
        automatic_payment_methods: { enabled: true },
        metadata: bookingDetails || {}
      });

      // Send the client secret to the frontend
      return res.status(200).json({ clientSecret: paymentIntent.client_secret });

    } catch (err) {
      console.error('Stripe PaymentIntent error:', err);
      return res.status(500).json({ error: err.message });
    }
  } else {
    res.setHeader('Allow', 'POST');
    res.status(405).end('Method Not Allowed');
  }
}
