import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { getBody } from "~/libs/server";
import { stripe } from "~/libs/stripe";

const createKitchenSchema = z.object({
  name: z.string().min(1).max(50),
  slug: z
    .string()
    .min(1)
    .max(50)
    .regex(/^[a-z0-9-]+$/),
  description: z.string().max(255).optional(),
  image: z.string().url().optional(),
  website: z.string().url().optional(),
  location: z.string().max(100).optional(),
  email: z.string().email(),
});

export async function POST(req: NextRequest) {
  try {
    const parsed = await getBody(req, createKitchenSchema);
    if (!parsed.data) return parsed.response;

    const { name, slug, description, image, website, location, email } =
      parsed.data;

    const checkoutSession = await stripe.checkout.sessions.create({
      mode: "subscription",
      payment_method_types: ["card"],
      customer_email: email,
      line_items: [
        {
          price: process.env.STRIPE_BASE_PLAN_PRICE_ID, // $5 base subscription
          quantity: 1,
        },
      ],
      success_url: `${process.env.BASE_URL}/${slug}?created=true`,
      cancel_url: `${process.env.BASE_URL}/kitchen/create`,
      metadata: {
        name,
        slug,
        description: description || "",
        image: image || "",
        website: website || "",
        location: location || "",
        email,
      },
    });

    return NextResponse.json({ url: checkoutSession.url }, { status: 201 });
  } catch (error) {
    console.error("[Checkout Session Error]", error);
    return NextResponse.json({}, { status: 500 });
  }
}
