import Link from 'next/link';
import Image from 'next/image';
import {ArrowUpRight} from 'lucide-react';
import {type Post,wordCount,readingMinutes} from '@/lib/posts';
export function BlogCard({post}:{post:Post}){return <Link className="blog-card" href={'/blog/'+post.slug+'/'}><div className="blog-card-image"><Image src={post.image} alt={post.imageAlt} width={1200} height={720}/></div><div className="blog-card-label"><span className="eyebrow">{post.category}</span><ArrowUpRight size={16}/></div><h2>{post.title}</h2><p>{post.excerpt}</p><div className="post-stats"><span>{wordCount(post).toLocaleString()} words</span><span>{readingMinutes(post)} min read</span></div></Link>}
