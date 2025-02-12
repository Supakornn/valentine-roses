interface RoseProps {
  color: string;
  className?: string;
}

export type RoseVariantId = "red" | "pink" | "white" | "yellow";

interface RoseVariant {
  color: string;
  shadow: string;
  border: string;
  meaning: string;
}

export const ROSE_VARIANTS: Record<RoseVariantId, RoseVariant> = {
  red: {
    color: "#FF0000",
    shadow: "shadow-red-200",
    border: "border-red-300",
    meaning: "True Love"
  },
  pink: {
    color: "#FF69B4",
    shadow: "shadow-pink-200",
    border: "border-pink-300",
    meaning: "Sweetness"
  },
  white: {
    color: "#FFFFFF",
    shadow: "shadow-gray-200",
    border: "border-gray-300",
    meaning: "Purity"
  },
  yellow: {
    color: "#FFD700",
    shadow: "shadow-yellow-200",
    border: "border-yellow-300",
    meaning: "Friendship"
  }
};

export function Rose({ color, className = "" }: RoseProps) {
  return (
    <svg viewBox="0 0 100 100" className={className} fill={color}>
      <path d="M50 15c-5 10-20 15-30 15 0 30 10 55 30 55s30-25 30-55c-10 0-25-5-30-15z" />
      <path
        d="M50 20c2 8 12 12 20 12 0 25-7 45-20 45s-20-20-20-45c8 0 18-4 20-12"
        fill="currentColor"
        opacity="0.7"
      />
      <path d="M50 0c0 0-10 10-10 20s10 20 10 20 10-10 10-20S50 0 50 0" fill="#2F8A00" />
    </svg>
  );
}
