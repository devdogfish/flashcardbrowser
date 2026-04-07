"use client";

import { useState, useRef, useCallback } from "react";
import { motion } from "motion/react";
import { cn } from "@/lib/utils";
import { Check, Globe, Lock, User } from "lucide-react";
import Image from "next/image";

interface DeckCardProps {
  id: string;
  title: string;
  description: string;
  cardCount: number;
  lastStudied?: string;
  creator?: string;
  isPublic: boolean;
  isSelected: boolean;
  onSelect: (id: string) => void;
  image?: string;
  // Subtle positioning offset (smaller than before)
  offsetRotation?: number;
}

export function DeckCard({
  id,
  title,
  description,
  cardCount,
  lastStudied,
  creator,
  isPublic,
  isSelected,
  onSelect,
  image,
  offsetRotation = 0,
}: DeckCardProps) {
  const [isHovered, setIsHovered] = useState(false);
  const [tilt, setTilt] = useState({ x: 0, y: 0 });
  const cardRef = useRef<HTMLDivElement>(null);

  const handleMouseMove = useCallback((e: React.MouseEvent<HTMLDivElement>) => {
    if (!cardRef.current) return;
    const rect = cardRef.current.getBoundingClientRect();
    const centerX = rect.left + rect.width / 2;
    const centerY = rect.top + rect.height / 2;
    const x = (e.clientX - centerX) / (rect.width / 2);
    const y = (e.clientY - centerY) / (rect.height / 2);
    setTilt({ x: y * -6, y: x * 6 });
  }, []);

  const handleMouseLeave = useCallback(() => {
    setIsHovered(false);
    setTilt({ x: 0, y: 0 });
  }, []);

  return (
    <motion.div
      ref={cardRef}
      className="cursor-pointer"
      style={{
        perspective: "1000px",
      }}
      initial={{
        rotate: offsetRotation,
        scale: 1,
      }}
      animate={{
        rotate: isHovered ? 0 : offsetRotation,
        scale: isHovered ? 1.05 : isSelected ? 1.02 : 1,
        y: isHovered ? -8 : 0,
      }}
      whileTap={{ scale: 0.98 }}
      transition={{
        type: "spring",
        stiffness: 400,
        damping: 25,
      }}
      onMouseEnter={() => setIsHovered(true)}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      onClick={() => onSelect(id)}
    >
      <motion.div
        className={cn(
          "relative w-56 rounded-2xl overflow-hidden",
          "bg-card border border-border",
          "shadow-[0_4px_20px_-4px_rgba(0,0,0,0.1)]",
          "transition-shadow duration-300",
          isHovered && "shadow-[0_20px_50px_-12px_rgba(0,0,0,0.25)]",
          isSelected &&
            "ring-2 ring-primary ring-offset-2 ring-offset-background",
        )}
        style={{
          transform: `rotateX(${tilt.x}deg) rotateY(${tilt.y}deg)`,
          transition: "transform 0.15s ease-out",
        }}
      >
        {/* Selection indicator */}
        {isSelected && (
          <div className="absolute top-3 right-3 z-10 w-6 h-6 rounded-full bg-primary flex items-center justify-center shadow-lg">
            <Check className="w-3.5 h-3.5 text-primary-foreground" />
          </div>
        )}

        {/* Card header with image */}
        <div className="h-32 relative overflow-hidden">
          {image ? (
            <Image src={image} alt={title} fill className="object-cover" />
          ) : (
            <div
              className={cn(
                "w-full h-full",
                isPublic
                  ? "bg-gradient-to-br from-sky-200 to-sky-100 dark:from-sky-900 dark:to-sky-800"
                  : "bg-gradient-to-br from-amber-200 to-amber-100 dark:from-amber-900 dark:to-amber-800",
              )}
            />
          )}

          {/* Gradient overlay for readability */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent" />

          {/* Visibility badge */}
          <div className="absolute top-3 left-3">
            <span
              className={cn(
                "inline-flex items-center gap-1 text-[10px] font-medium px-2 py-1 rounded-full backdrop-blur-sm",
                "bg-white/20 text-white",
              )}
            >
              {isPublic ? (
                <Globe className="w-2.5 h-2.5" />
              ) : (
                <Lock className="w-2.5 h-2.5" />
              )}
              {isPublic ? "Public" : "Private"}
            </span>
          </div>

          {/* Card count badge on image */}
          <div className="absolute bottom-3 right-3">
            <span className="text-xs font-medium text-white/90 bg-black/30 backdrop-blur-sm px-2 py-1 rounded-full">
              {cardCount} cards
            </span>
          </div>
        </div>

        {/* Card content */}
        <div className="p-4">
          <h3 className="font-semibold text-foreground truncate">{title}</h3>

          {/* Collapsed state - just shows card count visualization */}
          <motion.div
            initial={{ opacity: 1 }}
            animate={{
              opacity: isHovered ? 0 : 1,
              height: isHovered ? 0 : "auto",
            }}
            transition={{ duration: 0.15 }}
            className="overflow-hidden"
          >
            {creator && (
              <p className="text-xs text-muted-foreground mt-1">by {creator}</p>
            )}
            {!creator && lastStudied && (
              <p className="text-xs text-muted-foreground mt-1">
                Studied {lastStudied}
              </p>
            )}
          </motion.div>

          {/* Expanded info on hover */}
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{
              height: isHovered ? "auto" : 0,
              opacity: isHovered ? 1 : 0,
            }}
            transition={{ duration: 0.2 }}
            className="overflow-hidden"
          >
            <p className="text-xs text-muted-foreground mt-2 line-clamp-3">
              {description}
            </p>

            <div className="flex items-center justify-between mt-3 pt-3 border-t border-border">
              {creator && (
                <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
                  <User className="w-3 h-3" />
                  <span>{creator}</span>
                </div>
              )}

              {lastStudied && (
                <p className="text-[10px] text-muted-foreground/70">
                  {lastStudied}
                </p>
              )}
            </div>
          </motion.div>
        </div>
      </motion.div>
    </motion.div>
  );
}
