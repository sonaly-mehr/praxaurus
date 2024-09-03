import { stripe } from "../../../../lib/stripe";
import User from "../../../../models/user";
import Subscription from "../../../../models/subscription";

export async function POST(req) {
  const headers = {
    'Access-Control-Allow-Origin': 'https://praxaurus.vercel.app', // Replace with your frontend domain
    'Access-Control-Allow-Methods': 'GET, POST',
    'Access-Control-Allow-Headers': 'Content-Type, Authorization',
  };

  const buf = await req.arrayBuffer();
  const body = Buffer.from(buf);
  const sig = req.headers.get("stripe-signature");
  const WEBHOOK_SECRET = process.env.STRIPE_WEBHOOK_SECRET;

  let event;

  try {
    event = stripe.webhooks.constructEvent(body, sig, WEBHOOK_SECRET);
  } catch (err) {
    console.error("Webhook signature verification failed.", err.message);
    return new Response(`Webhook Error: ${err.message}`, { status: 400 });
  }

  try {
    switch (event.type) {
      case "checkout.session.completed":
        const session = await stripe.checkout.sessions.retrieve(
          event.data.object.id,
          { expand: ["line_items"] }
        );
        const customerId = session.customer;
        const customerDetails = session.customer_details;

        if (customerDetails?.email) {
          let user = await User.findOne({ email: customerDetails.email });

          if (!user) throw new Error("User not found");

          if (!user.customerId) {
            user.customerId = customerId;
            await user.save();
          }

          const lineItems = session.line_items?.data || [];

          for (const item of lineItems) {
            const priceId = item.price?.id;
            const isSubscription = item.price?.type === "recurring";

            if (isSubscription) {
              let endDate = new Date();
              if (priceId === process.env.STRIPE_YEARLY_PRICE_ID) {
                endDate.setFullYear(endDate.getFullYear() + 1);
              } else if (priceId === process.env.STRIPE_HALF_YEARLY_PRICE_ID) {
                endDate.setMonth(endDate.getMonth() + 6);
              } else if (priceId === process.env.STRIPE_MONTHLY_PRICE_ID) {
                endDate.setMonth(endDate.getMonth() + 1);
              } else {
                throw new Error("Invalid priceId");
              }

              await Subscription.findOneAndUpdate(
                { userId: user._id },
                {
                  userId: user._id,
                  startDate: new Date(),
                  endDate,
                  plan: "premium",
                  period:
                    priceId === process.env.STRIPE_YEARLY_PRICE_ID
                      ? "yearly"
                      : priceId === process.env.STRIPE_HALF_YEARLY_PRICE_ID
                      ? "half-yearly"
                      : "monthly",
                },
                { upsert: true, new: true }
              );

              user.plan = "premium";
              await user.save();
            }
          }
        }
        break;

      case "customer.subscription.deleted":
        const subscription = await stripe.subscriptions.retrieve(
          event.data.object.id
        );
        const user = await User.findOne({ customerId: subscription.customer });

        if (user) {
          user.plan = "free";
          await user.save();
        } else {
          console.error("User not found for the subscription deleted event.");
          throw new Error("User not found for the subscription deleted event.");
        }
        break;

      default:
        console.log(`Unhandled event type ${event.type}`);
    }
  } catch (error) {
    console.error("Error handling event", error);
    return new Response("Webhook Error", { status: 400 });
  }

  return new Response("Webhook received", { status: 200 });
}

export async function OPTIONS(req) {
  return new Response(null, {
    status: 204,
    headers: {
      'Access-Control-Allow-Origin': 'https://praxaurus.vercel.app',
      'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type, Authorization',
    },
  });
}