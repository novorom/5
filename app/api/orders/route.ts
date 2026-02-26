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

  console.log('[v0] Telegram config check - botToken:', !!botToken, 'chatId:', !!chatId)

  if (!botToken || !chatId) {
    console.error('[v0] Telegram credentials not configured - botToken:', !!botToken, 'chatId:', !!chatId)
    throw new Error('Telegram credentials not configured')
  }

  try {
    const response = await fetch(`https://api.telegram.org/bot${botToken}/sendMessage`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        chat_id: chatId,
        text: message,
        parse_mode: 'HTML',
      }),
    })

    console.log('[v0] Telegram API response status:', response.status)

    if (!response.ok) {
      const errorText = await response.text()
      console.error('[v0] Telegram API error response:', response.status, errorText)
      throw new Error(`Telegram API error: ${response.status}`)
    }

    const result = await response.json()
    console.log('[v0] Telegram API success, message ID:', result.result?.message_id)
  } catch (error) {
    console.error('[v0] Failed to send Telegram message:', error)
    throw error
  }
}



export async function POST(request: NextRequest) {
  try {
    console.log('[v0] Orders API POST request received')
    
    const body: OrderRequest = await request.json()
    console.log('[v0] Order data - items:', body.items?.length, 'total:', body.total, 'name:', body.name, 'contact:', body.contactMethod)

    if (!body.items || body.items.length === 0) {
      console.log('[v0] Empty cart error')
      return NextResponse.json({ error: 'Cart is empty' }, { status: 400 })
    }

    if (!body.name || !body.contactValue) {
      console.log('[v0] Missing required fields')
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 })
    }

    // Format order summary
    const itemsList = body.items
      .map((item) => `${item.name} x${item.quantity} - ${(item.price * item.quantity).toLocaleString('ru-RU')} ₽`)
      .join('\n')

    const orderTotal = body.total + (body.total > 10000 ? 0 : 500)

    // Prepare message
    const contactMethodLabel = 
      body.contactMethod === 'phone' ? '📱 Телефон' : 
      body.contactMethod === 'telegram' ? '💬 Telegram' : 
      '📧 Email'

    const orderMessage = `🛒 <b>НОВЫЙ ЗАКАЗ</b>

👤 <b>Имя:</b> ${body.name}
${contactMethodLabel}: <code>${body.contactValue}</code>

<b>📦 ТОВАРЫ:</b>
${itemsList}

<b>💰 СУММА:</b>
Подитог: <code>${body.total.toLocaleString('ru-RU')} ₽</code>
Доставка: <code>${body.total > 10000 ? 'Бесплатно ✅' : '500 ₽'}</code>
<b>ИТОГО: ${orderTotal.toLocaleString('ru-RU')} ₽</b>

<i>Заказ поступил в ${new Date().toLocaleString('ru-RU')}</i>`

    console.log('[v0] Message prepared, sending to Telegram...')
    
    // Send to Telegram
    await sendTelegramMessage(orderMessage)
    
    console.log('[v0] Order successfully sent to Telegram')

    return NextResponse.json({
      success: true,
      message: 'Заказ успешно отправлен',
    })
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : String(error)
    console.error('[v0] Order processing error:', errorMessage)
    return NextResponse.json(
      { error: 'Ошибка при обработке заказа. Пожалуйста, попробуйте позже.' },
      { status: 500 }
    )
  }
}
