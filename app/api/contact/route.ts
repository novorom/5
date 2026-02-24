import { NextRequest, NextResponse } from 'next/server'

interface ContactRequest {
  name: string
  email: string
  phone: string
  message: string
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

export async function POST(request: NextRequest) {
  try {
    console.log('[v0] Contact API received POST request')
    
    const body: ContactRequest = await request.json()
    console.log('[v0] Contact data:', { name: body.name, email: body.email, phone: body.phone, messageLength: body.message?.length })

    if (!body.name || !body.email || !body.message) {
      console.log('[v0] Missing required fields')
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 })
    }

    // Prepare message
    const contactMessage = `📧 <b>НОВОЕ СООБЩЕНИЕ ИЗ ФОРМЫ ОБРАТНОЙ СВЯЗИ</b>

👤 <b>Имя:</b> ${body.name}
📧 <b>Email:</b> <code>${body.email}</code>
${body.phone ? `📱 <b>Телефон:</b> <code>${body.phone}</code>` : ''}

<b>💬 СООБЩЕНИЕ:</b>
${body.message}

<i>Сообщение поступило в ${new Date().toLocaleString('ru-RU')}</i>`

    console.log('[v0] Prepared message for Telegram')
    
    // Send to Telegram
    await sendTelegramMessage(contactMessage)
    console.log('[v0] Message sent to Telegram successfully')

    return NextResponse.json({
      success: true,
      message: 'Сообщение успешно отправлено',
    })
  } catch (error) {
    console.error('[v0] Contact form processing error:', error)
    return NextResponse.json(
      { error: 'Ошибка при отправке сообщения' },
      { status: 500 }
    )
  }
}
