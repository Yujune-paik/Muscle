export type YouTubeEmbedProps = {
  videoId: string;
  title: string;
  onError?: () => void;
};

export function YouTubeEmbed(props: YouTubeEmbedProps): import('react').ReactElement;
