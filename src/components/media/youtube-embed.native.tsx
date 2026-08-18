import { StyleSheet } from 'react-native';
import { WebView } from 'react-native-webview';

type YouTubeEmbedProps = {
  videoId: string;
  title: string;
  onError?: () => void;
};

export function YouTubeEmbed({ videoId, onError }: YouTubeEmbedProps) {
  const appOrigin = 'https://yujune-paik.github.io/Muscle/';
  const uri = `https://www.youtube-nocookie.com/embed/${videoId}?playsinline=1&rel=0&origin=${encodeURIComponent(appOrigin)}`;
  return (
    <WebView
      source={{ uri, headers: { Referer: appOrigin } }}
      style={styles.root}
      allowsFullscreenVideo
      allowsInlineMediaPlayback
      mediaPlaybackRequiresUserAction
      javaScriptEnabled
      onError={onError}
      originWhitelist={['https://*']}
    />
  );
}

const styles = StyleSheet.create({ root: { flex: 1, backgroundColor: '#000000' } });
