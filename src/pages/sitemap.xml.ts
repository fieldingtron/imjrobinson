import type { APIRoute } from 'astro'

import { SITE_URL } from '../consts/site'

const publicRoutes = [
  '/',
  '/about/',
  '/assemblages/',
  '/contact/',
  '/gallery/',
  '/paintings/',
  '/photos/',
  '/privacy/',
  '/shows/',
  '/terms/',
]

const buildUrl = (path: string) => new URL(path, SITE_URL).toString()

export const GET: APIRoute = () => {
  const lastmod = new Date().toISOString()
  const urls = publicRoutes
    .map(
      (path) => `<url><loc>${buildUrl(path)}</loc><lastmod>${lastmod}</lastmod></url>`,
    )
    .join('')

  const body = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">${urls}</urlset>`

  return new Response(body, {
    headers: {
      'Content-Type': 'application/xml; charset=utf-8',
    },
  })
}
