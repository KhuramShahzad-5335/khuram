import type {MetadataRoute} from 'next';
import {siteUrl} from '@/lib/content';
export const dynamic='force-static';
export default function robots():MetadataRoute.Robots{return {rules:{userAgent:'*',allow:process.env.NEXT_PUBLIC_SITE_URL?'/':undefined,disallow:process.env.NEXT_PUBLIC_SITE_URL?['/blog/welcome/']:'/'},sitemap:siteUrl+'/sitemap.xml'}}
