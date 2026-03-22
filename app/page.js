'use client'

import { motion } from 'framer-motion'
import Link from 'next/link'
import Image from 'next/image'
import siteConfig from '@/config/site'
import { FaStar } from 'react-icons/fa'

export default function Home() {


  const featuredWorks = [
    {
      title: 'Custom Tattoo',
      image: 'https://images.unsplash.com/photo-1611501275019-9b5cda994e8d?w=500',
      category: 'Tattoo',
    },
    {
      title: 'Bridal Makeup',
      image: 'https://images.unsplash.com/photo-1487412947147-5cebf100ffc2?w=500',
      category: 'Bridal',
    },
    {
      title: 'Hair Styling',
      image: 'https://images.unsplash.com/photo-1560066984-138dadb4c035?w=500',
      category: 'Hair',
    },
  ]

  return (
    <div className="min-h-screen">
      {/* Hero Section - Split Theme */}
      <section className="min-h-screen flex flex-col lg:flex-row">
        {/* Tattoo Side - Dark */}
        <motion.div
          initial={{ opacity: 0, x: -100 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.8 }}
          className="w-full lg:w-1/2 bg-tattoo-gradient min-h-screen flex items-center justify-center p-8 relative overflow-hidden"
        >
          <div className="absolute inset-0 opacity-5">
            <Image
              src="https://images.unsplash.com/photo-1590246814883-57c511a8c4b9?w=1200"
              alt="Tattoo background"
              fill
              className="object-cover"
            />
          </div>
          <div className="relative z-10 text-center">
            <motion.h2
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3, duration: 0.6 }}
              className="text-3xl sm:text-4xl md:text-6xl lg:text-7xl font-display font-bold text-white mb-4 md:mb-6 text-shadow-lg"
            >
              Ink Your
              <span className="block bg-gradient-to-r from-primary-400 to-accent-400 bg-clip-text text-transparent">Story</span>
            </motion.h2>
            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.5, duration: 0.6 }}
              className="text-neutral-200 text-sm sm:text-base md:text-lg mb-6 md:mb-8 max-w-md mx-auto leading-relaxed"
            >
              Professional custom tattoos with premium quality ink and hygiene standards
            </motion.p>
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.7, duration: 0.6 }}
            >
              <Link href="/portfolio" className="btn-primary bg-gradient-to-r from-primary-500 to-accent-500 text-white hover:from-primary-600 hover:to-accent-600">
                View Tattoo Portfolio
              </Link>
            </motion.div>
          </div>
        </motion.div>

        {/* Beauty Side - Light */}
        <motion.div
          initial={{ opacity: 0, x: 100 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.8 }}
          className="w-full lg:w-1/2 bg-beauty-gradient min-h-screen flex items-center justify-center p-8 relative overflow-hidden"
        >
          <div className="absolute inset-0 opacity-5">
            <Image
              src="https://images.unsplash.com/photo-1487412947147-5cebf100ffc2?w=1200"
              alt="Beauty background"
              fill
              className="object-cover"
            />
          </div>
          <div className="relative z-10 text-center">
            <motion.h2
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3, duration: 0.6 }}
              className="text-3xl sm:text-4xl md:text-6xl lg:text-7xl font-display font-bold text-neutral-800 mb-4 md:mb-6 text-shadow"
            >
              Embrace Your
              <span className="block bg-gradient-to-r from-primary-500 to-accent-500 bg-clip-text text-transparent">Beauty</span>
            </motion.h2>
            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.5, duration: 0.6 }}
              className="text-neutral-700 text-sm sm:text-base md:text-lg mb-6 md:mb-8 max-w-md mx-auto leading-relaxed"
            >
              Premium beauty services from hair care to facials, designed to make you shine
            </motion.p>
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.7, duration: 0.6 }}
            >
              <Link href="/services" className="btn-primary bg-gradient-to-r from-primary-500 to-accent-500 text-white hover:from-primary-600 hover:to-accent-600">
                Explore Beauty Services
              </Link>
            </motion.div>
          </div>
        </motion.div>
      </section>

      {/* Brand Tagline Section */}
      <section className="py-20 bg-gradient-to-b from-neutral-950 to-neutral-900 text-white text-center">
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
        >
          <h1 className="text-4xl md:text-6xl font-display font-bold gradient-text mb-4">
            Royal Multiskill Hub
          </h1>
          <p className="text-2xl md:text-3xl text-neutral-300 tracking-widest">
            Ink • Beauty • Confidence
          </p>
        </motion.div>
      </section>

      {/* Featured Works Section */}
      <section className="py-20 bg-gradient-to-b from-neutral-900 to-neutral-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-12"
          >
            <h2 className="text-4xl md:text-5xl font-display font-bold text-white mb-4 text-shadow-lg">
              Featured Works
            </h2>
            <p className="text-neutral-300 text-lg">
              Explore our latest creations in tattoo art and beauty transformations
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {featuredWorks.map((work, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 50 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: index * 0.2 }}
                className="image-zoom rounded-2xl overflow-hidden shadow-2xl"
              >
                <div className="relative aspect-square">
                  <Image
                    src={work.image}
                    alt={work.title}
                    fill
                    className="object-cover"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/40 to-transparent flex items-end p-6">
                    <div>
                      <p className="text-primary-400 text-sm font-semibold mb-1 uppercase tracking-wide">
                        {work.category}
                      </p>
                      <h3 className="text-white text-2xl font-bold text-shadow-lg">{work.title}</h3>
                    </div>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mt-12"
          >
            <Link href="/portfolio" className="btn-primary btn-tattoo">
              View Full Portfolio
            </Link>
          </motion.div>
        </div>
      </section>

      {/* Google Reviews Section */}
      <section className="py-20 bg-gradient-to-b from-primary-50 to-primary-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center"
          >
            <h2 className="text-4xl md:text-5xl font-display font-bold text-neutral-800 mb-4">
              What Our Clients Say
            </h2>
            <p className="text-neutral-600 text-lg mb-8">
              Read reviews from our valued customers on Google
            </p>

            {/* Google Reviews Buttons */}
            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
              <motion.a
                href={siteConfig.reviews.viewReviewsUrl}
                target="_blank"
                rel="noopener noreferrer"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="inline-flex items-center gap-2 px-8 py-4 bg-white text-neutral-800 rounded-full font-semibold shadow-lg hover:shadow-xl transition-all border-2 border-primary-500"
              >
                <FaStar className="text-yellow-500" />
                View All Google Reviews
              </motion.a>

              <motion.a
                href={siteConfig.reviews.googleReviewsUrl}
                target="_blank"
                rel="noopener noreferrer"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="inline-flex items-center gap-2 px-8 py-4 bg-gradient-to-r from-primary-500 to-accent-500 text-white rounded-full font-semibold shadow-lg hover:shadow-xl transition-all"
              >
                <FaStar className="text-yellow-300" />
                Write a Review
              </motion.a>
            </div>
          </motion.div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-gradient-to-r from-tattoo-dark via-tattoo-red to-beauty-accent text-white text-center">
        <div className="max-w-4xl mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <h2 className="text-4xl md:text-5xl font-display font-bold mb-6">
              Ready to Transform?
            </h2>
            <p className="text-xl mb-8 text-gray-100">
              Book your appointment today and experience premium service
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link href="/contact" className="btn-primary bg-white text-tattoo-dark hover:bg-gray-100">
                Book Appointment
              </Link>
              <Link href="/services" className="btn-primary bg-transparent border-2 border-white hover:bg-white hover:text-tattoo-dark">
                View All Services
              </Link>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Hygiene & Safety Section */}
      <section className="py-20 bg-black text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-12"
          >
            <h2 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-display font-bold mb-3 md:mb-4">
              Your Safety, Our Priority
            </h2>
            <p className="text-gray-400 text-sm sm:text-base md:text-lg">
              We maintain the highest standards of hygiene and safety
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            {[
              { icon: '🧼', title: 'Sterilized Equipment', desc: 'All tools properly sterilized' },
              { icon: '✅', title: 'Premium Quality', desc: 'Only certified products used' },
              { icon: '👨‍⚕️', title: 'Expert Professionals', desc: 'Trained and experienced team' },
              { icon: '🏆', title: 'Trusted Service', desc: '1000+ happy customers' },
            ].map((item, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                className="glass-dark rounded-2xl p-6 text-center card-hover"
              >
                <div className="text-5xl mb-4">{item.icon}</div>
                <h3 className="text-xl font-bold mb-2">{item.title}</h3>
                <p className="text-gray-400">{item.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>
    </div>
  )
}

