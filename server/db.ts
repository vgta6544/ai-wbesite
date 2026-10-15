import fs from 'fs';
import path from 'path';
import { Project, Service, ContactMessage, SiteSettings } from '../src/types.js';

const DATA_DIR = path.join(process.cwd(), 'data');
const DB_FILE = path.join(DATA_DIR, 'db.json');

export interface DatabaseSchema {
  projects: Project[];
  services: Service[];
  messages: ContactMessage[];
  settings: SiteSettings;
}

const DEFAULT_SERVICES: Service[] = [
  {
    id: 'srv-1',
    title: 'Logo Design',
    description: 'Distinctive, memorable logos and dynamic vector marks crafted for modern brand recognition.',
    icon: 'Sparkles',
    enabled: true,
    sortOrder: 1,
    createdAt: '2026-01-10T10:00:00Z',
    updatedAt: '2026-01-10T10:00:00Z',
  },
  {
    id: 'srv-2',
    title: 'Brand Identity',
    description: 'Comprehensive brand systems including typography, color palettes, iconography, and guidelines.',
    icon: 'Layers',
    enabled: true,
    sortOrder: 2,
    createdAt: '2026-01-10T10:00:00Z',
    updatedAt: '2026-01-10T10:00:00Z',
  },
  {
    id: 'srv-3',
    title: 'Social Media Design',
    description: 'High-conversion carousel packs, Instagram grids, story visuals, and tailored platform assets.',
    icon: 'Share2',
    enabled: true,
    sortOrder: 3,
    createdAt: '2026-01-10T10:00:00Z',
    updatedAt: '2026-01-10T10:00:00Z',
  },
  {
    id: 'srv-4',
    title: 'Flyers & Posters',
    description: 'Striking promotional print and digital posters with bold typography and impactful composition.',
    icon: 'FileText',
    enabled: true,
    sortOrder: 4,
    createdAt: '2026-01-10T10:00:00Z',
    updatedAt: '2026-01-10T10:00:00Z',
  },
  {
    id: 'srv-5',
    title: 'Business Cards',
    description: 'Sleek, minimalist and modern card collateral with premium print finishes and QR integration.',
    icon: 'CreditCard',
    enabled: true,
    sortOrder: 5,
    createdAt: '2026-01-10T10:00:00Z',
    updatedAt: '2026-01-10T10:00:00Z',
  },
  {
    id: 'srv-6',
    title: 'Thumbnail Design',
    description: 'High-CTR YouTube and social media thumbnails engineered with clear visual focal points.',
    icon: 'PlaySquare',
    enabled: true,
    sortOrder: 6,
    createdAt: '2026-01-10T10:00:00Z',
    updatedAt: '2026-01-10T10:00:00Z',
  },
  {
    id: 'srv-7',
    title: 'CGI Ads',
    description: 'Hyper-realistic 3D product renders, surreal visual effects, and animated commercial reels.',
    icon: 'Box',
    enabled: true,
    sortOrder: 7,
    createdAt: '2026-01-10T10:00:00Z',
    updatedAt: '2026-01-10T10:00:00Z',
  },
  {
    id: 'srv-8',
    title: 'UGC Ads',
    description: 'Engaging, fast-paced vertical video ads optimized for TikTok, Reels, and paid digital campaigns.',
    icon: 'Video',
    enabled: true,
    sortOrder: 8,
    createdAt: '2026-01-10T10:00:00Z',
    updatedAt: '2026-01-10T10:00:00Z',
  },
  {
    id: 'srv-9',
    title: 'Web Design',
    description: 'User-centric UI/UX design, interactive wireframes, and responsive design systems in Figma.',
    icon: 'Layout',
    enabled: true,
    sortOrder: 9,
    createdAt: '2026-01-10T10:00:00Z',
    updatedAt: '2026-01-10T10:00:00Z',
  },
  {
    id: 'srv-10',
    title: 'Web Development',
    description: 'Production-ready full-stack web applications, custom interactive animations, and responsive builds.',
    icon: 'Code',
    enabled: true,
    sortOrder: 10,
    createdAt: '2026-01-10T10:00:00Z',
    updatedAt: '2026-01-10T10:00:00Z',
  },
];

