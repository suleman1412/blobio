"use client"
import { useState } from "react"
import MainCanvas from "./MainCanvas"
import { Gamepad2, Github } from "lucide-react";
import { easeInOut, motion } from "framer-motion";
import Link from "next/link";
import Circles from "./Circles";

export default function LandingPage() {
    const [isModalOpen, setIsModalOpen] = useState(true)
    const [username, setUsername] = useState('');

    const handleStartGame = (e: React.FormEvent) => {
        e.preventDefault();
        // Game start logic will go here
        if (username.trim() === '') {
            alert('Username is empty')
            setUsername('')
        } else {
            setIsModalOpen(p => !p)
            console.log('Starting game with username:', username);
        }
    };

    return (
        <motion.div
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.4, ease: easeInOut }}
        >
            <div className="min-h-screen  relative flex items-center justify-center p-4    ">
                {isModalOpen ?
                    <div className="w-full max-w-md">
                        <Circles />

                        <div className="relative bg-white/20 backdrop-blur-sm p-8 rounded-xl border-2 border-black shadow-2xl">
                            <div className="text-center mb-8">
                                <div className="flex justify-center mb-4">
                                    <Gamepad2 className="w-16 h-16 text-black" />
                                </div>
                                <h1 className="text-5xl font-bold text-transparent  bg-clip-text bg-gradient-to-r from-gray-900 to-gray-900/60 mb-2 p2p">
                                    Blob.io
                                </h1>
                                <p className="text-gray-800 font-semibold text-xl spaceGro mt-6">Eat. Grow. Dominate.</p>
                            </div>

                            <form onSubmit={handleStartGame} className="space-y-6 ">
                                <div>
                                    <input
                                        type="text"
                                        value={username}
                                        onChange={(e) => setUsername(e.target.value)}
                                        placeholder="Enter username"
                                        className="w-full px-4 py-3 bg-gray-900/80 border-2 border-white/50 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:border-white transition-colors spaceGro text-xl"
                                        required
                                    />
                                </div>

                                <button
                                    type="submit"
                                    className="w-full py-3 px-6 bg-gray-400 text-black hover:bg-gray-200 rounded-lg transform transition-all hover:scale-105 active:scale-95 text-xl p2p border-2 border-gray-500\"
                                >
                                    START GAME
                                </button>
                            </form>
                            <div className="mt-6 text-center space-y-2">
                                <h3 className="text-xl font-bold pixelifySans tracking-wider text-black">HOW TO PLAY</h3>
                                <ul className="text-sm text-gray-400 spaceGro">
                                    <li>• Move your mouse to control your blob</li>
                                    <li>• Eat smaller blobs to grow bigger</li>
                                    <li>• Avoid larger blobs or you'll be eaten!</li>
                                </ul>
                            </div>
                        </div>
                        {/* Footer */}
                        <div className="mt-8 text-gray-500 flex justify-center items-center gap-4">
                            <Link href="https://github.com/suleman1412" className="hover:text-white transition-colors">
                                <Github className="w-6 h-6 hover:text-black" />
                            </Link>
                            <div>|</div>
                            <Link href="https://github.com/suleman1412" className="hover:text-white transition-colors">
                                <div className="spaceGro text-2xl font-bold  hover:text-black">Made by Suleman </div>
                            </Link>
                        </div>
                    </div>
                    :
                    <div>
                        <MainCanvas username={username} />
                    </div>}
            </div>
        </motion.div>
    )
}

