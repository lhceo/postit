import { ButtonHTMLAttributes } from 'react'

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'ghost'
  size?: 'sm' | 'md' | 'lg'
}

export function Button({ variant = 'primary', size = 'md', className = '', ...props }: ButtonProps) {
  const base = 'font-bold rounded-xl transition disabled:bg-gray-200 disabled:text-gray-400'
  const variants = {
    primary: 'bg-orange-400 hover:bg-orange-500 text-white',
    secondary: 'bg-white hover:bg-gray-50 text-gray-700 border-2 border-gray-200',
    ghost: 'text-gray-400 hover:text-gray-600',
  }
  const sizes = {
    sm: 'px-3 py-1.5 text-sm',
    md: 'px-5 py-2.5',
    lg: 'px-6 py-4 text-lg w-full',
  }
  return (
    <button className={`${base} ${variants[variant]} ${sizes[size]} ${className}`} {...props} />
  )
}
