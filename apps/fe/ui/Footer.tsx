import { Github } from "lucide-react";
import Link from "next/link";

export default function Footer() {
    return (
        <div className="mt-8 text-secondary   flex justify-center items-center gap-4">
            <div className="pr-4 border-r-2">
                <Link href="https://github.com/suleman1412" className="transition-colors hover:text-muted">
                    <Github className="w-6 h-6" />
                </Link>
            </div>

            <Link href="https://github.com/suleman1412" className="text-2xl font-bold hover:text-muted transition-colors">
                <div className="font-spaceGro ">Made by Suleman</div>
            </Link>
        </div>
    )
}