const DEFAULT_PROJECTS: Project[] = [
  {
    id: 'proj-1',
    title: 'Lumina Audio — 3D Holographic CGI Campaign',
    category: 'CGI',
    description: 'A futuristic CGI product commercial exploring acoustic refraction through metallic glass surfaces and floating kinetic soundwaves. Produced with ray-traced lighting and dynamic particle simulation.',
    coverImage: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?q=80&w=1200&auto=format&fit=crop',
    images: [
      'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?q=80&w=1200&auto=format&fit=crop',
      'https://images.unsplash.com/photo-1634017839464-5c339ebe3cb4?q=80&w=1200&auto=format&fit=crop',
      'https://images.unsplash.com/photo-1633167606207-d840b5070fc2?q=80&w=1200&auto=format&fit=crop',
    ],
    videoUrl: 'https://www.w3schools.com/html/mov_bbb.mp4',
    tools: ['Blender 4.2', 'Cinema 4D', 'Octane Render', 'After Effects'],
    projectDate: 'February 2026',
    client: 'Lumina Acoustics',
    featured: true,
    sortOrder: 1,
    createdAt: '2026-02-15T12:00:00Z',
    updatedAt: '2026-02-15T12:00:00Z',
  },
  {
    id: 'proj-2',
    title: 'Aetheric Interactive Web Experience',
    category: 'Websites',
    description: 'Interactive portfolio and digital laboratory powered by Three.js WebGL shaders and React. Features 60FPS fluid physics simulations, custom audio design, and frictionless responsive layouts.',
    coverImage: 'https://images.unsplash.com/photo-1550745165-9bc0b252726f?q=80&w=1200&auto=format&fit=crop',
    images: [
      'https://images.unsplash.com/photo-1550745165-9bc0b252726f?q=80&w=1200&auto=format&fit=crop',
      'https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5?q=80&w=1200&auto=format&fit=crop',
    ],
    tools: ['React 19', 'TypeScript', 'Three.js', 'Tailwind CSS', 'GLSL'],
    projectDate: 'January 2026',
    client: 'Aetheric Studio',
    featured: true,
    sortOrder: 2,
    createdAt: '2026-01-20T14:00:00Z',
    updatedAt: '2026-01-20T14:00:00Z',
  },
  {
    id: 'proj-3',
    title: 'Kinetix Athletics — Bold Visual Identity',
    category: 'Branding',
    description: 'End-to-end brand transformation for high-performance apparel. Developed kinetic typography systems, physical packaging, custom hangtags, and an energetic neon orange and slate brand guide.',
    coverImage: 'https://images.unsplash.com/photo-1607604276583-eef5d076aa5f?q=80&w=1200&auto=format&fit=crop',
    images: [
      'https://images.unsplash.com/photo-1607604276583-eef5d076aa5f?q=80&w=1200&auto=format&fit=crop',
      'https://images.unsplash.com/photo-1507679799987-c73779587ccf?q=80&w=1200&auto=format&fit=crop',
    ],
    tools: ['Illustrator', 'Photoshop', 'Figma', 'InDesign'],
    projectDate: 'December 2025',
    client: 'Kinetix Apparel',
    featured: true,
    sortOrder: 3,
    createdAt: '2025-12-18T10:00:00Z',
    updatedAt: '2025-12-18T10:00:00Z',
  },
  {
    id: 'proj-4',
    title: 'HyperDrive Energy — UGC Ad Blitz Campaign',
    category: 'UGC Ads',
    description: 'High-performing short-form video advertisement suite engineered for TikTok and Instagram Reels. Combined dynamic motion typography, sound effects, and native hook pacing.',
    coverImage: 'https://images.unsplash.com/photo-1574717024653-61fd2cf4d44d?q=80&w=1200&auto=format&fit=crop',
    images: [
      'https://images.unsplash.com/photo-1574717024653-61fd2cf4d44d?q=80&w=1200&auto=format&fit=crop',
    ],
    videoUrl: 'https://www.w3schools.com/html/mov_bbb.mp4',
    tools: ['Premiere Pro', 'After Effects', 'CapCut Pro', 'DaVinci Resolve'],
    projectDate: 'November 2025',
    client: 'HyperDrive Beverage Co.',
    featured: false,
    sortOrder: 4,
    createdAt: '2025-11-28T09:00:00Z',
    updatedAt: '2025-11-28T09:00:00Z',
  },
  {
    id: 'proj-5',
    title: 'Chronos Smartwatch — CGI Product Launch',
    category: 'CGI',
    description: 'Precision 3D modeling and photorealistic close-ups showcasing brushed titanium bevels, sapphire crystal display reflections, and silicone strap micro-textures.',
    coverImage: 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?q=80&w=1200&auto=format&fit=crop',
    images: [
      'https://images.unsplash.com/photo-1523275335684-37898b6baf30?q=80&w=1200&auto=format&fit=crop',
      'https://images.unsplash.com/photo-1508685096489-7aacd43bd3b1?q=80&w=1200&auto=format&fit=crop',
    ],
    tools: ['Blender 4.2', 'Cycles', 'Photoshop', 'Substance 3D Painter'],
    projectDate: 'October 2025',
    client: 'Chronos Wearables',
    featured: true,
    sortOrder: 5,
    createdAt: '2025-10-14T11:00:00Z',
    updatedAt: '2025-10-14T11:00:00Z',
  },
  {
    id: 'proj-6',
    title: 'Neon Horizon — Social Media Growth Kit',
    category: 'Social Media',
    description: 'Modular set of 30+ high-engagement Instagram carousels, animated story stickers, and YouTube thumbnail frameworks delivering cohesive aesthetic storytelling.',
    coverImage: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?q=80&w=1200&auto=format&fit=crop',
    images: [
      'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?q=80&w=1200&auto=format&fit=crop',
    ],
    tools: ['Photoshop', 'Figma', 'After Effects'],
    projectDate: 'September 2025',
    client: 'Horizon Media',
    featured: false,
    sortOrder: 6,
    createdAt: '2025-09-05T16:00:00Z',
    updatedAt: '2025-09-05T16:00:00Z',
  },
  {
    id: 'proj-7',
    title: 'Apex Financial — High-Convert FinTech Platform',
    category: 'Websites',
    description: 'Modern web app design and frontend implementation featuring interactive portfolio charts, dark glass UI aesthetic, seamless onboarding flow, and micro-interactions.',
    coverImage: 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?q=80&w=1200&auto=format&fit=crop',
    images: [
      'https://images.unsplash.com/photo-1460925895917-afdab827c52f?q=80&w=1200&auto=format&fit=crop',
    ],
    tools: ['Next.js', 'React', 'Tailwind CSS', 'Framer Motion'],
    projectDate: 'August 2025',
    client: 'Apex Financial Tech',
    featured: true,
    sortOrder: 7,
    createdAt: '2025-08-19T13:00:00Z',
    updatedAt: '2025-08-19T13:00:00Z',
  },
  {
    id: 'proj-8',
    title: 'Vortex Cyber Festival — Typographic Posters',
    category: 'Graphic Design',
    description: 'Series of large-format screenprint posters and digital billboards designed with custom experimental grid distortion, metallic inks, and futuristic brutalist layout.',
    coverImage: 'https://images.unsplash.com/photo-1541701494587-cb58502866ab?q=80&w=1200&auto=format&fit=crop',
    images: [
      'https://images.unsplash.com/photo-1541701494587-cb58502866ab?q=80&w=1200&auto=format&fit=crop',
    ],
    tools: ['Illustrator', 'Photoshop'],
    projectDate: 'July 2025',
    client: 'Vortex Sounds',
    featured: false,
    sortOrder: 8,
    createdAt: '2025-07-10T15:00:00Z',
    updatedAt: '2025-07-10T15:00:00Z',
  },
];

