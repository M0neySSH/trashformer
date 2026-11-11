"use client"

import { motion } from "framer-motion"

export default function EcoIllustration() {
  return (
    <div className="relative w-full h-full max-w-[500px] max-h-[500px]">
      <motion.div
        className="absolute inset-0"
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5 }}
      >
        <div className="w-full h-full rounded-full bg-secondary/70 flex items-center justify-center">
          <motion.div
            className="relative w-4/5 h-4/5"
            animate={{ y: [0, -10, 0] }}
            transition={{ repeat: Number.POSITIVE_INFINITY, duration: 6, ease: "easeInOut" }}
          >
            {/* Robot body */}
            <div className="absolute w-3/4 h-3/4 top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 rounded-2xl bg-leaf-light">
              {/* Robot head */}
              <div className="absolute w-4/5 h-2/5 top-0 left-1/2 transform -translate-x-1/2 -translate-y-1/2 rounded-xl bg-leaf-light border-4 border-leaf-lighter">
                {/* Robot eyes */}
                <div className="absolute w-full top-1/3 flex justify-center space-x-8">
                  <div className="w-8 h-8 rounded-full bg-primary-foreground flex items-center justify-center">
                    <div className="w-4 h-4 rounded-full bg-leaf-DEFAULT"></div>
                  </div>
                  <div className="w-8 h-8 rounded-full bg-primary-foreground flex items-center justify-center">
                    <div className="w-4 h-4 rounded-full bg-leaf-DEFAULT"></div>
                  </div>
                </div>
                {/* Robot mouth */}
                <div className="absolute bottom-1/4 left-1/2 transform -translate-x-1/2 w-1/2 h-1/6 rounded-full bg-primary-foreground">
                  <div className="absolute top-1/3 left-1/4 w-1/2 h-1/3 rounded-full bg-leaf-lighter"></div>
                </div>
              </div>

              {/* Robot arms */}
              <div className="absolute -left-1/4 top-1/4 w-1/4 h-2/3 rounded-full bg-leaf-DEFAULT"></div>
              <div className="absolute -right-1/4 top-1/4 w-1/4 h-2/3 rounded-full bg-leaf-DEFAULT"></div>

              {/* Robot screen/chest */}
              <div className="absolute w-3/5 h-2/5 top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/4 rounded-lg bg-primary-foreground border-2 border-leaf-DEFAULT">
                <div className="absolute inset-0 flex items-center justify-center">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    className="w-8 h-8 text-leaf-DEFAULT"
                  >
                    <path d="M12 2L2 7l10 5 10-5-10-5z" />
                    <path d="M2 17l10 5 10-5" />
                    <path d="M2 12l10 5 10-5" />
                  </svg>
                </div>
              </div>
            </div>

            {/* Laptop */}
            <div className="absolute bottom-0 left-1/2 transform -translate-x-1/2 w-3/4 h-1/4">
              <div className="absolute bottom-0 w-full h-1/5 rounded-md bg-gray-700"></div>
              <div className="absolute bottom-1/5 w-full h-4/5 rounded-t-md bg-gray-800 border-t-2 border-x-2 border-gray-700">
                <div className="absolute inset-1 rounded bg-leaf-lighter flex items-center justify-center">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    className="w-6 h-6 text-leaf-DEFAULT"
                  >
                    <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z" />
                  </svg>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </motion.div>

      {/* Waste pile */}
      <motion.div
        className="absolute bottom-0 right-0 w-1/3 h-1/4"
        initial={{ opacity: 0, x: 20 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ delay: 0.3, duration: 0.5 }}
      >
        <div className="absolute bottom-0 w-full h-full bg-leaf-DEFAULT rounded-tl-3xl rounded-tr-lg"></div>
        <div className="absolute bottom-1/4 left-1/4 w-1/2 h-1/2 bg-leaf-lighter rounded-full"></div>
        <div className="absolute bottom-1/3 -left-1/4 w-1/2 h-1/3 bg-leaf-light rounded-tr-2xl"></div>
      </motion.div>
    </div>
  )
}

