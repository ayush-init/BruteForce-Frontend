"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";

const NEON_GREEN = "#a3e635";
const letters = "BRUTEFORCE".split("");
const stackOrder = ["E", "C", "R", "O", "F", "E", "T", "U", "R", "B"];

export default function BruteForceTree() {
  const [phase, setPhase] = useState(0);
  const [extractedIndex, setExtractedIndex] = useState(-1);

  useEffect(() => {
    const cycleDuration = 8000; // 8 seconds total
    const phaseDuration = cycleDuration / 6; // 1.33s per phase
    
    const interval = setInterval(() => {
      setPhase((prev) => (prev + 1) % 6);
    }, phaseDuration);

    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    // Phase 2: Extract letters one by one
    if (phase === 1) {
      const extractionTimer = setInterval(() => {
        setExtractedIndex((prev) => {
          if (prev >= letters.length - 1) {
            clearInterval(extractionTimer);
            return prev;
          }
          return prev + 1;
        });
      }, 150); // Extract every 150ms

      return () => clearInterval(extractionTimer);
    } else {
      setExtractedIndex(-1);
    }
  }, [phase]);

  const getStackPosition = (index: number) => {
    const stackX = 700; // Centered in larger container
    const stackY = 750;
    return { x: stackX, y: stackY - (index * 37.5) };
  };

  const getSemicirclePosition = (letter: string, letterIndex: number) => {
    const centerX = 700;
    const centerY = 350; // Moved up to give more space
    const radius = 180; // Reduced to stay within boundaries
    
    // BRUTE in upper semicircle
    if (letterIndex < 5) {
      const angle = (letterIndex * 28) - 56; // Good spacing: -56° to +56°
      return {
        x: centerX + Math.cos(angle * Math.PI / 180) * radius,
        y: centerY - Math.abs(Math.sin(angle * Math.PI / 180)) * radius
      };
    }
    // FORCE in lower semicircle
    else {
      const adjustedIndex = letterIndex - 5;
      const angle = (adjustedIndex * 28) + 124; // Good spacing: 124° to 236°
      return {
        x: centerX + Math.cos(angle * Math.PI / 180) * radius,
        y: centerY + Math.abs(Math.sin(angle * Math.PI / 180)) * radius
      };
    }
  };

  const getCurvedPath = (startPos: { x: number; y: number }, endPos: { x: number; y: number }) => {
    const midX = (startPos.x + endPos.x) / 2;
    const midY = Math.min(startPos.y, endPos.y) - 100;
    return `M ${startPos.x},${startPos.y} Q ${midX},${midY} ${endPos.x},${endPos.y}`;
  };

  const getEdgePath = (fromIndex: number, toIndex: number) => {
    const from = getSemicirclePosition(letters[fromIndex], fromIndex);
    const to = getSemicirclePosition(letters[toIndex], toIndex);
    return `M ${from.x},${from.y} L ${to.x},${to.y}`;
  };

  return (
    <div className="absolute inset-0 flex items-center justify-center overflow-hidden">
      <svg 
        width="1400" 
        height="900" 
        className="absolute"
        style={{ background: 'transparent' }}
      >
        <defs>
          <filter id="glow">
            <feGaussianBlur stdDeviation="3" result="coloredBlur"/>
            <feMerge>
              <feMergeNode in="coloredBlur"/>
              <feMergeNode in="SourceGraphic"/>
            </feMerge>
          </filter>
        </defs>

        {/* Phase 1: Stack Initialization */}
        {phase === 0 && (
          <g>
            {stackOrder.map((letter, index) => {
              const stackPos = getStackPosition(index);
              const originalIndex = letters.indexOf(letter);
              
              return (
                <motion.g key={`stack-${letter}-${index}`}>
                  <motion.circle
                    cx={stackPos.x}
                    cy={stackPos.y}
                    r="24"
                    fill="none"
                    stroke={NEON_GREEN}
                    strokeWidth="2.25"
                    filter="url(#glow)"
                    initial={{ 
                      scale: 0,
                      opacity: 0
                    }}
                    animate={{
                      scale: [0, 1.1, 1],
                      opacity: [0, 0.8, 0.6],
                      y: [stackPos.y, stackPos.y - 9, stackPos.y]
                    }}
                    transition={{
                      delay: index * 0.25,
                      duration: 0.25,
                      ease: "easeOut"
                    }}
                  />
                  <motion.text
                    x={stackPos.x}
                    y={stackPos.y}
                    fill={NEON_GREEN}
                    fontSize="18"
                    fontWeight="600"
                    textAnchor="middle"
                    dominantBaseline="middle"
                    filter="url(#glow)"
                    initial={{ 
                      scale: 0,
                      opacity: 0
                    }}
                    animate={{
                      scale: [0, 1.1, 1],
                      opacity: [0, 0.9, 0.7],
                      y: [stackPos.y, stackPos.y - 9, stackPos.y]
                    }}
                    transition={{
                      delay: index * 0.25,
                      duration: 0.25,
                      ease: "easeOut"
                    }}
                  >
                    {letter}
                  </motion.text>
                </motion.g>
              );
            })}
          </g>
        )}

        {/* Phase 2: Controlled Extraction */}
        {phase === 1 && (
          <g>
            {/* Remaining stack */}
            {stackOrder.slice(extractedIndex + 1).map((letter, index) => {
              const stackIndex = extractedIndex + 1 + index;
              const stackPos = getStackPosition(stackIndex);
              
              return (
                <motion.g key={`remaining-${letter}-${stackIndex}`}>
                  <circle
                    cx={stackPos.x}
                    cy={stackPos.y}
                    r="24"
                    fill="none"
                    stroke={NEON_GREEN}
                    strokeWidth="2.25"
                    filter="url(#glow)"
                    opacity={0.6}
                  />
                  <text
                    x={stackPos.x}
                    y={stackPos.y}
                    fill={NEON_GREEN}
                    fontSize="18"
                    fontWeight="600"
                    textAnchor="middle"
                    dominantBaseline="middle"
                    filter="url(#glow)"
                    opacity={0.7}
                  >
                    {letter}
                  </text>
                </motion.g>
              );
            })}

            {/* Extracted letters following curved paths */}
            {stackOrder.slice(0, extractedIndex + 1).map((letter, index) => {
              const originalIndex = letters.indexOf(letter);
              const stackPos = getStackPosition(index);
              const targetPos = getSemicirclePosition(letter, originalIndex);
              const path = getCurvedPath(stackPos, targetPos);
              
              return (
                <motion.g key={`extracted-${letter}-${index}`}>
                  {/* Enhanced trail glow */}
                  <motion.path
                    d={path}
                    stroke={NEON_GREEN}
                    strokeWidth="1"
                    fill="none"
                    filter="url(#glow)"
                    opacity={0.3}
                    initial={{ pathLength: 0 }}
                    animate={{ pathLength: 1 }}
                    transition={{ duration: 1.2, ease: "easeInOut" }}
                  />
                  
                  <motion.circle
                    cx={stackPos.x}
                    cy={stackPos.y}
                    r="24"
                    fill="none"
                    stroke={NEON_GREEN}
                    strokeWidth="2.25"
                    filter="url(#glow)"
                    animate={{
                      cx: targetPos.x,
                      cy: targetPos.y,
                      opacity: [0.6, 0.8, 0.7]
                    }}
                    transition={{
                      duration: 1.2,
                      ease: "easeInOut"
                    }}
                  />
                  <motion.text
                    x={stackPos.x}
                    y={stackPos.y}
                    fill={NEON_GREEN}
                    fontSize="18"
                    fontWeight="600"
                    textAnchor="middle"
                    dominantBaseline="middle"
                    filter="url(#glow)"
                    animate={{
                      x: targetPos.x,
                      y: targetPos.y,
                      opacity: [0.7, 0.9, 0.8]
                    }}
                    transition={{
                      duration: 1.2,
                      ease: "easeInOut"
                    }}
                  >
                    {letter}
                  </motion.text>
                </motion.g>
              );
            })}
          </g>
        )}

        {/* Phase 3: Semicircle Formation */}
        {phase === 2 && (
          <g>
            {letters.map((letter, index) => {
              const position = getSemicirclePosition(letter, index);
              
              return (
                <motion.g key={`semicircle-${letter}-${index}`}>
                  <motion.circle
                    cx={position.x}
                    cy={position.y}
                    r="24"
                    fill="none"
                    stroke={NEON_GREEN}
                    strokeWidth="2.25"
                    filter="url(#glow)"
                    initial={{ 
                      scale: 0,
                      opacity: 0
                    }}
                    animate={{
                      scale: [0, 1.1, 1],
                      opacity: [0, 0.8, 0.7]
                    }}
                    transition={{
                      delay: index * 0.1,
                      duration: 0.3,
                      ease: "easeOut"
                    }}
                  />
                  <motion.text
                    x={position.x}
                    y={position.y}
                    fill={NEON_GREEN}
                    fontSize="18"
                    fontWeight="600"
                    textAnchor="middle"
                    dominantBaseline="middle"
                    filter="url(#glow)"
                    initial={{ 
                      scale: 0,
                      opacity: 0
                    }}
                    animate={{
                      scale: [0, 1.1, 1],
                      opacity: [0, 0.9, 0.8]
                    }}
                    transition={{
                      delay: index * 0.1 + 0.1,
                      duration: 0.3,
                      ease: "easeOut"
                    }}
                  >
                    {letter}
                  </motion.text>
                </motion.g>
              );
            })}
          </g>
        )}

        {/* Phase 4: Edge Drawing */}
        {phase === 3 && (
          <g>
            {/* Nodes remain visible */}
            {letters.map((letter, index) => {
              const position = getSemicirclePosition(letter, index);
              
              return (
                <g key={`edge-node-${letter}-${index}`}>
                  <circle
                    cx={position.x}
                    cy={position.y}
                    r="24"
                    fill="none"
                    stroke={NEON_GREEN}
                    strokeWidth="2.25"
                    filter="url(#glow)"
                    opacity={0.7}
                  />
                  <text
                    x={position.x}
                    y={position.y}
                    fill={NEON_GREEN}
                    fontSize="18"
                    fontWeight="600"
                    textAnchor="middle"
                    dominantBaseline="middle"
                    filter="url(#glow)"
                    opacity={0.8}
                  >
                    {letter}
                  </text>
                </g>
              );
            })}

            {/* Enhanced tree edges with stroke reveal */}
            <motion.path
              d={getEdgePath(0, 1)} // B -> R
              stroke={NEON_GREEN}
              strokeWidth="1.5"
              fill="none"
              filter="url(#glow)"
              opacity={0.5}
              initial={{ pathLength: 0 }}
              animate={{ pathLength: 1 }}
              transition={{ delay: 0, duration: 0.5, ease: "easeInOut" }}
            />
            <motion.path
              d={getEdgePath(0, 2)} // B -> U
              stroke={NEON_GREEN}
              strokeWidth="1.5"
              fill="none"
              filter="url(#glow)"
              opacity={0.5}
              initial={{ pathLength: 0 }}
              animate={{ pathLength: 1 }}
              transition={{ delay: 0.2, duration: 0.5, ease: "easeInOut" }}
            />
            <motion.path
              d={getEdgePath(1, 3)} // R -> T
              stroke={NEON_GREEN}
              strokeWidth="1.5"
              fill="none"
              filter="url(#glow)"
              opacity={0.5}
              initial={{ pathLength: 0 }}
              animate={{ pathLength: 1 }}
              transition={{ delay: 0.4, duration: 0.5, ease: "easeInOut" }}
            />
            <motion.path
              d={getEdgePath(2, 4)} // U -> E
              stroke={NEON_GREEN}
              strokeWidth="1.5"
              fill="none"
              filter="url(#glow)"
              opacity={0.5}
              initial={{ pathLength: 0 }}
              animate={{ pathLength: 1 }}
              transition={{ delay: 0.6, duration: 0.5, ease: "easeInOut" }}
            />
            <motion.path
              d={getEdgePath(4, 5)} // E -> F
              stroke={NEON_GREEN}
              strokeWidth="1.5"
              fill="none"
              filter="url(#glow)"
              opacity={0.5}
              initial={{ pathLength: 0 }}
              animate={{ pathLength: 1 }}
              transition={{ delay: 0.8, duration: 0.5, ease: "easeInOut" }}
            />
            <motion.path
              d={getEdgePath(5, 6)} // F -> O
              stroke={NEON_GREEN}
              strokeWidth="1.5"
              fill="none"
              filter="url(#glow)"
              opacity={0.5}
              initial={{ pathLength: 0 }}
              animate={{ pathLength: 1 }}
              transition={{ delay: 1.0, duration: 0.5, ease: "easeInOut" }}
            />
            <motion.path
              d={getEdgePath(6, 7)} // O -> R
              stroke={NEON_GREEN}
              strokeWidth="1.5"
              fill="none"
              filter="url(#glow)"
              opacity={0.5}
              initial={{ pathLength: 0 }}
              animate={{ pathLength: 1 }}
              transition={{ delay: 1.2, duration: 0.5, ease: "easeInOut" }}
            />
            <motion.path
              d={getEdgePath(7, 8)} // R -> C
              stroke={NEON_GREEN}
              strokeWidth="1.5"
              fill="none"
              filter="url(#glow)"
              opacity={0.5}
              initial={{ pathLength: 0 }}
              animate={{ pathLength: 1 }}
              transition={{ delay: 1.4, duration: 0.5, ease: "easeInOut" }}
            />
            <motion.path
              d={getEdgePath(8, 9)} // C -> E
              stroke={NEON_GREEN}
              strokeWidth="1.5"
              fill="none"
              filter="url(#glow)"
              opacity={0.5}
              initial={{ pathLength: 0 }}
              animate={{ pathLength: 1 }}
              transition={{ delay: 1.6, duration: 0.5, ease: "easeInOut" }}
            />
          </g>
        )}

        {/* Phase 5: Stabilization */}
        {phase === 4 && (
          <g>
            {letters.map((letter, index) => {
              const position = getSemicirclePosition(letter, index);
              
              return (
                <motion.g key={`stable-${letter}-${index}`}>
                  <motion.circle
                    cx={position.x}
                    cy={position.y}
                    r="24"
                    fill="none"
                    stroke={NEON_GREEN}
                    strokeWidth="2.25"
                    filter="url(#glow)"
                    animate={{
                      scale: [1, 1.05, 1],
                      opacity: [0.7, 0.9, 0.8]
                    }}
                    transition={{
                      duration: 0.8,
                      ease: "easeInOut"
                    }}
                  />
                  <motion.text
                    x={position.x}
                    y={position.y}
                    fill={NEON_GREEN}
                    fontSize="18"
                    fontWeight="600"
                    textAnchor="middle"
                    dominantBaseline="middle"
                    filter="url(#glow)"
                    animate={{
                      opacity: [0.8, 1, 0.9]
                    }}
                    transition={{
                      duration: 0.8,
                      ease: "easeInOut"
                    }}
                  >
                    {letter}
                  </motion.text>
                </motion.g>
              );
            })}

            {/* Enhanced edges remain visible */}
            <path d={getEdgePath(0, 1)} stroke={NEON_GREEN} strokeWidth="1.5" fill="none" filter="url(#glow)" opacity={0.5} />
            <path d={getEdgePath(0, 2)} stroke={NEON_GREEN} strokeWidth="1.5" fill="none" filter="url(#glow)" opacity={0.5} />
            <path d={getEdgePath(1, 3)} stroke={NEON_GREEN} strokeWidth="1.5" fill="none" filter="url(#glow)" opacity={0.5} />
            <path d={getEdgePath(2, 4)} stroke={NEON_GREEN} strokeWidth="1.5" fill="none" filter="url(#glow)" opacity={0.5} />
            <path d={getEdgePath(4, 5)} stroke={NEON_GREEN} strokeWidth="1.5" fill="none" filter="url(#glow)" opacity={0.5} />
            <path d={getEdgePath(5, 6)} stroke={NEON_GREEN} strokeWidth="1.5" fill="none" filter="url(#glow)" opacity={0.5} />
            <path d={getEdgePath(6, 7)} stroke={NEON_GREEN} strokeWidth="1.5" fill="none" filter="url(#glow)" opacity={0.5} />
            <path d={getEdgePath(7, 8)} stroke={NEON_GREEN} strokeWidth="1.5" fill="none" filter="url(#glow)" opacity={0.5} />
            <path d={getEdgePath(8, 9)} stroke={NEON_GREEN} strokeWidth="1.5" fill="none" filter="url(#glow)" opacity={0.5} />
          </g>
        )}

        {/* Phase 6: Controlled Collapse */}
        {phase === 5 && (
          <g>
            {/* Fading edges */}
            <motion.path
              d={getEdgePath(0, 1)}
              stroke={NEON_GREEN}
              strokeWidth="1.5"
              fill="none"
              filter="url(#glow)"
              animate={{ opacity: [0.5, 0, 0] }}
              transition={{ duration: 0.5, ease: "easeOut" }}
            />
            <motion.path
              d={getEdgePath(0, 2)}
              stroke={NEON_GREEN}
              strokeWidth="1.5"
              fill="none"
              filter="url(#glow)"
              animate={{ opacity: [0.5, 0, 0] }}
              transition={{ duration: 0.5, ease: "easeOut" }}
            />
            <motion.path
              d={getEdgePath(1, 3)}
              stroke={NEON_GREEN}
              strokeWidth="1.5"
              fill="none"
              filter="url(#glow)"
              animate={{ opacity: [0.5, 0, 0] }}
              transition={{ duration: 0.5, ease: "easeOut" }}
            />
            <motion.path
              d={getEdgePath(2, 4)}
              stroke={NEON_GREEN}
              strokeWidth="1.5"
              fill="none"
              filter="url(#glow)"
              animate={{ opacity: [0.5, 0, 0] }}
              transition={{ duration: 0.5, ease: "easeOut" }}
            />
            <motion.path
              d={getEdgePath(4, 5)}
              stroke={NEON_GREEN}
              strokeWidth="1.5"
              fill="none"
              filter="url(#glow)"
              animate={{ opacity: [0.5, 0, 0] }}
              transition={{ duration: 0.5, ease: "easeOut" }}
            />
            <motion.path
              d={getEdgePath(5, 6)}
              stroke={NEON_GREEN}
              strokeWidth="1.5"
              fill="none"
              filter="url(#glow)"
              animate={{ opacity: [0.5, 0, 0] }}
              transition={{ duration: 0.5, ease: "easeOut" }}
            />
            <motion.path
              d={getEdgePath(6, 7)}
              stroke={NEON_GREEN}
              strokeWidth="1.5"
              fill="none"
              filter="url(#glow)"
              animate={{ opacity: [0.5, 0, 0] }}
              transition={{ duration: 0.5, ease: "easeOut" }}
            />
            <motion.path
              d={getEdgePath(7, 8)}
              stroke={NEON_GREEN}
              strokeWidth="1.5"
              fill="none"
              filter="url(#glow)"
              animate={{ opacity: [0.5, 0, 0] }}
              transition={{ duration: 0.5, ease: "easeOut" }}
            />
            <motion.path
              d={getEdgePath(8, 9)}
              stroke={NEON_GREEN}
              strokeWidth="1.5"
              fill="none"
              filter="url(#glow)"
              animate={{ opacity: [0.5, 0, 0] }}
              transition={{ duration: 0.5, ease: "easeOut" }}
            />

            {/* Letters returning to stack in reverse order */}
            {letters.map((letter, index) => {
              const semicirclePos = getSemicirclePosition(letter, index);
              const stackPos = getStackPosition(9 - index); // Reverse order
              const path = getCurvedPath(semicirclePos, stackPos);
              
              return (
                <motion.g key={`returning-${letter}-${index}`}>
                  <motion.path
                    d={path}
                    stroke={NEON_GREEN}
                    strokeWidth="1"
                    fill="none"
                    filter="url(#glow)"
                    opacity={0.3}
                    initial={{ pathLength: 0 }}
                    animate={{ pathLength: 1 }}
                    transition={{ duration: 1, ease: "easeInOut" }}
                  />
                  
                  <motion.circle
                    cx={semicirclePos.x}
                    cy={semicirclePos.y}
                    r="24"
                    fill="none"
                    stroke={NEON_GREEN}
                    strokeWidth="2.25"
                    filter="url(#glow)"
                    animate={{
                      cx: stackPos.x,
                      cy: stackPos.y,
                      opacity: [0.7, 0.6]
                    }}
                    transition={{
                      delay: index * 0.1,
                      duration: 1,
                      ease: "easeIn"
                    }}
                  />
                  <motion.text
                    x={semicirclePos.x}
                    y={semicirclePos.y}
                    fill={NEON_GREEN}
                    fontSize="18"
                    fontWeight="600"
                    textAnchor="middle"
                    dominantBaseline="middle"
                    filter="url(#glow)"
                    animate={{
                      x: stackPos.x,
                      y: stackPos.y,
                      opacity: [0.8, 0.7]
                    }}
                    transition={{
                      delay: index * 0.1,
                      duration: 1,
                      ease: "easeIn"
                    }}
                  >
                    {letter}
                  </motion.text>
                </motion.g>
              );
            })}
          </g>
        )}
      </svg>
    </div>
  );
}
