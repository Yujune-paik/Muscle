import type { PropsWithChildren } from 'react';

export default function Root({ children }: PropsWithChildren) {
  return (
    <html lang="ja">
      <head>
        <meta charSet="utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1, viewport-fit=cover" />
        <meta name="theme-color" content="#0A0A0B" />
        <meta name="description" content="ジムで次に使う一台だけを案内する、初心者向けトレーニングナビゲーション。" />
        <title>NXTSET — 次の一台だけ、見ればいい。</title>
      </head>
      <body>{children}</body>
    </html>
  );
}
