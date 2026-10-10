import type {MetadataRoute} from 'next';
import {siteUrl,projects,experiments} from '@/lib/content';
import {posts} from '@/lib/posts';
export const dynamic='force-static';
export default function sitemap():MetadataRoute.Sitemap{return ['','/projects/','/blog/','/experiments/',...projects.map(p=>'/projects/'+p.slug+'/'),...experiments.map(e=>'/experiments/'+e.slug+'/'),...posts.map(p=>'/blog/'+p.slug+'/')].map(path=>({url:siteUrl+path}))}