const DEFAULT_SETTINGS: SiteSettings = {
  id: 'global',
  siteTitle: 'Zohair — Graphic Designer, Web Developer & CGI Designer',
  professionalTitle: 'Graphic Designer • Web Developer • CGI Designer • Content Creator',
  heroTitle: "Hi, I'm Zohair.",
  heroSubtitle: 'Graphic Designer • Web Developer • CGI Designer • Content Creator',
  heroDescription: 'Designing bold visuals, immersive digital experiences and creative websites that help brands stand out.',
  primaryCta: 'View My Work',
  secondaryCta: "Let's Work Together",
  bio: 'I am a multidisciplinary designer and creative technologist. Bridging the gap between brand identity, high-end 3D CGI, and functional web engineering, I collaborate with forward-thinking businesses to craft digital experiences that leave a lasting impact.',
  email: 'zohair.creatives@gmail.com',
  whatsapp: '+1 (555) 389-9402',
  location: 'Worldwide • Available for Remote & On-Site Projects',
  availabilityStatus: 'Available for Selected Projects & Full-Time Contracts',
  isOnline: true,
  socialLinks: {
    instagram: 'https://instagram.com/zohair.design',
    linkedin: 'https://linkedin.com/in/zohair-creative',
  },
  footerText: '© 2026 Zohair. All rights reserved. Crafted with precision.',
  updatedAt: new Date().toISOString(),
};

