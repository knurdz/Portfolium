
export const PORTFOLIO_TEMPLATES = {
  ANIMATED: {
    name: "Animated Modern",
    imagePath: "/templates/animated.png",
    description: "Vibrant and interactive with smooth CSS animations and transitions.",
    systemPrompt: `Focus on a vibrant, modern design with:
- Intersection Observer animations for sections (fade-in, slide-up)
- Hover effects on cards and buttons
- Interactive background elements (e.g., floating shapes or subtle gradients)
- Smooth scrolling
- Progress indicators`,
  },
  THREE_D: {
    name: "3D Perspective",
    imagePath: "/templates/3d.png",
    description: "A unique look using CSS 3D transforms and perspective effects.",
    systemPrompt: `Focus on a 3D perspective design using CSS only:
- Card tilt effects on hover
- Parallax scrolling effects
- 3D-style depth with shadows and layers
- Skewed and rotated container elements for a dynamic look
- Neomorphic or Glassmorphic card styles`,
  },
  PROFESSIONAL: {
    name: "Corporate Professional",
    imagePath: "/templates/professional.png",
    description: "Clean, trustworthy, and highly readable. Perfect for executives or consultants.",
    systemPrompt: `Focus on a clean, professional corporate design:
- Minimalist typography (serif headers, sans-serif body)
- Subdued color palette (navy, slate, white)
- Clear hierarchy and plenty of white space
- Solid bordering and subtle shadows
- Emphasis on metrics and testimonials`,
  },
  MUSICIAN: {
    name: "Artist / Musician",
    imagePath: "/templates/musician.png",
    description: "Bold, moody, and media-focused. Designed for creative performers.",
    systemPrompt: `Focus on a bold, artistic design for musicians:
- Dark theme by default (deep blacks, neon accents)
- Large hero images or video placeholders
- Timeline for discography or tour dates
- Specialized contact section for booking
- Bold, expressive typography`,
  },
  DEVELOPER: {
    name: "Software Engineer",
    imagePath: "/templates/developer.png",
    description: "Tech-focused, highlighting code, projects, and technical skills.",
    systemPrompt: `Focus on a technical design for software developers:
- Code-snippet style highlights
- Project grid with tech stack badges
- GitHub/LinkedIn integration focus
- Terminal-inspired elements (fonts, borders)
- Dark/Light mode toggle compatibility`,
  },
};
