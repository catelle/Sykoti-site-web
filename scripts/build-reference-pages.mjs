import fs from 'node:fs'

const sourcePath = process.argv[2]
if (!sourcePath) throw new Error('Pass the pasted HTML file path')

const source = fs.readFileSync(sourcePath, 'utf8')
const pagePattern = /<!-- Sykoti Center - ([^-]+(?:&[^-]+)?) -->\s*<!DOCTYPE html>[\s\S]*?<body[^>]*>([\s\S]*?)<\/body><\/html>/g

const pageKeys = {
  'Home': 'home',
  'About Us': 'about',
  'Programmes & Actions': 'programs',
  'Impact & 2026 Results': 'impact',
  'Blog & Insights': 'resources',
  'Get Involved & Donate': 'get-involved',
  '2026 Report Downloads': 'reports',
}

const imagePools = {
  home: [
    'cyberambassador/media/gallery/graduation-group.jpg',
    'cyberambassador/media/gallery/jeunes-connectes-workshop.png',
    'cyberambassador/media/gallery/community-action.jpg',
    'cyberambassador/media/gallery/graduation-ceremony.png',
    'cyberambassador/media/gallery/platform-module.png',
    'cyberambassador/media/gallery/cyber-attacks-webinar.png',
  ],
  about: [
    'cyberambassador/media/gallery/graduation-group.jpg',
    'cyberambassador/media/gallery/community-action.jpg',
    'cyberambassador/media/mokam-dora.jpeg',
    'cyberambassador/media/kouatchou-lyne-dehlia.jpeg',
    'cyberambassador/media/samson-fawa.jpeg',
    'cyberambassador/media/lesly-voumo.jpeg',
  ],
  programs: [
    'cyberambassador/media/gallery/community-action.jpg',
    'cyberambassador/media/gallery/platform-module.png',
    'cyberambassador/media/gallery/jeunes-connectes-workshop.png',
    'cyberambassador/media/gallery/graduation-ceremony.png',
    'cyberambassador/media/gallery/fellows-2026.jpg',
  ],
  impact: [
    'cyberambassador/media/gallery/graduation-group.jpg',
    'cyberambassador/media/gallery/community-action.jpg',
    'cyberambassador/media/gallery/jeunes-connectes-workshop.png',
    'cyberambassador/media/gallery/graduation-ceremony.png',
    'cyberambassador/media/gallery/platform-dashboard.png',
  ],
  resources: [
    'cyberambassador/media/gallery/cyber-attacks-webinar.png',
    'cyberambassador/media/gallery/jeunes-connectes-workshop.png',
    'cyberambassador/media/gallery/platform-module.png',
    'cyberambassador/media/gallery/community-action.jpg',
  ],
  'get-involved': [
    'cyberambassador/media/gallery/graduation-group.jpg',
    'cyberambassador/media/gallery/community-action.jpg',
    'cyberambassador/media/gallery/jeunes-connectes-workshop.png',
  ],
  reports: [
    'cyberambassador/media/gallery/fellows-2026.jpg',
    'cyberambassador/media/gallery/platform-dashboard.png',
    'cyberambassador/media/gallery/graduation-ceremony.png',
  ],
}

const pages = {}
for (const match of source.matchAll(pagePattern)) {
  const title = match[1].trim()
  const key = pageKeys[title]
  if (!key) continue

  let imageIndex = 0
  const pool = imagePools[key]
  let html = match[2]
    .replace(/<script[\s\S]*?<\/script>/gi, '')
    .replace(/src="https:\/\/lh3\.googleusercontent\.com\/aida\/[^"]+"/g, 'src="__BASE__img/logo.png"')
    .replace(/src="https:\/\/lh3\.googleusercontent\.com\/aida-public\/[^"]+"/g, () => {
      const image = pool[imageIndex % pool.length]
      imageIndex += 1
      return `src="__BASE__${image}"`
    })
    .replace(/href="#"([^>]*data-path="admin-console")/g, 'href="__BASE__admin.html"$1')

  pages[key] = html
}

const missing = Object.values(pageKeys).filter(key => !pages[key])
if (missing.length) throw new Error(`Missing reference pages: ${missing.join(', ')}`)

const output = `// Generated from the user-provided reference HTML.\nexport const referencePages = ${JSON.stringify(pages, null, 2)}\n`
fs.writeFileSync(new URL('../src/referencePages.js', import.meta.url), output)

console.log(`Generated ${Object.keys(pages).length} reference pages.`)