const DEFAULT_MESSAGES: ContactMessage[] = [
  {
    id: 'msg-1',
    name: 'Elena Vance',
    email: 'elena@novaproducts.co',
    subject: '3D CGI Product Ad for upcoming launch',
    message: 'Hello Zohair, we saw your CGI work and were blown away. We are launching a new hardware smart ring next month and need a 30s 3D commercial animation with ray-traced materials. Could we schedule an introductory call?',
    status: 'New',
    createdAt: new Date(Date.now() - 3600000 * 4).toISOString(),
  },
  {
    id: 'msg-2',
    name: 'Marcus Chen',
    email: 'marcus@soliscapital.io',
    subject: 'Custom Website Redesign and Brand System',
    message: 'Hi Zohair, we are looking for a designer and developer who can revamp our venture capital landing page with interactive 3D WebGL touches and clean typography. Loved your work on Lumina!',
    status: 'Read',
    createdAt: new Date(Date.now() - 3600000 * 28).toISOString(),
  },
];

class Database {
  private data: DatabaseSchema;

  constructor() {
    this.data = this.loadData();
  }

  private ensureDir() {
    if (!fs.existsSync(DATA_DIR)) {
      fs.mkdirSync(DATA_DIR, { recursive: true });
    }
  }

  private loadData(): DatabaseSchema {
    try {
      this.ensureDir();
      if (fs.existsSync(DB_FILE)) {
        const raw = fs.readFileSync(DB_FILE, 'utf-8');
        const parsed = JSON.parse(raw);
        return {
          projects: parsed.projects || DEFAULT_PROJECTS,
          services: parsed.services || DEFAULT_SERVICES,
          messages: parsed.messages || DEFAULT_MESSAGES,
          settings: { ...DEFAULT_SETTINGS, ...(parsed.settings || {}) },
        };
      }
    } catch (err) {
      console.error('Error loading database file, using defaults:', err);
    }
    const initial: DatabaseSchema = {
      projects: DEFAULT_PROJECTS,
      services: DEFAULT_SERVICES,
      messages: DEFAULT_MESSAGES,
      settings: DEFAULT_SETTINGS,
    };
    this.saveData(initial);
    return initial;
  }

