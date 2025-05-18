'use client'
import { useEffect, useRef, useState } from "react"
import { easeInOut, motion } from "framer-motion";
import Circles from "../ui/Circles";
import GameRoom from "./GameRoom";
import { useGameStore, useUserStore } from "@/store/store";
import Footer from "@/ui/Footer";
import Tutorial from "@/ui/Tutorial";
import Header from "@/ui/Header";
import Modal from "@/ui/Modal";
import Form from "@/ui/Form";
import ThemeToggle from "@/ui/ThemeToggle";
import { useTheme } from "@/context/ThemeContext";

export default function LandingPage() {
    const [isModalOpen, setIsModalOpen] = useState(true)
    const { username } = useUserStore();
    const { setGameState } = useGameStore.getState()
    const { BGMRef } = useTheme()
    const handleStartGame = (e: React.FormEvent) => {
        e.preventDefault();
        if (username.trim() === '') {
            alert('Username is empty');
            return;
        }
        BGMRef.current?.play().then(() => {
            setGameState({ hasGameStarted: true });
            setTimeout(() => {
                setIsModalOpen(false);
            }, 300)
        })
    };

    return (
        <motion.div
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.4, ease: easeInOut }}
        >
            <div className="min-h-screen relative flex items-center justify-center">
                {isModalOpen ? (
                    <div className="w-[100vw] h-[100vh] flex items-center justify-center radialCustom">
                        <div className="w-full max-w-md ">
                            <Circles />
                            <div className="absolute top-10 right-10">
                                <ThemeToggle />
                            </div>
                            <Modal>
                                <Header />
                                <Form onSubmit={handleStartGame} />
                                {/* <div className="w-full my-8 flex items-center justify-center">
                                <hr className="items-center w-[75%] border-2 border-border rounded-lg" />
                            </div>
                            <Button className="text-3xl font-jersey tracking-wider">
                                Create Room
                            </Button> */}
                                <Tutorial />
                            </Modal>

                            <Footer />
                        </div>
                    </div>
                ) : (
                    <GameRoom />
                )}
            </div>
        </motion.div>
    )
}
