# 💌 Love Letter Animation

A tiny interactive love-letter experience made with **HTML, CSS, and vanilla JavaScript**. Aim and release Cupid’s bow to open the envelope, meet a pixel-art cat, and choose your answer to a playful question.

> **No build tools or package installation required.** Open the page in a modern browser and it is ready to play.

## ✨ The experience

1. **Aim the bow** at the envelope. Press or touch the bow area, pull back, and release to shoot.
2. **Open the letter.** If the arrow reaches the envelope, the letter opens and the question appears.
3. **Choose an answer.** The **NO** button playfully dodges the pointer; choose **YES** to reveal the happy ending.
4. **Enjoy the celebration.** Hearts, confetti, and a dancing cat accompany the animated final message.

## 🌸 Features

- Pointer and touch interaction for the bow-and-arrow animation
- Animated envelope, floating hearts, and heart-shaped confetti
- Pixel-art cat drawn directly on an HTML canvas
- Playful, moving **NO** button and a growing **YES** button
- Typewriter-style reveal for the final message
- Responsive presentation for different screen sizes

## 🚀 Run it

### Quick start

Open `index.html` in a modern web browser.

### Run from a local server

You can also serve the project folder with a static web server. For example, if Python is installed:

```bash
python -m http.server 8000
```

Then visit [http://localhost:8000](http://localhost:8000) in your browser.

## 🖊️ Make it yours

- **Change the words:** Edit the `TEXT` object near the top of `script.js`. It contains the envelope label and hint, question, success heading and message, and the rotating **NO** button captions.
- **Change the look:** Adjust colors, typography, spacing, and animations in `style.css`.
- **Change the cat:** `CAT_SAD` and `CAT_HAPPY` in `script.js` define the canvas pixel maps; `COLORS` maps their characters to colors.

The final message supports a `<mark>` element for its highlighted word. If you change the message, keep any HTML markup balanced.

## 📁 Project files

| File | Purpose |
| --- | --- |
| `index.html` | Page structure, SVG envelope and bow, canvas, and message elements |
| `style.css` | Layout, visual theme, responsive sizing, and animations |
| `script.js` | Editable copy, pointer interaction, game flow, and visual effects |

## ℹ️ Notes

The page loads **Pixelify Sans** from Google Fonts, so an internet connection is needed for that font. The interaction itself runs locally in the browser and does not use a backend.
