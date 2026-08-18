type YouTubeEmbedProps = {
  videoId: string;
  title: string;
  onError?: () => void;
};

export function YouTubeEmbed({ videoId, title, onError }: YouTubeEmbedProps) {
  const origin = typeof window === 'undefined' ? '' : `&origin=${encodeURIComponent(window.location.origin)}`;
  return (
    <iframe
      src={`https://www.youtube-nocookie.com/embed/${videoId}?playsinline=1&rel=0${origin}`}
      title={title}
      loading="lazy"
      allow="accelerometer; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
      allowFullScreen
      onError={onError}
      referrerPolicy="strict-origin-when-cross-origin"
      style={{ border: 0, display: 'block', height: '100%', width: '100%' }}
    />
  );
}
