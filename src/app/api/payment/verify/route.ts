import { createClient } from '@/lib/supabase/server';
import crypto from 'crypto';
import { Resend } from 'resend';
import { CartItem } from '@/context/cart-context';

const resend = new Resend(process.env.RESEND_API_KEY);

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const {
      razorpay_order_id,
      razorpay_payment_id,
      razorpay_signature,
      user_email,
      user_name,
      phone,
      items,
      total_amount,
      location,
      address,
      city,
      state,
      zip,
    } = body;

    const generated_signature = crypto
      .createHmac('sha256', process.env.RAZORPAY_KEY_SECRET!)
      .update(`${razorpay_order_id}|${razorpay_payment_id}`)
      .digest('hex');

    const isValid = generated_signature === razorpay_signature;

    if (!isValid) {
      return new Response(JSON.stringify({ error: 'Invalid signature' }), {
        status: 400,
      });
    }

    const supabase = await createClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();

    const enrichedItems = items.map((item: CartItem) => {
      const subscription =
        typeof item.subscription === 'string'
          ? JSON.parse(item.subscription)
          : item.subscription;

      const fromDate = new Date(subscription.from);
      const toDate = new Date(subscription.to);

      const delivery_status = [];
      const currentDate = new Date(fromDate);

      while (currentDate <= toDate) {
        delivery_status.push({
          date: currentDate.toISOString().split('T')[0],
          status: 'scheduled',
          time: '7:00 AM - 9:00 AM',
        });
        currentDate.setDate(currentDate.getDate() + 1);
      }

      return {
        ...item,
        delivery_status,
      };
    });

    // Insert into orders and get the inserted row (with order ID)
    const { data: orderInsert, error: orderError } = await supabase
      .from('orders')
      .insert([
        {
          user_id: user?.id,
          user_email,
          user_name,
          phone,
          items: enrichedItems,
          total_amount,
          razorpay_order_id,
          razorpay_payment_id,
          razorpay_signature,
          location,
          address,
          city,
          state,
          zip,
          status: 'paid',
        },
      ])
      .select()
      .single();

    if (orderError) {
      return new Response(JSON.stringify({ error: orderError }), { status: 500 });
    }

    const orderId = orderInsert.id;

    const deliveries = enrichedItems.map((item: any) => {
      const subscription =
        typeof item.subscription === 'string'
          ? JSON.parse(item.subscription)
          : item.subscription;

      return {
        product_id: item.product_id,
        user_id: user?.id,
        order_id: orderId,
        status: 'pending',
        from_date: subscription.from,
        to_date: subscription.to,
        quantity: item.quantity,
        deliverystatus: item.delivery_status, // ✅ This is now stored in delivery table
      };
    });

    const { error: deliveryError } = await supabase
      .from('delivery')
      .insert(deliveries);

    if (deliveryError) {
      console.error('Delivery insert error:', deliveryError);
      return new Response(JSON.stringify({ error: deliveryError }), { status: 500 });
    }

    await supabase.from('cart').delete().eq('user_id', user?.id);

    await resend.emails.send({
      from: 'Pure Farm <aswinko369@gmail.com>',
      to: user_email,
      subject: 'Order Confirmation',
      html: `<p>Thank you for your order, <b>${user_name}</b>!<br/>Your payment ID is <b>${razorpay_payment_id}</b>.</p>`,
    });

    return new Response(JSON.stringify({ success: true }), { status: 200 });
  } catch (err) {
    console.error('Error in verify handler:', err);
    return new Response(JSON.stringify({ error: 'Server error' }), {
      status: 500,
    });
  }
}
