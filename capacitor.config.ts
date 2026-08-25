import type { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'com.mykboy.holyvibe',
  appName: 'Holy Vibe',
  // Тека, куди копіюються ваші веб-файли (index.html, app.js, styles.css,
  // verses.json, backgrounds.json, lang/, audio/, assets/bg/) перед білдом.
  // Просто скопіюйте вміст репозиторію holy-vibe сюди.
  webDir: 'www',
  plugins: {
  CapacitorUpdater: {
  autoUpdate: false, // було 'off' — тепер гарантовано boolean, без ризику непідтримки рядка
  },
},
};

export default config;
