import { cn } from "@/lib/utils";

interface BlobCharacterProps {
  color?: string;
  size?: "sm" | "md" | "lg";
  className?: string;
  animation?: "bounce" | "pulse" | "none";
}

const BlobCharacter = ({
  color = "bg-red-500",
  size = "md",
  className,
  animation = "bounce",
}: BlobCharacterProps) => {
  const sizeClasses = {
    sm: "w-8 h-8",
    md: "w-16 h-16",
    lg: "w-24 h-24",
  };

  const animationClasses = {
    bounce: "animate-blob-bounce",
    pulse: "animate-blob-pulse",
    none: "",
  };

  return (
    <div
      className={cn(
        "rounded-full relative flex items-center justify-center",
        color,
        sizeClasses[size],
        animationClasses[animation],
        className
      )}
    >
      <div className="absolute rounded-full bg-white w-1/3 h-1/3 top-1/4 left-1/4 opacity-60"></div>
      <div className="absolute rounded-full bg-black w-[20%] h-[20%] top-1/3 left-2/3 opacity-80"></div>
    </div>
  );
};

export default BlobCharacter;