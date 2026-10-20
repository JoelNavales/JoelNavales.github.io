import { useEffect, useRef, useState } from 'react';
import { motion } from 'motion/react';
import type { MotionStyle } from 'motion/react';
import type { ProjectVideo } from '../lib/videos';

// A muted hover preview laid over a project's thumbnail, like a video site's: while `playing`
// it starts from the beginning and fades in once frames arrive, so the poster shows until then.
// Stopping fades back to the poster. Nothing downloads until the first hover.
export default function PreviewVideo({
  video,
  playing,
  className,
  style,
}: {
  video: ProjectVideo;
  playing: boolean;
  className?: string;
  style?: MotionStyle;
}) {
  const element = useRef<HTMLVideoElement>(null);
  const [shown, setShown] = useState(false);

  useEffect(() => {
    const preview = element.current;
    if (!preview) return;
    if (playing) {
      preview.currentTime = 0;
      preview.play().catch(() => {});
    } else {
      preview.pause();
      setShown(false);
    }
  }, [playing]);

  return (
    <motion.video
      ref={element}
      className={className}
      style={{ ...style, opacity: shown ? 1 : 0 }}
      onPlaying={() => setShown(true)}
      aria-hidden="true"
      tabIndex={-1}
      muted
      loop
      playsInline
      preload="none"
    >
      {video.sources.map((source) => (
        <source key={source.src} src={source.src} type={source.type} />
      ))}
    </motion.video>
  );
}
