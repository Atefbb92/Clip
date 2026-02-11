'use client'

import React from 'react'
import Image from 'next/image'

const StatCard = ({
  icon,
  value,
  label,
  color = 'blue',
  onClick = null,
  className = '',
  isSelected = false,
}) => {
  const handleClick = () => {
    if (onClick) {
      onClick()
    }
  }

  // Color variants mapping
  const colorVariants = {
    gray: {
      accent: 'border-slate-500 shadow-slate-500/15',
      iconBg: 'bg-slate-500/10',
      iconColor: 'text-slate-500',
      selectedBg: 'bg-gradient-to-br from-slate-50 to-slate-100',
    },
    blue: {
      accent: 'border-blue-500 shadow-blue-500/15',
      iconBg: 'bg-blue-500/10',
      iconColor: 'text-blue-500',
      selectedBg: 'bg-gradient-to-br from-blue-100 to-blue-200',
    },
    green: {
      accent: 'border-emerald-500 shadow-emerald-500/15',
      iconBg: 'bg-emerald-500/10',
      iconColor: 'text-emerald-500',
      selectedBg: 'bg-gradient-to-br from-emerald-100 to-emerald-200',
    },
    yellow: {
      accent: 'border-amber-500 shadow-amber-500/15',
      iconBg: 'bg-amber-500/10',
      iconColor: 'text-amber-500',
      selectedBg: 'bg-gradient-to-br from-amber-100 to-amber-200',
    },
    red: {
      accent: 'border-red-500 shadow-red-500/15',
      iconBg: 'bg-red-500/10',
      iconColor: 'text-red-500',
      selectedBg: 'bg-gradient-to-br from-red-50 to-red-100',
    },
    purple: {
      accent: 'border-violet-500 shadow-violet-500/15',
      iconBg: 'bg-violet-500/10',
      iconColor: 'text-violet-500',
      selectedBg: 'bg-gradient-to-br from-violet-50 to-violet-100',
    },
    pink: {
      accent: 'border-pink-500 shadow-pink-500/15',
      iconBg: 'bg-pink-500/10',
      iconColor: 'text-pink-500',
      selectedBg: 'bg-gradient-to-br from-pink-50 to-pink-100',
    },
    cyan: {
      accent: 'border-cyan-500 shadow-cyan-500/15',
      iconBg: 'bg-cyan-500/10',
      iconColor: 'text-cyan-500',
      selectedBg: 'bg-gradient-to-br from-cyan-50 to-cyan-100',
    },
    orange: {
      accent: 'border-orange-500 shadow-orange-500/15',
      iconBg: 'bg-orange-500/10',
      iconColor: 'text-orange-500',
      selectedBg: 'bg-gradient-to-br from-orange-50 to-orange-100',
    },
  }

  const variant = colorVariants[color] || colorVariants.blue

  return (
    <div
      className={`
        relative overflow-hidden cursor-pointer h-full min-h-[80px] min-w-0
        bg-gradient-to-br from-white to-gray-50
        p-5 xl:px-7 lg:p-4 md:p-3.5 sm:p-3
        rounded-2xl flex items-center 
        gap-5 xl:gap-5 lg:gap-4 md:gap-4 sm:gap-3.5
        shadow-sm border border-slate-200/60
        transition-all duration-300 ease-out
        hover:shadow-md hover:${variant.accent.split(' ')[0]}/20
        before:absolute before:top-0 before:left-0 before:right-0 before:h-0.5
        before:bg-current before:opacity-0 before:transition-opacity before:duration-300
        hover:before:opacity-100
        ${isSelected ? `${variant.accent} ${variant.selectedBg} shadow-lg before:opacity-100` : ''}
        ${variant.iconColor}
        ${className}
      `}
      onClick={handleClick}
    >
      <div
        className={`
        flex items-center justify-center flex-shrink-0 rounded-xl transition-all duration-300
        w-10 h-10 xl:w-10 xl:h-10 lg:w-9 lg:h-9 md:w-8 md:h-8 sm:w-7 sm:h-7
        ${variant.iconBg}
      `}
      >
        {typeof icon === 'string' ? (
          <Image
            src={icon}
            alt={label}
            width={24}
            height={24}
            className="w-6 h-6 xl:w-6 xl:h-6 lg:w-5 lg:h-5 md:w-4.5 md:h-4.5 sm:w-4 sm:h-4 object-contain"
          />
        ) : (
          <div
            className={`
            w-6 h-6 xl:w-6 xl:h-6 lg:w-5 lg:h-5 md:w-4.5 md:h-4.5 sm:w-4 sm:h-4
            flex items-center justify-center ${variant.iconColor}
          `}
          >
            {icon}
          </div>
        )}
      </div>

      <div className="flex flex-col flex-1 min-w-0">
        <div className={`text-xl xl:text-xl lg:text-lg md:text-base sm:text-sm font-bold leading-none tracking-tight mb-1 ${isSelected
          ? variant.iconColor.replace('text-', 'text-').replace('-500', '-700')
          : 'bg-gradient-to-br from-slate-800 to-slate-600 bg-clip-text text-transparent'
          }`}>
          {value}
        </div>
        <div className={`text-xs xl:text-xs lg:text-xs md:text-xs sm:text-[9px] font-semibold uppercase tracking-wider whitespace-normal break-words leading-tight ${isSelected
          ? variant.iconColor.replace('text-', 'text-').replace('-500', '-600')
          : 'text-slate-500'
          }`}>
          {label}
        </div>
      </div>
    </div>
  )
}

export default StatCard
