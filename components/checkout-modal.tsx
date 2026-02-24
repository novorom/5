'use client'

import { useState } from 'react'
import { X, Phone, MessageCircle, Mail } from 'lucide-react'

interface CheckoutModalProps {
  isOpen: boolean
  onClose: () => void
  onSubmit: (data: OrderData) => Promise<void>
  total: number
  itemCount: number
}

export interface OrderData {
  contactMethod: 'phone' | 'telegram' | 'email'
  contactValue: string
  name: string
}

export function CheckoutModal({
  isOpen,
  onClose,
  onSubmit,
  total,
  itemCount,
}: CheckoutModalProps) {
  const [contactMethod, setContactMethod] = useState<'phone' | 'telegram' | 'email'>('phone')
  const [contactValue, setContactValue] = useState('')
  const [name, setName] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState('')

  if (!isOpen) return null

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')

    if (!name.trim()) {
      setError('Пожалуйста, введите ваше имя')
      return
    }

    if (!contactValue.trim()) {
      setError(`Пожалуйста, введите ваш ${contactMethod === 'phone' ? 'номер телефона' : contactMethod === 'telegram' ? 'username Telegram' : 'email'}`)
      return
    }

    // Validate contact value format
    if (contactMethod === 'email') {
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
      if (!emailRegex.test(contactValue)) {
        setError('Пожалуйста, введите корректный email')
        return
      }
    } else if (contactMethod === 'phone') {
      const phoneRegex = /^\+?[\d\s\-()]{10,}$/
      if (!phoneRegex.test(contactValue)) {
        setError('Пожалуйста, введите корректный номер телефона')
        return
      }
    }

    setIsLoading(true)
    try {
      await onSubmit({
        contactMethod,
        contactValue,
        name,
      })
      // Reset form after success
      setName('')
      setContactValue('')
      setContactMethod('phone')
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Ошибка при отправке заказа')
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
      <div className="bg-background rounded-2xl border border-border p-8 max-w-md w-full mx-4 max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-bold text-foreground">Оформить заказ</h2>
          <button
            onClick={onClose}
            className="h-8 w-8 rounded-lg hover:bg-accent transition-colors flex items-center justify-center text-foreground/60"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Order summary */}
        <div className="bg-muted/50 rounded-xl p-4 mb-6 border border-border">
          <div className="flex justify-between text-sm mb-2">
            <span className="text-foreground/60">{itemCount} товаров</span>
            <span className="font-semibold text-foreground">
              {total.toLocaleString('ru-RU')} ₽
            </span>
          </div>
          <div className="flex justify-between text-sm mb-2">
            <span className="text-foreground/60">Доставка</span>
            <span className="font-semibold text-foreground">
              {total > 10000 ? 'Бесплатно' : '500 ₽'}
            </span>
          </div>
          <div className="border-t border-border pt-2 mt-2 flex justify-between">
            <span className="font-semibold text-foreground">Итого:</span>
            <span className="text-lg font-bold text-primary">
              {(total + (total > 10000 ? 0 : 500)).toLocaleString('ru-RU')} ₽
            </span>
          </div>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Name field */}
          <div>
            <label className="block text-sm font-medium text-foreground mb-2">
              Ваше имя
            </label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Иван Петров"
              className="w-full h-10 rounded-lg border border-input bg-background px-3 py-2 text-sm placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring/20 focus:border-primary transition-all"
            />
          </div>

          {/* Contact method selection */}
          <div>
            <label className="block text-sm font-medium text-foreground mb-3">
              Способ связи
            </label>
            <div className="space-y-2">
              {[
                { value: 'phone', label: 'Телефон', icon: Phone },
                { value: 'telegram', label: 'Telegram', icon: MessageCircle },
                { value: 'email', label: 'Email', icon: Mail },
              ].map(({ value, label, icon: Icon }) => (
                <label key={value} className="flex items-center gap-3 p-3 rounded-lg border border-border cursor-pointer hover:bg-accent transition-colors" style={{
                  backgroundColor: contactMethod === value ? 'var(--color-accent)' : 'transparent',
                }}>
                  <input
                    type="radio"
                    name="contactMethod"
                    value={value}
                    checked={contactMethod === value as any}
                    onChange={(e) => setContactMethod(e.target.value as any)}
                    className="w-4 h-4"
                  />
                  <Icon className="h-4 w-4 text-foreground/70" />
                  <span className="text-sm font-medium text-foreground">{label}</span>
                </label>
              ))}
            </div>
          </div>

          {/* Contact value field */}
          <div>
            <label className="block text-sm font-medium text-foreground mb-2">
              {contactMethod === 'phone' && 'Номер телефона'}
              {contactMethod === 'telegram' && 'Telegram (@username)'}
              {contactMethod === 'email' && 'Email'}
            </label>
            <input
              type={contactMethod === 'email' ? 'email' : 'text'}
              value={contactValue}
              onChange={(e) => setContactValue(e.target.value)}
              placeholder={
                contactMethod === 'phone'
                  ? '+7 (999) 123-45-67'
                  : contactMethod === 'telegram'
                  ? '@yourname'
                  : 'your@email.com'
              }
              className="w-full h-10 rounded-lg border border-input bg-background px-3 py-2 text-sm placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring/20 focus:border-primary transition-all"
            />
          </div>

          {/* Error message */}
          {error && (
            <div className="p-3 rounded-lg bg-destructive/10 border border-destructive/30">
              <p className="text-sm text-destructive">{error}</p>
            </div>
          )}

          {/* Submit button */}
          <button
            type="submit"
            disabled={isLoading}
            className="w-full h-11 rounded-xl bg-primary text-primary-foreground font-medium hover:bg-primary/90 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isLoading ? 'Отправка...' : 'Отправить заказ'}
          </button>

          <button
            type="button"
            onClick={onClose}
            className="w-full h-11 rounded-xl border border-border text-foreground font-medium hover:bg-accent transition-colors"
          >
            Отмена
          </button>
        </form>
      </div>
    </div>
  )
}
