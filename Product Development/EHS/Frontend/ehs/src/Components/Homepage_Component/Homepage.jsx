import React, { useState } from "react";
import {
  CheckCircle,
  Car,
  BadgePlus,
  Forklift,
  Flame,
  AlarmSmoke,
  PersonStanding,
} from "lucide-react";
import { motion } from "framer-motion"; // Import framer-motion for animations

const HomePage = () => {
  const [activeTab, setActiveTab] = useState("overview");

  const features = [
    {
      icon: <BadgePlus className="w-12 h-12 text-green-600" />,
      title: "Real Time Product Counting",
      description:
        "Accurately track product inventory in real time, reducing errors and improving efficiency with instant updates on stock levels for better inventory management.",
    },
    {
      icon: <Car className="w-12 h-12 text-blue-600" />,
      title: "Real Time Vehicle Parking Space Detection",
      description:
        "Get real-time updates on available parking spaces, helping drivers find spots quickly and improving parking management efficiency.",
    },
    {
      icon: <Forklift className="w-12 h-12 text-purple-600" />,
      title: "Fork Lifting",
      description:
        "Enhance warehouse operations with our Fork Lifting solution. Efficiently lift, move, and stack heavy loads while ensuring safety and precision in every operation.",
    },
    {
      icon: <Flame className="w-12 h-12 text-purple-600" />,
      title: "Real Time Fire Detection",
      description:
        "Quickly detect fire and smoke in real time with our advanced detection system. Ensure safety by providing instant alerts, enabling faster response times and minimizing potential damage.",
    },
    {
      icon: <AlarmSmoke className="w-12 h-12 text-purple-600" />,
      title: "Real Time Smoke Detection",
      description:
        "Instantly detect smoke with our real-time monitoring system, providing early alerts to enhance safety, reduce risks, and enable quicker responses in emergency situations.",
    },
    {
      icon: <PersonStanding className="w-12 h-12 text-purple-600" />,
      title: "Personal Protective Equipment",
      description:
        "PPE (Personal Protective Equipment) includes gear like gloves, masks, and helmets, designed to protect individuals from safety and health risks.",
    },
  ];

  return (
    <div className="relative">
      <div className="min-h-screen bg-gradient-to-br from-green-50 to-blue-50">
        {/* Hero Section with background image */}
        <header className="relative pt-24 pb-16">
          {/* Background image wrapper */}
          <div
            className="absolute top-0 left-0 w-full h-full bg-cover bg-center z-0"
            style={{
              backgroundImage: "url(https://yourimageurl.com/hero-bg.jpg)",
            }}
          />
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 grid md:grid-cols-2 gap-12 items-center relative z-10">
            <div>
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 1.5 }}
              >
                <h2 className="text-4xl font-bold text-gray-900 mb-6 leading-tight">
                  ENVIRONMENTAL HEALTH & SAFETY
                </h2>
                <p className="text-xl text-gray-600 mb-8">
                  Leverage AI-powered analytics to create safer, more compliant,
                  and more efficient work environments.
                </p>
                <div className="flex space-x-4">
                  <button className="bg-green-600 text-white px-6 py-3 rounded-lg hover:bg-green-700 transition">
                    Get Started
                  </button>
                  <button className="border border-green-600 text-green-600 px-6 py-3 rounded-lg hover:bg-green-50 transition">
                    Learn More
                  </button>
                </div>
              </motion.div>
            </div>
            <div>
              <motion.img
                initial={{ scale: 0.8 }}
                animate={{ scale: 1 }}
                transition={{ duration: 1.5 }}
                src="https://media.licdn.com/dms/image/v2/D4D12AQFr-Kw2fQUkZA/article-cover_image-shrink_720_1280/article-cover_image-shrink_720_1280/0/1692414900837?e=2147483647&v=beta&t=Ps8FtP6i--TzxZSg1SD1AMqrukFC-SqfS0zhTpIzgoU"
                alt="EHS Dashboard"
                className="rounded-xl shadow-2xl"
              />
            </div>
          </div>
        </header>

        {/* Features Section with animations */}
        <section className="py-20 bg-white">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <h3 className="text-4xl font-bold mb-12">Signature Features</h3>
            <div className="grid md:grid-cols-3 gap-8">
              {features.map((feature, index) => (
                <motion.div
                  key={index}
                  className="bg-gray-50 p-8 rounded-xl hover:shadow-lg transition transform hover:-translate-y-2"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ duration: 0.6, delay: index * 0.2 }}
                >
                  <div className="flex justify-center mb-6">{feature.icon}</div>
                  <h4 className="text-2xl font-semibold mb-4">
                    {feature.title}
                  </h4>
                  <p className="text-gray-600">{feature.description}</p>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* Call to Action with animation */}
        <section className="py-20 bg-gradient-to-r from-green-600 to-blue-600 text-white">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <motion.h3
              className="text-4xl font-bold mb-6"
              initial={{ y: 50 }}
              animate={{ y: 0 }}
              transition={{ duration: 1 }}
            >
              Ready to Enhance Your Workplace Safety?
            </motion.h3>
            <p className="text-xl mb-8">
              Schedule a personalized demo and see how our EHS solution can
              transform your organization.
            </p>
            <motion.button
              className="bg-white text-green-700 px-8 py-4 rounded-lg hover:bg-gray-100 transition text-lg font-semibold"
              whileHover={{ scale: 1.05 }}
            >
              Request Free Demo
            </motion.button>
          </div>
        </section>

        {/* Footer */}
        <footer className="bg-gray-900 text-white py-12">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 grid md:grid-cols-4 gap-8">
            <div>
              <h4 className="text-xl font-bold mb-4">
                Environmental Health & Safety
              </h4>
              <p className="text-gray-400">
                Innovative solutions for workplace safety and environmental
                compliance.
              </p>
            </div>
            <div>
              <h4 className="text-xl font-bold mb-4">Solutions</h4>
              <ul className="space-y-3">
                <li>
                  <a href="#" className="text-gray-400 hover:text-white">
                    Risk Management
                  </a>
                </li>
                <li>
                  <a href="#" className="text-gray-400 hover:text-white">
                    Compliance
                  </a>
                </li>
                <li>
                  <a href="#" className="text-gray-400 hover:text-white">
                    Analytics
                  </a>
                </li>
              </ul>
            </div>
            <div>
              <h4 className="text-xl font-bold mb-4">Company</h4>
              <ul className="space-y-2">
                <li>
                  <a href="#" className="text-gray-400 hover:text-white">
                    Relevantz
                  </a>
                </li>
                <li>
                  <a href="#" className="text-gray-400 hover:text-white">
                    Careers
                  </a>
                </li>
                <li>
                  <a href="#" className="text-gray-400 hover:text-white">
                    Contact
                  </a>
                </li>
              </ul>
            </div>
            <div>
              <h4 className="text-xl font-bold mb-4">Contact</h4>
              <p className="text-gray-400">
                PHASE-2, Chennai One – IT SEZ, Module-4 3rd Floor South, 200
                Feet Radial Rd.
                <br />
                , Pallavaram, Thoraipakkam, Chennai, Tamil Nadu 600097
                <br />
                044 4006 1234
              </p>
            </div>
          </div>
        </footer>
      </div>
    </div>
  );
};

export default HomePage;