  private saveData(data: DatabaseSchema) {
    try {
      this.ensureDir();
      fs.writeFileSync(DB_FILE, JSON.stringify(data, null, 2), 'utf-8');
    } catch (err) {
      console.error('Error saving database file:', err);
    }
  }

  public getProjects(): Project[] {
    return [...this.data.projects].sort((a, b) => a.sortOrder - b.sortOrder);
  }

  public getProject(id: string): Project | undefined {
    return this.data.projects.find((p) => p.id === id);
  }

  public addProject(project: Omit<Project, 'id' | 'createdAt' | 'updatedAt'>): Project {
    const newProj: Project = {
      ...project,
      id: 'proj-' + Date.now(),
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    this.data.projects.unshift(newProj);
    this.saveData(this.data);
    return newProj;
  }

  public updateProject(id: string, updates: Partial<Project>): Project | null {
    const idx = this.data.projects.findIndex((p) => p.id === id);
    if (idx === -1) return null;
    this.data.projects[idx] = {
      ...this.data.projects[idx],
      ...updates,
      updatedAt: new Date().toISOString(),
    };
    this.saveData(this.data);
    return this.data.projects[idx];
  }

  public deleteProject(id: string): boolean {
    const initialLen = this.data.projects.length;
    this.data.projects = this.data.projects.filter((p) => p.id !== id);
    if (this.data.projects.length !== initialLen) {
      this.saveData(this.data);
      return true;
    }
    return false;
  }

  public getServices(): Service[] {
    return [...this.data.services].sort((a, b) => a.sortOrder - b.sortOrder);
  }

  public addService(service: Omit<Service, 'id' | 'createdAt' | 'updatedAt'>): Service {
    const newSrv: Service = {
      ...service,
      id: 'srv-' + Date.now(),
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    this.data.services.push(newSrv);
    this.saveData(this.data);
    return newSrv;
  }

  public updateService(id: string, updates: Partial<Service>): Service | null {
    const idx = this.data.services.findIndex((s) => s.id === id);
    if (idx === -1) return null;
    this.data.services[idx] = {
      ...this.data.services[idx],
      ...updates,
      updatedAt: new Date().toISOString(),
    };
    this.saveData(this.data);
    return this.data.services[idx];
  }

  public deleteService(id: string): boolean {
    const initialLen = this.data.services.length;
    this.data.services = this.data.services.filter((s) => s.id !== id);
    if (this.data.services.length !== initialLen) {
      this.saveData(this.data);
      return true;
    }
    return false;
  }

  public getMessages(): ContactMessage[] {
    return [...this.data.messages].sort(
      (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
    );
  }

  public addMessage(msg: Omit<ContactMessage, 'id' | 'createdAt' | 'status'>): ContactMessage {
    const newMsg: ContactMessage = {
      ...msg,
      id: 'msg-' + Date.now(),
      status: 'New',
      createdAt: new Date().toISOString(),
    };
    this.data.messages.unshift(newMsg);
    this.saveData(this.data);
    return newMsg;
  }

  public updateMessageStatus(id: string, status: ContactMessage['status']): ContactMessage | null {
    const idx = this.data.messages.findIndex((m) => m.id === id);
    if (idx === -1) return null;
    this.data.messages[idx].status = status;
    this.saveData(this.data);
    return this.data.messages[idx];
  }

  public deleteMessage(id: string): boolean {
    const initialLen = this.data.messages.length;
    this.data.messages = this.data.messages.filter((m) => m.id !== id);
    if (this.data.messages.length !== initialLen) {
      this.saveData(this.data);
      return true;
    }
    return false;
  }

  public getSettings(): SiteSettings {
    return this.data.settings;
  }

  public getAllData(): DatabaseSchema {
    return this.data;
  }

  public updateSettings(updates: Partial<SiteSettings>): SiteSettings {
    this.data.settings = {
      ...this.data.settings,
      ...updates,
      updatedAt: new Date().toISOString(),
    };
    this.saveData(this.data);
    return this.data.settings;
  }
}

export const db = new Database();
