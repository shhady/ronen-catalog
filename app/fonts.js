import localFont from 'next/font/local';

export const rubik = localFont({
  src: [
    {
      path: '../public/fonts/Rubik-Regular.woff2',
      weight: '400',
      style: 'normal',
    },
    {
      path: '../public/fonts/Rubik-Medium.woff2',
      weight: '500',
      style: 'normal',
    },
    {
      path: '../public/fonts/Rubik-Bold.woff2',
      weight: '700',
      style: 'normal',
    },
  ],
  variable: '--font-rubik',
  display: 'swap',
}); 