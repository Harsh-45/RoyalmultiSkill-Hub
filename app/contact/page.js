'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'
import { FaWhatsapp, FaInstagram, FaMapMarkerAlt, FaPhone, FaEnvelope } from 'react-icons/fa'
import siteConfig from '@/config/site'

export default function ContactPage() {
  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    message: '',
  })

  const handleSubmit = (e) => {
    e.preventDefault()
    const message = siteConfig.whatsapp.contactMessage(
      formData.name,
      formData.phone,
      formData.message
    )
    window.open(siteConfig.whatsapp.getUrl(message), '_blank')
  }

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    })
  }

  return (
    <div className="min-h-screen pt-20">
      {/* Hero Section */}
      <section className="bg-gradient-to-r from-tattoo-dark via-tattoo-red to-beauty-accent py-20 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <motion.h1
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-5xl md:text-6xl font-display font-bold mb-6"
          >
            Get In Touch
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="text-xl text-gray-100 max-w-3xl mx-auto"
          >
            We'd love to hear from you. Reach out for bookings, inquiries, or just to say hello!
          </motion.p>
        </div>
      </section>

      {/* Contact Section */}
      <section className="py-20 bg-gradient-to-b from-black to-tattoo-grey">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
            {/* Contact Info */}
            <motion.div
              initial={{ opacity: 0, x: -50 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
            >
              <h2 className="text-4xl font-display font-bold text-white mb-8">
                Contact Information
              </h2>

              <div className="space-y-6">
                {/* WhatsApp */}
                <motion.a
                  href={siteConfig.whatsapp.getUrl()}
                  target="_blank"
                  rel="noopener noreferrer"
                  whileHover={{ x: 10 }}
                  className="flex items-center glass-dark rounded-2xl p-6 card-hover"
                >
                  <div className="bg-green-500 p-4 rounded-full mr-4">
                    <FaWhatsapp className="text-3xl text-white" />
                  </div>
                  <div>
                    <h3 className="text-white font-semibold text-lg">WhatsApp</h3>
                    <p className="text-gray-400">{siteConfig.contact.phone}</p>
                  </div>
                </motion.a>

                {/* Instagram */}
                {siteConfig.social.instagram && (
                  <motion.a
                    href={siteConfig.social.instagram}
                    target="_blank"
                    rel="noopener noreferrer"
                    whileHover={{ x: 10 }}
                    className="flex items-center glass-dark rounded-2xl p-6 card-hover"
                  >
                    <div className="bg-gradient-to-r from-purple-500 to-pink-500 p-4 rounded-full mr-4">
                      <FaInstagram className="text-3xl text-white" />
                    </div>
                    <div>
                      <h3 className="text-white font-semibold text-lg">Instagram</h3>
                      <p className="text-gray-400">@{siteConfig.contact.instagram}</p>
                    </div>
                  </motion.a>
                )}

                {/* Phone */}
                <motion.div
                  whileHover={{ x: 10 }}
                  className="flex items-center glass-dark rounded-2xl p-6"
                >
                  <div className="bg-tattoo-red p-4 rounded-full mr-4">
                    <FaPhone className="text-3xl text-white" />
                  </div>
                  <div>
                    <h3 className="text-white font-semibold text-lg">Phone</h3>
                    <p className="text-gray-400">{siteConfig.contact.phone}</p>
                  </div>
                </motion.div>

                {/* Email */}
                <motion.div
                  whileHover={{ x: 10 }}
                  className="flex items-center glass-dark rounded-2xl p-6"
                >
                  <div className="bg-beauty-accent p-4 rounded-full mr-4">
                    <FaEnvelope className="text-3xl text-white" />
                  </div>
                  <div>
                    <h3 className="text-white font-semibold text-lg">Email</h3>
                    <p className="text-gray-400">{siteConfig.contact.email}</p>
                  </div>
                </motion.div>

                {/* Location */}
                <motion.div
                  whileHover={{ x: 10 }}
                  className="flex items-center glass-dark rounded-2xl p-6"
                >
                  <div className="bg-beauty-gold p-4 rounded-full mr-4">
                    <FaMapMarkerAlt className="text-3xl text-white" />
                  </div>
                  <div>
                    <h3 className="text-white font-semibold text-lg">Location</h3>
                    <p className="text-gray-400">{siteConfig.address.full}</p>
                  </div>
                </motion.div>
              </div>
            </motion.div>

            {/* Contact Form */}
            <motion.div
              initial={{ opacity: 0, x: 50 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
            >
              <div className="glass-light rounded-2xl p-8">
                <h2 className="text-4xl font-display font-bold text-gray-800 mb-8">
                  Send Us a Message
                </h2>

                <form onSubmit={handleSubmit} className="space-y-6">
                  <div>
                    <label htmlFor="name" className="block text-gray-700 font-semibold mb-2">
                      Your Name *
                    </label>
                    <input
                      type="text"
                      id="name"
                      name="name"
                      value={formData.name}
                      onChange={handleChange}
                      required
                      className="w-full px-4 py-3 rounded-lg border-2 border-gray-300 focus:border-beauty-accent focus:outline-none transition-colors"
                      placeholder="Enter your name"
                    />
                  </div>

                  <div>
                    <label htmlFor="phone" className="block text-gray-700 font-semibold mb-2">
                      Phone Number *
                    </label>
                    <input
                      type="tel"
                      id="phone"
                      name="phone"
                      value={formData.phone}
                      onChange={handleChange}
                      required
                      className="w-full px-4 py-3 rounded-lg border-2 border-gray-300 focus:border-beauty-accent focus:outline-none transition-colors"
                      placeholder="Enter your phone number"
                    />
                  </div>

                  <div>
                    <label htmlFor="message" className="block text-gray-700 font-semibold mb-2">
                      Message *
                    </label>
                    <textarea
                      id="message"
                      name="message"
                      value={formData.message}
                      onChange={handleChange}
                      required
                      rows="5"
                      className="w-full px-4 py-3 rounded-lg border-2 border-gray-300 focus:border-beauty-accent focus:outline-none transition-colors resize-none"
                      placeholder="Tell us about your requirements..."
                    ></textarea>
                  </div>

                  <motion.button
                    type="submit"
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    className="w-full btn-primary btn-beauty"
                  >
                    Send via WhatsApp
                  </motion.button>
                </form>

                <p className="text-gray-600 text-sm mt-4 text-center">
                  * This will open WhatsApp with your message pre-filled
                </p>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Map Section */}
      <section className="py-20 bg-beauty-gradient">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-12"
          >
            <h2 className="text-4xl md:text-5xl font-display font-bold text-gray-800 mb-4">
              Visit Our Studio
            </h2>
            <p className="text-gray-600 text-lg">
              Find us on the map and drop by for a consultation
            </p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            className="rounded-2xl overflow-hidden shadow-2xl"
          >
            <iframe
              src={siteConfig.maps.embedUrl}
              width="100%"
              height="450"
              style={{ border: 0 }}
              allowFullScreen=""
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
              title={`${siteConfig.businessName} Location`}
            ></iframe>
          </motion.div>
        </div>
      </section>

      {/* Business Hours Section */}
      <section className="py-20 bg-black text-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center"
          >
            <h2 className="text-4xl font-display font-bold mb-8">Business Hours</h2>
            <div className="glass-dark rounded-2xl p-8">
              <div className="space-y-4 text-lg">
                <div className="flex justify-between items-center">
                  <span className="text-gray-400">{siteConfig.hours.weekdays.days}</span>
                  <span className="font-semibold">{siteConfig.hours.weekdays.time}</span>
                </div>
                <div className="border-t border-gray-700 pt-4 flex justify-between items-center">
                  <span className="text-gray-400">{siteConfig.hours.weekend.days}</span>
                  <span className="font-semibold">{siteConfig.hours.weekend.time}</span>
                </div>
              </div>
              <p className="text-gray-400 text-sm mt-6">
                * {siteConfig.hours.note}
              </p>
            </div>
          </motion.div>
        </div>
      </section>
    </div>
  )
}

