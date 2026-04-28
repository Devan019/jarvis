type JarvisControlsProps = {
  isPlaying: boolean;
  currentEmotion: string;
  availableAnimations: string[];
  onPlayAudio: () => void;
  onSetEmotion: (emotion: string) => void;
  onPlayAnimation: (animationName: string) => void;
};

export function JarvisControls({
  isPlaying,
  currentEmotion,
  availableAnimations,
  onPlayAudio,
  onSetEmotion,
  onPlayAnimation,
}: JarvisControlsProps) {
  return (
    <>
      {!isPlaying && (
        <button
          type="button"
          onClick={onPlayAudio}
          className="inline-flex items-center justify-center rounded-lg border-0 bg-[#0070f3] px-5 py-2.5 font-medium text-white shadow-lg shadow-blue-500/20 transition-colors duration-200 hover:bg-blue-500"
        >
          Play Audio
        </button>
      )}

      <div className="flex flex-col gap-2">
        <h3 className="m-0 mb-1 text-sm font-medium text-white/90">
          Emotions (ExpressionManager)
        </h3>
        <div className="flex flex-wrap gap-2">
          {['neutral', 'happy', 'angry', 'sad'].map((emotion) => (
            <button
              key={emotion}
              type="button"
              onClick={() => onSetEmotion(emotion)}
              className={`inline-flex items-center justify-center rounded-md border-0 px-3 py-1.5 font-medium text-white transition-colors duration-200 ${currentEmotion === emotion ? 'bg-[#ff3366] hover:bg-[#ff4d7a]' : 'bg-white/10 hover:bg-white/20'}`}
            >
              {emotion.toUpperCase()}
            </button>
          ))}
        </div>
      </div>

      {availableAnimations.length > 0 && (
        <div className="flex flex-wrap gap-2">
          {availableAnimations.map((animName) => (
            <button
              key={animName}
              type="button"
              onClick={() => onPlayAnimation(animName)}
              className="inline-flex items-center justify-center rounded-md border-0 bg-[#ff6b6b] px-4 py-2 text-sm font-medium text-white transition-colors duration-200 hover:bg-[#ff8080]"
            >
              {animName}
            </button>
          ))}
        </div>
      )}
    </>
  );
}