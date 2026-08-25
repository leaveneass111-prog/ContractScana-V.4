import React from 'react';

interface GarudaEmblemProps {
  size?: 'sm' | 'md' | 'lg';
  showFrame?: boolean;
  className?: string;
}

export const GarudaEmblem: React.FC<GarudaEmblemProps> = ({
  size = 'md',
  showFrame = true,
  className = '',
}) => {
  const sizeClasses = {
    sm: 'w-12 h-12',
    md: 'w-20 h-20',
    lg: 'w-28 h-28',
  };

  const emblemSvg = (
    <svg
      viewBox="0 0 100 100"
      className={`${sizeClasses[size]} fill-current text-amber-600 dark:text-amber-500 drop-shadow-sm`}
      aria-label="ตราครุฑทางการ"
    >
      {/* Thai Government Royal Garuda Emblem Vector Silhouette */}
      <path d="M50,12 C47,15 45,20 45,24 C45,27 47,30 50,32 C53,30 55,27 55,24 C55,20 53,15 50,12 Z" />
      {/* Crown / Chada */}
      <path d="M50,4 L53,10 L47,10 Z" />
      <path d="M50,10 L52,14 L48,14 Z" />
      {/* Head and Beak */}
      <path d="M47,20 C45,21 44,23 45,25 C46,26 48,27 50,27 C52,27 54,26 55,25 C56,23 55,21 53,20 Z" />
      <path d="M48,24 L50,29 L52,24 Z" />
      {/* Body & Chest */}
      <path d="M44,32 C42,38 43,45 45,52 C46,55 48,58 50,60 C52,58 54,55 55,52 C57,45 58,38 56,32 C54,34 52,35 50,35 C48,35 46,34 44,32 Z" />
      {/* Outstretched Wings - Left */}
      <path d="M44,28 C37,23 27,21 16,25 C12,27 9,30 6,34 C12,34 18,36 24,39 C17,40 11,43 8,48 C14,48 20,49 26,52 C19,54 14,58 11,63 C18,62 25,62 31,63 C36,64 41,58 44,52 C43,45 43,38 44,28 Z" />
      <path d="M16,25 C23,28 30,33 36,38 C28,38 21,39 14,42 C20,45 27,47 34,49 C26,51 20,54 15,58 C21,59 28,59 34,60 C38,55 41,47 43,40 Z" opacity="0.8" />
      {/* Outstretched Wings - Right */}
      <path d="M56,28 C63,23 73,21 84,25 C88,27 91,30 94,34 C88,34 82,36 76,39 C83,40 89,43 92,48 C86,48 80,49 74,52 C81,54 86,58 89,63 C82,62 75,62 69,63 C64,64 59,58 56,52 C57,45 57,38 56,28 Z" />
      <path d="M84,25 C77,28 70,33 64,38 C72,38 79,39 86,42 C80,45 73,47 66,49 C74,51 80,54 85,58 C79,59 72,59 66,60 C62,55 59,47 57,40 Z" opacity="0.8" />
      {/* Arms & Hands */}
      <path d="M43,34 C38,36 33,39 30,44 C33,45 36,44 40,41 C41,43 43,45 44,48 Z" />
      <path d="M57,34 C62,36 67,39 70,44 C67,45 64,44 60,41 C59,43 57,45 56,48 Z" />
      {/* Lower Body & Feathers / Tail */}
      <path d="M46,60 C44,66 42,73 40,80 C44,79 47,77 50,75 C53,77 56,79 60,80 C58,73 56,66 54,60 Z" />
      <path d="M50,75 C48,82 46,89 44,96 C48,94 50,92 50,90 C50,92 52,94 56,96 C54,89 52,82 50,75 Z" />
      <path d="M42,80 C37,84 32,88 28,94 C33,92 38,90 43,89 Z" />
      <path d="M58,80 C63,84 68,88 72,94 C67,92 62,90 57,89 Z" />
      {/* Talons / Claws */}
      <path d="M44,64 C42,67 40,71 38,76 C41,75 43,73 45,70 Z" />
      <path d="M56,64 C58,67 60,71 62,76 C59,75 57,73 55,70 Z" />
    </svg>
  );

  if (!showFrame) {
    return <div className={`flex items-center justify-center ${className}`}>{emblemSvg}</div>;
  }

  return (
    <div
      id="garuda-emblem-frame"
      className={`inline-flex items-center justify-center p-3 rounded-2xl neu-flat ${className}`}
      title="ตราครุฑทางการสำหรับหนังสือราชการไทย"
    >
      {emblemSvg}
    </div>
  );
};
