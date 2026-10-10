import {projects} from '@/lib/content';
import {ProjectCard} from '@/components/project-card';
export const metadata={title:'Projects',description:'Explore Khuram Shahzad’s web projects, technologies, and development journeys.',alternates:{canonical:'/projects/'}};
export default function Page(){return <main id="main" className="page-main"><span className="eyebrow">THE WORK / PROJECT INDEX</span><h1>Built to be used.<br/><span className="muted">Made with curiosity.</span></h1><p className="page-intro">Business websites, practical interfaces, and a little applied AI.<br/>A growing collection, with the stories behind the code.</p><div className="project-grid">{projects.map((p,i)=><ProjectCard key={p.slug} project={p} index={i}/>)}</div></main>}
