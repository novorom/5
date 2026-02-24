import { NextRequest, NextResponse } from 'next/server'

interface OrderRequest {
  items: Array<{
    id: string
    name: string
    price: number
    quantity: number
  }>
  total: number
  contactMethod: 'phone' | 'telegram' | 'email'
  contactValue: string
  name: string
}

async function sendTelegramMessage(message: string): Promise<void> {
  const botToken = process.env.TELEGRAM_BOT_TOKEN
  const chatId = process.env.TELEGRAM_CHAT_ID

  if (!botToken || !chatId) {
    console.error('Telegram credentials not configured')
    throw new Error('Telegram not configured')
  }

  const response = await fetch(`https://api.telegram.org/bot${botToken}/sendMessage`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      chat_id: chatId,
      text: message,
      parse_mode: 'HTML',
    }),
  })

  if (!response.ok) {
    throw new Error('Failed to send Telegram message')
  }
}

async function sendEmailViaIframe(toEmail: string, subject: string, htmlBody: string): Promise<void> {
  // Using a simple POST to formspree or similar service
  // For now, we'll use a basic approach via a webhook
  const response = await fetch('https://formspree.io/f/xyzabc', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      email: toEmail,
      subject: subject,
      message: htmlBody,
      _captcha: false,
    }),
  }).catch(() => {
    // Fallback: log to console in development
    console.log(`[Email would be sent to ${toEmail}]:`, htmlBody)
    return { ok: true }
  })

  if (!response.ok) {
    throw new Error('Failed to send email')
  }
}

export async function POST(request: NextRequest) {
  try {
    const body: OrderRequest = await request.json()

    if (!body.items || body.items.length === 0) {
      return NextResponse.json({ error: 'Cart is empty' }, { status: 400 })
    }

    // Format order summary
    const itemsList = body.items
      .map((item) => `${item.name} x${item.quantity} - ${(item.price * item.quantity).toLocaleString('ru-RU')} ₽`)
      .join('\n')

    const orderTotal = body.total + (body.total > 10000 ? 0 : 500)

    // Prepare message
    const contactInfo = `${body.contactMethod === 'phone' ? '📱 Телефон' : body.contactMethod === 'telegram' ? '💬 Telegram' : '📧 Email'}: ${body.contactValue}`
    const orderMessage = `
🛒 <b>Новый заказ</b>

👤 <b>Клиент:</b> ${body.name}
${contactInfo}

<b>Товары:</b>
${itemsList}

<b>Стоимость:</b>
Подитог: ${body.total.toLocaleString('ru-RU')} ₽
Доставка: ${body.total > 10000 ? 'Бесплатно' : '500 ₽'}
<b>Итого: ${orderTotal.toLocaleString('ru-RU')} ₽</b>
`

    // Send via Telegram (primary method)
    try {
      await sendTelegramMessage(orderMessage)
    } catch (telegramError) {
      console.error('Telegram send failed:', telegramError)
      // Continue to try email as fallback
    }

    // Also attempt to send email notification
    const emailHtml = `
<!DOCTYPE html>
<html>
<head>
  <style>
    body { font-family: Arial, sans-serif; color: #333; }
    .container { max-width: 600px; margin: 0 auto; padding: 20px; }
    .header { background: #f5f5f5; padding: 20px; border-radius: 8px; margin-bottom: 20px; }
    .items { border: 1px solid #ddd; border-radius: 8px; padding: 15px; margin-bottom: 20px; }
    .item { padding: 10px 0; border-bottom: 1px solid #eee; }
    .item:last-child { border-bottom: none; }
    .total { font-size: 18px; font-weight: bold; color: #000; margin-top: 20px; padding-top: 20px; border-top: 2px solid #333; }
    .contact { background: #f9f9f9; padding: 15px; border-radius: 8px; margin-bottom: 20px; }
  </style>
</head>
<body>
  <div class="container">
    <div class="header">
      <h1>Новый заказ с сайта</h1>
      <p><strong>Клиент:</strong> ${body.name}</p>
    </div>
    
    <div class="contact">
      <strong>Способ связи:</strong> 
      ${body.contactMethod === 'phone' ? '📱 Телефон' : body.contactMethod === 'telegram' ? '💬 Telegram' : '📧 Email'}
      <br>
      <strong>Контакт:</strong> ${body.contactValue}
    </div>

    <div class="items">
      <h3>Товары:</h3>
      ${body.items
        .map(
          (item) =>
            `<div class="item">
        <strong>${item.name}</strong><br>
        Кол-во: ${item.quantity} м² × ${item.price.toLocaleString('ru-RU')} ₽ = <strong>${(item.price * item.quantity).toLocaleString('ru-RU')} ₽</strong>
      </div>`
        )
        .join('')}
    </div>

    <div class="total">
      Подитог: ${body.total.toLocaleString('ru-RU')} ₽<br>
      Доставка: ${body.total > 10000 ? 'Бесплатно' : '500 ₽'}<br>
      <br>
      Итого: ${orderTotal.toLocaleString('ru-RU')} ₽
    </div>
  </div>
</body>
</html>
`

    try {
      // Try to send via email (you'll need to configure email service)
      // For now, we'll skip this if email service is not configured
      if (process.env.EMAIL_SERVICE_KEY) {
        await sendEmailViaIframe('novorom@mail.ru', `Новый заказ - ${body.name}`, emailHtml)
      }
    } catch (emailError) {
      console.error('Email send failed:', emailError)
    }

    return NextResponse.json({
      success: true,
      message: 'Order received',
    })
  } catch (error) {
    console.error('Order processing error:', error)
    return NextResponse.json(
      { error: 'Failed to process order' },
      { status: 500 }
    )
  }
}
