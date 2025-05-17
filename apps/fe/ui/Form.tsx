import { useUserStore } from "@/store/store";
import { FormEventHandler } from "react";
import Button from "./Button";

interface FormProps {
    onSubmit: FormEventHandler;
}

export default function Form({ onSubmit }: FormProps) {
    const { username, color, setUserStore } = useUserStore();

    return (
        <form onSubmit={onSubmit} className="space-y-6">
            <div className="grid grid-cols-5 gap-4 items-center">
                <input
                    type="text"
                    value={username}
                    onChange={(e) => setUserStore({ username: e.target.value })}
                    placeholder="Enter username"
                    className="col-span-4 px-4 py-3 bg-input border-2 border-border rounded-lg text-foreground placeholder-border focus:outline-none focus:border-background transition-colors font-spaceGro text-xl"
                    required
                />

                <div
                    className="relative p-1 border-2 border-border rounded-lg cursor-pointer col-span-1 h-full"
                    title="Pick your blob color"
                >
                    <input
                        type="color"
                        value={color}
                        onChange={(e) => setUserStore({ color: e.target.value })}
                        className="absolute inset-0 w-full h-full opacity-0 cursor-pointer "
                    />
                    <div
                        className="w-full h-full rounded-lg"
                        style={{ backgroundColor: color }}
                    ></div>
                </div>
            </div>

            <Button
                className="text-4xl jersey"
                type="submit">Start Game
            </Button>
        </form>
    );
}
