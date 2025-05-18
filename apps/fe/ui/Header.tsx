import { Gamepad2 } from "lucide-react";

export default function Header() {
  return (
    <div className="text-center mb-8">
      <div className="flex justify-center mb-4">
        <Gamepad2 className="w-16 h-16 text-background" />
      </div>
      <h1
        className="text-4xl md:text-5xl font-p2p mb-2 shadow"
      >
        Blob.io
      </h1>
      <p className="text-background font-semibold text-xl font-spaceGro mt-6">
        Eat. Grow. Dominate.
      </p>
    </div>
  );
}
