interface AnimatedRoseProps {
  color: string;
  secondaryColor?: string;
  className?: string;
}

export function AnimatedRose({ color, secondaryColor, className = "" }: AnimatedRoseProps) {
  const glowColor = color
    .replace("#", "")
    .match(/.{2}/g)
    ?.map((x) => parseInt(x, 16))
    .join(", ");
  const darker = secondaryColor || shadeColor(color, -20);

  return (
    <div className={`relative w-[100px] h-[300px] scale-[0.1] ${className}`}>
      <div className="glass absolute h-[420px] w-[250px] border-3 border-white/50 rounded-t-[300px] -left-20 -top-[100px] border-b-[15px]" />
      <div
        className="glow absolute w-[170px] h-[170px] rounded-full -left-10 -top-10"
        style={{
          border: `1px solid rgba(${glowColor}, 0.47)`,
          boxShadow: `0px 0px 10px rgba(${glowColor}, 1)`,
          animation: "glowing 2.5s ease-in-out infinite"
        }}
      />
      <div className="rose-petals">
        {[...Array(7)].map((_, i) => (
          <div
            key={i}
            className="absolute transition-all duration-500 ease-out"
            style={{
              background: i === 0 ? color : i < 3 ? darker : color,
              width: "45px",
              height: i === 0 ? "80px" : "70px",
              borderRadius: i === 0 ? "15px" : i % 2 === 0 ? "0 30px 0 30px" : "30px 0 30px 0",
              left: i % 2 === 0 ? "0" : "40px",
              top: i === 0 ? "-6px" : "10px",
              transformOrigin: i % 2 === 0 ? "bottom right" : "bottom left",
              animation: `openRose${i + 1} 3s ease-in-out forwards`,
              animationDelay: "2s",
              zIndex: 7 - i
            }}
          />
        ))}
      </div>
      <div className="rose-leaves">
        <div className="absolute w-[6px] h-[230px] bg-[#066406] top-20 left-10" />
        <div className="absolute w-[55px] h-[30px] bg-[#338f37] top-[60px] left-[15px] rounded-[100px]" />
      </div>
      <div className="thorns">
        {[...Array(4)].map((_, i) => (
          <div
            key={i}
            className="absolute w-[30px] h-[30px] bg-[#066406]"
            style={{
              top: `${100 + i * 40}px`,
              left: i % 2 === 0 ? "10px" : "45px",
              transform: i % 2 === 0 ? "none" : "rotate(180deg)"
            }}
          />
        ))}
      </div>
      <div className="sparkles">
        {[...Array(10)].map((_, i) => (
          <div
            key={i}
            className="absolute w-1 h-1 rounded-full"
            style={{
              background: color,
              boxShadow: `0px 0px 12px 2px ${color}`,
              left: `${Math.random() * 280 - 100}px`,
              animation: `sparkle 4s ease-in-out infinite`,
              animationDelay: `${Math.random() * 2 + 1}s`
            }}
          />
        ))}
      </div>
    </div>
  );
}

function shadeColor(color: string, percent: number) {
  const num = parseInt(color.replace("#", ""), 16);
  const amt = Math.round(2.55 * percent);
  const R = (num >> 16) + amt;
  const G = ((num >> 8) & 0x00ff) + amt;
  const B = (num & 0x0000ff) + amt;
  return `#${((1 << 24) | (R << 16) | (G << 8) | B).toString(16).slice(1)}`;
}
