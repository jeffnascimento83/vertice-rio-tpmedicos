# TP Médicos — Tráfego Pago para Profissionais de Saúde

Platform deployment structure for tpmedicos.verticerio.com.br

## 📂 Directory Structure

```
vertice-rio-tpmedicos/
├── index.html                 # Landing page with navigation
├── apresentacao/              # 20-slide presentation (standalone)
│   └── index.html            # Full presentation with controls
├── plano/                      # Interactive form + results screen
│   ├── index.html            # Form interface (5 steps)
│   └── app.js                # Application logic
├── vercel.json               # Deployment configuration
└── README.md                 # This file
```

## 🚀 Local Testing

### Using Python HTTP Server (Recommended)

```bash
cd vertice-rio-tpmedicos/
python3 -m http.server 3030
```

Then open: `http://localhost:3030`

**Navigation:**
- Home: `http://localhost:3030`
- Apresentação: `http://localhost:3030/apresentacao/`
- Plano: `http://localhost:3030/plano/`

### Using Node HTTP Server

```bash
npx http-server . -p 3030 -c-1
```

### Browser Requirements

- Modern browser (Chrome, Safari, Firefox, Edge)
- UTF-8 encoding (all files are properly encoded)
- JavaScript enabled (required for plano form interactivity)
- Pop-up windows allowed (for WhatsApp share feature)

## 📊 Feature Breakdown

### Landing Page (`/`)
- Hero section with call-to-action buttons
- Feature grid explaining the 3-step process
- Link to presentation and plano
- Responsive design for mobile

### Apresentação (`/apresentacao/`)
- 20-slide presentation about paid traffic for healthcare
- Full keyboard navigation (arrow keys)
- Click navigation via dot indicators
- Topics:
  - Diagnosis: 3 profiles of doctors in digital
  - Meta Ads: Lead capture strategy
  - Google Ads: Search intent capture
  - Google Meu Negócio: Local optimization
  - Implementation roadmap

### Plano (`/plano/`)
**5-Step Interactive Form**
1. **Negócio**: Clinic info, Instagram, Landing page, GMB
2. **Público**: Age range, gender, location, motivation
3. **Barreiras**: Conversion blockers and solutions
4. **Estratégia**: Channel selection, budget, offer, targets
5. **Compromisso**: Concrete next action (10-day commitment)

**Output Screen (Auto-Generated)**
- Dark hero section with clinic name
- 4 strategic sections with platform-specific guidance
- KPI projections (leads, CPA, conversion rate)
- Implementation checklists for Meta, Google Ads, GMB
- Scaling criteria for day 30
- Print button (native browser print)
- WhatsApp share (generates PDF via html2pdf.js)

**Gamification**
- XP progress bar (0-100%)
- Level progression (Iniciante → Mestre)
- Step completion checkmarks
- Confetti animation on plan completion

## 🌐 Vercel Deployment

### Prerequisites
- Vercel account (free tier works)
- Git repository (GitHub/GitLab/Bitbucket)

### Deploy Steps

1. **Push to Git Repository**
   ```bash
   cd vertice-rio-tpmedicos
   git init
   git add .
   git commit -m "Initial deployment: TP Médicos"
   git remote add origin https://github.com/your-user/your-repo.git
   git push -u origin main
   ```

2. **Connect to Vercel**
   - Go to [vercel.com](https://vercel.com)
   - Click "New Project"
   - Select your Git repository
   - Root Directory: `vertice-rio-tpmedicos` (or keep default if this is the repo root)
   - Click "Deploy"

3. **Configure DNS** (After Vercel deployment)
   - Get Vercel's deployment URL
   - In your domain registrar, add CNAME record:
     - `tpmedicos` → `cname.vercel.com`
   - Or use Vercel's DNS hosting for easier management

### Vercel Configuration
The `vercel.json` file handles:
- Static site deployment (no build required)
- Cache headers (1 hour for static assets)
- Security headers (no-sniff, same-origin framing)
- Trailing slash handling

## 📱 Responsive Design

All pages are fully responsive:
- **Desktop** (1024px+): Multi-column layouts, full feature sets
- **Tablet** (640-1024px): Optimized spacing, readable text
- **Mobile** (<640px): Single-column, touch-friendly buttons

## 🎨 Brand Colors

- **Primary Brown**: `#7d5f38`
- **Dark Brown**: `#261a0c`
- **Light Background**: `#f0e9dc`
- **White Surface**: `#ffffff`
- **Muted Text**: `#7a6a52`

Presentation uses DM Sans and DM Serif Display. Plano uses Inter.

## 🔒 Security Notes

- All HTML files use UTF-8 encoding (no character issues)
- No backend required (static files only)
- Form data stays in browser memory (not sent to server)
- PDF generation uses client-side library (html2pdf.js from CDN)
- WhatsApp sharing uses native share API or link redirect

## 🐛 Troubleshooting

### Form won't advance to next step
- Check browser console for validation errors
- Ensure all required fields (marked with *) are filled
- Try refreshing the page

### PDF download not working on mobile
- iOS/Android: Use "Share to Files" or "Share to Email" options
- The PDF will be generated, then offer native share dialog

### Presentation slides won't change
- Check that JavaScript is enabled
- Use arrow keys or click the navigation dots
- Try different browser if issue persists

### Images/styling not loading
- Hard refresh: Cmd+Shift+R (Mac) or Ctrl+Shift+R (Windows)
- Check browser console for 404 errors
- Ensure all paths are relative (not absolute URLs)

## 📈 Analytics & Tracking

Currently, no analytics or tracking is configured. To add:

1. **Google Analytics**
   - Add GA4 script to `<head>` of each HTML file
   - Track page views and form completions

2. **Form Submissions**
   - Integrate with CRM (Salesforce, Pipedrive, etc.)
   - Use Zapier/Make.com to connect form data to email/CRM

3. **Heatmaps**
   - Add Hotjar or Clarity script for user interaction tracking

## 📞 Contact & Support

- **Built by**: Vértice Rio
- **For healthcare professional lead generation**
- **Email**: jefferson@verticerio.com.br

---

**Last Updated**: May 28, 2026
**Version**: 1.0.0
