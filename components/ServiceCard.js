'use client'

import { motion } from 'framer-motion'
import siteConfig from '@/config/site'
import { FaWhatsapp, FaCheckCircle } from 'react-icons/fa'

export default function ServiceCard({ category, index }) {
  const isBeauty = category.theme === 'beauty'
  const isTattoo = category.theme === 'tattoo'

  return (
    <motion.div
      initial={{ opacity: 0, y: 50 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.5, delay: index * 0.1 }}
      whileHover={{ y: -8, transition: { duration: 0.3 } }}
      className={`relative rounded-xl md:rounded-2xl p-5 md:p-7 overflow-hidden group ${
        isBeauty
          ? 'bg-gradient-to-br from-white via-primary-50/50 to-primary-100/30 border-2 border-primary-200 shadow-lg hover:shadow-2xl hover:border-primary-400'
          : 'bg-gradient-to-br from-neutral-900 via-neutral-800 to-neutral-900 border-2 border-accent-500/30 shadow-xl hover:shadow-2xl hover:border-accent-500'
      } transition-all duration-300`}
    >
      {/* Decorative Background Elements */}
      <div className={`absolute top-0 right-0 w-32 h-32 rounded-full blur-3xl opacity-20 ${
        isBeauty ? 'bg-primary-400' : 'bg-accent-500'
      } group-hover:opacity-30 transition-opacity duration-500`} />
      <div className={`absolute bottom-0 left-0 w-24 h-24 rounded-full blur-2xl opacity-10 ${
        isBeauty ? 'bg-accent-400' : 'bg-primary-500'
      } group-hover:opacity-20 transition-opacity duration-500`} />

      {/* Content */}
      <div className="relative z-10">
        {/* Icon and Title - Enhanced */}
        <div className="flex items-center mb-4 md:mb-5">
          <motion.span
            className="text-4xl md:text-5xl mr-3 md:mr-4"
            whileHover={{ scale: 1.2, rotate: 10 }}
            transition={{ type: "spring", stiffness: 300 }}
          >
            {category.icon}
          </motion.span>
          <div>
            <h3
              className={`text-xl md:text-2xl font-bold ${
                isBeauty ? 'text-primary-700' : 'text-accent-400'
              }`}
            >
              {category.title}
            </h3>
            <div className={`h-1 w-12 rounded-full mt-1 ${
              isBeauty ? 'bg-gradient-to-r from-primary-500 to-accent-500' : 'bg-gradient-to-r from-accent-500 to-primary-500'
            }`} />
          </div>
        </div>

        {/* Description (if exists) */}
        {category.description && (
          <p className={`mb-4 md:mb-5 text-sm md:text-base leading-relaxed ${
            isBeauty ? 'text-neutral-600' : 'text-neutral-300'
          }`}>
            {category.description}
          </p>
        )}

        {/* Services List - Enhanced */}
        <div className="space-y-2 md:space-y-2.5 max-h-[400px] md:max-h-none overflow-y-auto custom-scrollbar mb-5 md:mb-6">
          {category.services.map((service, idx) => (
            <motion.div
              key={idx}
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ delay: idx * 0.05 }}
              whileHover={{ scale: 1.02, x: 4 }}
              className={`flex justify-between items-center p-3 md:p-3.5 rounded-lg backdrop-blur-sm ${
                isBeauty
                  ? 'bg-white/70 hover:bg-white/90 border border-primary-100 hover:border-primary-300'
                  : 'bg-black/40 hover:bg-black/60 border border-accent-500/20 hover:border-accent-500/40'
              } ${service.featured ? 'ring-2 ring-accent-500 shadow-md' : ''} transition-all duration-200 cursor-pointer`}
            >
              <div className="flex items-center gap-2">
                <FaCheckCircle className={`text-xs md:text-sm ${
                  isBeauty ? 'text-primary-500' : 'text-accent-500'
                }`} />
                <span
                  className={`font-medium text-sm md:text-base ${
                    isBeauty ? 'text-neutral-800' : 'text-white'
                  }`}
                >
                  {service.name}
                </span>
              </div>
              <span
                className={`font-bold text-sm md:text-base whitespace-nowrap ml-3 ${
                  isBeauty ? 'text-primary-600' : 'text-accent-400'
                }`}
              >
                {service.price}
              </span>
            </motion.div>
          ))}
        </div>

        {/* CTA Button - Enhanced */}
        <motion.a
          href={siteConfig.whatsapp.getUrl(siteConfig.whatsapp.serviceMessage(category.title))}
          target="_blank"
          rel="noopener noreferrer"
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          className={`flex items-center justify-center gap-2 mt-5 md:mt-6 py-3.5 md:py-4 rounded-full font-bold text-sm md:text-base transition-all duration-300 shadow-lg hover:shadow-xl ${
            isBeauty
              ? 'bg-gradient-to-r from-primary-500 via-primary-600 to-accent-500 text-white hover:from-primary-600 hover:via-primary-700 hover:to-accent-600'
              : 'bg-gradient-to-r from-accent-500 via-accent-600 to-primary-500 text-white hover:from-accent-600 hover:via-accent-700 hover:to-primary-600'
          }`}
        >
          <FaWhatsapp className="text-lg md:text-xl" />
          Book Now on WhatsApp
        </motion.a>
      </div>
    </motion.div>
  )
}

