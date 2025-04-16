"use client"
import { easeInOut, motion } from 'framer-motion'

export default function Landing2(){
    return (
          <motion.div
              initial={{y: 20, opacity:0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ duration: 0.4, ease: easeInOut }}
              >
              <div className="mx-6 rounded-xl md:px-10 py-10 px-4  flex flex-col gap-10 bg-radial">
                  <div className="flex flex-col gap-4">
                      <div className="md:text-6xl text-5xl tracking-wider font-bold font-neuton">
                          Generate Secure Crypto Keypairs
                      </div>
                      <h1 className="text-md font-sans text-secondary">
                          Create secure keypairs for Ethereum, and Solana wallets with our easy-to-use generator.
                      </h1>
                  </div>
                  
              </div>
          </motion.div>
      )
  }