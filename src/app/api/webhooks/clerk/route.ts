
// 'use server' should not be used in API route handlers (route.ts files)
import { Webhook } from 'svix';
import { headers } from 'next/headers';
import type { WebhookEvent, UserJSON } from '@clerk/nextjs/server';
import { adminDb } from '@/lib/firebase-admin';
import { NextResponse } from 'next/server';

// Make sure to set CLERK_WEBHOOK_SECRET in your .env file
const webhookSecret = process.env.CLERK_WEBHOOK_SECRET || '';

async function handler(request: Request) {
  if (!webhookSecret) {
    console.error('CLERK_WEBHOOK_SECRET is not set.');
    return NextResponse.json({ error: 'Webhook secret not configured.' }, { status: 500 });
  }
  if (!adminDb) {
    console.error('Firestore adminDb is not initialized. Skipping webhook processing.');
    return NextResponse.json({ error: 'Firestore adminDb not initialized.' }, { status: 500 });
  }

  const payload = await request.json();
  const headersList = headers();
  const heads = {
    'svix-id': headersList.get('svix-id'),
    'svix-timestamp': headersList.get('svix-timestamp'),
    'svix-signature': headersList.get('svix-signature'),
  };

  const wh = new Webhook(webhookSecret);
  let evt: WebhookEvent;

  try {
    evt = wh.verify(JSON.stringify(payload), heads as { [key: string]: string | string[] }) as WebhookEvent;
  } catch (err) {
    console.error('Webhook verification failed:', err);
    return NextResponse.json({ error: 'Invalid signature' }, { status: 400 });
  }

  const eventType = evt.type;
  const userData = evt.data as UserJSON;

  try {
    if (eventType === 'user.created' || eventType === 'user.updated') {
      const { id, first_name, last_name, email_addresses, image_url, created_at, updated_at } = userData;
      
      const primaryEmail = email_addresses?.find(email => email.id === userData.primary_email_address_id)?.email_address || email_addresses?.[0]?.email_address;

      const userDocRef = adminDb.collection('users').doc(id);
      const userProfileData = {
        clerkId: id,
        firstName: first_name || null,
        lastName: last_name || null,
        email: primaryEmail || null,
        imageUrl: image_url || null,
        createdAt: new Date(created_at).toISOString(),
        updatedAt: new Date(updated_at).toISOString(),
      };

      if (eventType === 'user.created') {
        await userDocRef.set(userProfileData);
        console.log(`User ${id} created in Firestore.`);
      } else if (eventType === 'user.updated') {
        await userDocRef.update(userProfileData);
        console.log(`User ${id} updated in Firestore.`);
      }
    } else if (eventType === 'user.deleted') {
      const { id } = userData;
      if (id) {
        await adminDb.collection('users').doc(id).delete();
        console.log(`User ${id} deleted from Firestore.`);
      }
    }
    return NextResponse.json({ success: true }, { status: 200 });
  } catch (error) {
    console.error('Error processing webhook event:', error);
    const errorMessage = error instanceof Error ? error.message : 'Unknown error occurred';
    return NextResponse.json({ error: `Webhook handler failed: ${errorMessage}` }, { status: 500 });
  }
}

export const GET = handler;
export const POST = handler;
export const PUT = handler;
