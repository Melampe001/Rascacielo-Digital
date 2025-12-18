import { headers } from 'next/headers';
import { NextResponse } from 'next/server';
import Stripe from 'stripe';
import { db } from '@/lib/db/drizzle';
import { subscriptions, invoices } from '@/lib/db/schema';
import { eq } from 'drizzle-orm';

function getStripe() {
  if (!process.env.STRIPE_SECRET_KEY) {
    throw new Error('STRIPE_SECRET_KEY is not configured');
  }
  return new Stripe(process.env.STRIPE_SECRET_KEY, {
    apiVersion: '2025-02-24.acacia'
  });
}

const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET || '';

export async function POST(req: Request) {
  const stripe = getStripe();

  const body = await req.text();
  const headersList = await headers();
  const signature = headersList.get('stripe-signature')!;

  let event: Stripe.Event;

  try {
    event = stripe.webhooks.constructEvent(body, signature, webhookSecret);
  } catch (err: unknown) {
    const errorMessage = err instanceof Error ? err.message : 'Unknown error';
    console.error(`❌ Webhook signature verification failed: ${errorMessage}`);
    return NextResponse.json({ error: errorMessage }, { status: 400 });
  }

  console.log(`✅ Received event: ${event.type}`);

  switch (event.type) {
    case 'customer.subscription.created':
    case 'customer.subscription.updated':
      await handleSubscriptionUpdate(event.data.object as Stripe.Subscription);
      break;

    case 'customer.subscription.deleted':
      await handleSubscriptionDeleted(event.data.object as Stripe.Subscription);
      break;

    case 'invoice.paid':
      await handleInvoicePaid(event.data.object as Stripe.Invoice);
      break;

    case 'invoice.payment_failed':
      await handleInvoicePaymentFailed(event.data.object as Stripe.Invoice);
      break;
  }

  return NextResponse.json({ received: true });
}

async function handleSubscriptionUpdate(subscription: Stripe.Subscription) {
  // TODO: Map Stripe customer ID to user ID from your database
  // For now, this is a placeholder. In production, you'd query the users table
  // to find the userId based on subscription.customer
  const userId = '00000000-0000-0000-0000-000000000000'; // Placeholder

  await db
    .insert(subscriptions)
    .values({
      userId,
      stripeSubscriptionId: subscription.id,
      stripeCustomerId: subscription.customer as string,
      stripePriceId: subscription.items.data[0].price.id,
      status: subscription.status,
      currentPeriodStart: new Date(subscription.current_period_start * 1000),
      currentPeriodEnd: new Date(subscription.current_period_end * 1000),
      cancelAtPeriodEnd: subscription.cancel_at_period_end
    })
    .onConflictDoUpdate({
      target: subscriptions.stripeSubscriptionId,
      set: {
        status: subscription.status,
        stripePriceId: subscription.items.data[0].price.id,
        currentPeriodStart: new Date(subscription.current_period_start * 1000),
        currentPeriodEnd: new Date(subscription.current_period_end * 1000),
        cancelAtPeriodEnd: subscription.cancel_at_period_end,
        updatedAt: new Date()
      }
    });
}

async function handleSubscriptionDeleted(subscription: Stripe.Subscription) {
  await db
    .update(subscriptions)
    .set({ status: 'canceled', updatedAt: new Date() })
    .where(eq(subscriptions.stripeSubscriptionId, subscription.id));
}

async function handleInvoicePaid(invoice: Stripe.Invoice) {
  // TODO: Map Stripe customer to userId
  const userId = '00000000-0000-0000-0000-000000000000'; // Placeholder

  await db.insert(invoices).values({
    userId,
    stripeInvoiceId: invoice.id,
    amount: invoice.amount_paid,
    currency: invoice.currency,
    status: 'paid',
    paidAt: new Date()
  });
}

async function handleInvoicePaymentFailed(invoice: Stripe.Invoice) {
  console.error(`❌ Payment failed for invoice ${invoice.id}`);
  // Notify user, retry logic, etc.
}
