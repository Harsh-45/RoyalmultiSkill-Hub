'use client'

import { motion } from 'framer-motion'
import Image from 'next/image'
import { FaAward, FaHeart, FaUsers, FaStar } from 'react-icons/fa'
import siteConfig from '@/config/site'

export default function AboutPage() {
  const stats = [
    { icon: <FaUsers />, number: siteConfig.stats.clients, label: 'Happy Clients' },
    { icon: <FaAward />, number: siteConfig.stats.experience, label: 'Years Experience' },
    { icon: <FaStar />, number: siteConfig.stats.tattoos, label: 'Tattoos Created' },
    { icon: <FaHeart />, number: siteConfig.stats.satisfaction, label: 'Satisfaction' },
  ]

  const whyChooseUs = [
    {
      title: 'Expert Professionals',
      description: 'Our team consists of highly trained and experienced artists and beauticians who are passionate about their craft.',
      icon: '👨‍🎨',
    },
    {
      title: 'Premium Quality',
      description: 'We use only the finest quality products and materials, ensuring the best results for our clients.',
      icon: '💎',
    },
    {
      title: 'Hygiene First',
      description: 'Strict sterilization protocols and hygiene standards are maintained at all times for your safety.',
      icon: '🧼',
    },
    {
      title: 'Custom Designs',
      description: 'Every tattoo and beauty service is personalized to match your unique style and preferences.',
      icon: '🎨',
    },
    {
      title: 'Affordable Pricing',
      description: 'Premium services at competitive prices, making luxury accessible to everyone.',
      icon: '💰',
    },
    {
      title: 'Customer Care',
      description: 'We prioritize your comfort and satisfaction, providing exceptional service from start to finish.',
      icon: '❤️',
    },
  ]

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
            About Us
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="text-xl text-gray-100 max-w-3xl mx-auto"
          >
            Where art meets beauty, and confidence is born
          </motion.p>
        </div>
      </section>

      {/* Our Story Section */}
      <section className="py-20 bg-gradient-to-b from-black to-tattoo-grey text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <motion.div
              initial={{ opacity: 0, x: -50 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
            >
              <h2 className="text-4xl md:text-5xl font-display font-bold mb-6 gradient-text">
                Our Story
              </h2>
              <div className="space-y-4 text-gray-300 text-lg">
                <p>
                  Royal Multiskill Hub was born from a passion for art and beauty. What started as a 
                  small tattoo studio has evolved into a comprehensive beauty and art destination.
                </p>
                <p>
                  We believe that everyone deserves to feel confident and beautiful in their own skin.
                  Whether it&apos;s through a meaningful tattoo that tells your story or a beauty treatment
                  that enhances your natural radiance, we&apos;re here to help you express yourself.
                </p>
                <p>
                  Our journey has been marked by countless smiles, transformations, and the trust of 
                  over 1000 satisfied clients. Each service we provide is a testament to our commitment 
                  to excellence and our love for what we do.
                </p>
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: 50 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
              className="relative h-96 rounded-2xl overflow-hidden shadow-2xl"
            >
              <Image
                src="https://images.unsplash.com/photo-1560066984-138dadb4c035?w=800"
                alt="Our studio"
                fill
                className="object-cover"
              />
            </motion.div>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-20 bg-beauty-gradient">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {stats.map((stat, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                className="text-center"
              >
                <div className="text-5xl text-beauty-accent mb-4 flex justify-center">
                  {stat.icon}
                </div>
                <div className="text-4xl font-bold text-gray-800 mb-2">
                  {stat.number}
                </div>
                <div className="text-gray-600 font-medium">{stat.label}</div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Why Choose Us Section */}
      <section className="py-20 bg-black text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-4xl md:text-5xl font-display font-bold mb-4">
              Why Choose Us
            </h2>
            <p className="text-gray-400 text-lg max-w-2xl mx-auto">
              Discover what makes Royal Multiskill Hub the preferred choice for tattoos and beauty services
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {whyChooseUs.map((item, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                className="glass-dark rounded-2xl p-6 card-hover"
              >
                <div className="text-5xl mb-4">{item.icon}</div>
                <h3 className="text-2xl font-bold mb-3 text-tattoo-red">
                  {item.title}
                </h3>
                <p className="text-gray-400">{item.description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Mission & Vision Section */}
      <section className="py-20 bg-gradient-to-b from-tattoo-grey to-black text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              className="glass-dark rounded-2xl p-8"
            >
              <h3 className="text-3xl font-display font-bold mb-4 text-tattoo-red">
                Our Mission
              </h3>
              <p className="text-gray-300 text-lg">
                To provide exceptional tattoo and beauty services that empower individuals to
                express their unique identity and enhance their natural beauty. We strive to
                create a welcoming environment where art, skill, and customer satisfaction
                come together seamlessly.
              </p>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: 30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              className="glass-dark rounded-2xl p-8"
            >
              <h3 className="text-3xl font-display font-bold mb-4 text-beauty-accent">
                Our Vision
              </h3>
              <p className="text-gray-300 text-lg">
                To become the most trusted and sought-after destination for tattoo art and
                beauty services, known for our commitment to quality, innovation, and customer
                care. We envision a future where everyone feels confident and beautiful in
                their own skin.
              </p>
            </motion.div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-gradient-to-r from-beauty-accent to-tattoo-red text-white text-center">
        <div className="max-w-4xl mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
          >
            <h2 className="text-4xl md:text-5xl font-display font-bold mb-6">
              Join Our Family
            </h2>
            <p className="text-xl mb-8">
              Experience the Royal Multiskill Hub difference today
            </p>
            <a
              href="https://wa.me/919876543210?text=Hi! I want to book an appointment"
              target="_blank"
              rel="noopener noreferrer"
              className="btn-primary bg-white text-tattoo-dark hover:bg-gray-100 inline-block"
            >
              Book Your Appointment
            </a>
          </motion.div>
        </div>
      </section>
    </div>
  )
}

