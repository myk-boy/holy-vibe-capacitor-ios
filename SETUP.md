# Holy Vibe — Capacitor: покрокова інструкція

## 0. Що це за папка

Це стартовий каркас. Ваші реальні файли (`index.html`, `app.js`, `styles.css`,
`verses.json`, `backgrounds.json`, `lang/`, `audio/`, `assets/bg/`) з
репозиторію `myk-boy/holy-vibe` сюди ще треба скопіювати — вручну або
git-клоном. Вони НЕ переписуються, лишаються як є.

## 1. Встановити інструменти (один раз)

1. Встановіть **Node.js** (LTS, версія 20+): https://nodejs.org
2. Перевірте в терміналі:
   ```
   node -v
   npm -v
   ```

## 2. Зібрати проєкт

```bash
cd holy-vibe-capacitor
npm install
```

Скопіюйте вміст вашого репозиторію `holy-vibe` (усе, окрім `.git`) у
папку `www/` цього проєкту:

```
www/index.html
www/app.js
www/i18n.js
www/styles.css
www/verses.json
www/backgrounds.json
www/lang/...
www/audio/...
www/assets/bg/...
```

У `www/index.html`, прямо перед тегом `<script src="app.js">`, додайте:
```html
<script src="native-bridge.js"></script>
```
(це і є той місток, що замінює `window.AndroidBridge` на кросплатформні виклики)

## 3. Додати платформи

```bash
npx cap add android
npx cap add ios
npx cap sync
```

Команда `npx cap add ios` створить папку `ios/` з Xcode-проєктом. Її не
можна відкрити без Mac — але вона все одно потрібна, бо саме її буде
збирати хмарний CI (наступний крок).

## 4. Android — можна зібрати вже зараз локально

Якщо є Android Studio — відкрийте `npx cap open android`, зберіть APK
як завжди. Логіку з вашого старого `MainActivity.java` (share, нагадування,
фонове аудіо) тепер виконують плагіни з `native-bridge.js`, отже старий
Java-код можна прибрати — WebView налаштує сам Capacitor.

## 5. iOS — збірка без Mac через хмарний CI

Рекомендований сервіс: **Codemagic** (codemagic.io) — має готовий шаблон
саме під Capacitor-проєкти.

1. Зареєструйте Apple Developer Program ($99) на developer.apple.com.
2. Зареєструйтесь на Codemagic, підключіть цей GitHub-репозиторій.
3. Codemagic сам запропонує "Capacitor" workflow — виберіть автоматичний
   підпис (automatic code signing), під'єднавши Apple Developer акаунт
   через App Store Connect API Key (генерується у Codemagic, інструкція
   з'явиться на екрані).
4. Запустіть білд — Codemagic видасть `.ipa` файл і може одразу
   відправити його у TestFlight.
5. Друг з iPhone встановлює застосунок **TestFlight** з App Store і
   приймає запрошення — це і є ваш тест на реальному iPhone без Mac.

## 6. Автооновлення веб-контенту (та сама фішка, що й була в Android)

- Workflow `.github/workflows/build-release.yml` вже в цьому проєкті:
  щоразу, як ви змінюєте `index.html`/`app.js`/тощо в `main` гілці
  вихідного репозиторію, GitHub автоматично збирає zip і публікує
  як Release.
- `capacitor.config.ts` вказує плагіну `@capgo/capacitor-updater`, звідки
  брати оновлення.

  ⚠️ **Звірте актуальний формат `updateUrl`/`autoUpdate` з документацією
  плагіна перед білдом** — https://github.com/Cap-go/capacitor-updater —
  формат manifest-файлу міг трохи змінитись відколи писався цей гайд.
  Якщо самостійний формат видасться складним — є простіший шлях:
  використати безкоштовний тариф хмарного сервісу Capgo (capgo.app),
  який керує всім автоматично (upload → версії → rollback), а ваш
  GitHub Actions просто виконує `npx @capgo/cli bundle upload` замість
  збирання zip вручну.

- Ваша стара логіка "перший запуск = завантажити напряму з мережі,
  наступні = офлайн з кешу" тут вже вбудована в сам плагін —
  окремо реалізовувати не треба.

## Що можна прибрати зі старого Android-проєкту

- `MainActivity.java` — уся логіка кешування/синку більше не потрібна
  (її взяв на себе Capacitor + updater-плагін).
- `WebAppInterface` — замінено на `native-bridge.js`.
- `AlarmReceiver.java`, `AudioBackgroundService.java` — залиште на
  довідку, поки не переконаєтесь, що `@capacitor/local-notifications`
  і аудіо-рішення повністю покривають потрібну поведінку (особливо
  точний час будильника і поведінка при вбитому застосунку — варто
  протестувати окремо).
