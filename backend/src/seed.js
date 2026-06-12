import prisma from './config/db.js';
import bcrypt from 'bcryptjs';

async function main() {
  console.log('Clearing database...');
  await prisma.watchProgress.deleteMany({});
  await prisma.bookmarks.deleteMany({});
  await prisma.comments.deleteMany({});
  await prisma.video.deleteMany({});
  await prisma.category.deleteMany({});
  await prisma.user.deleteMany({});

  console.log('Seeding categories...');
  const catAI = await prisma.category.create({ data: { name: 'Artificial Intelligence' } });
  const catCyber = await prisma.category.create({ data: { name: 'Cybersecurity' } });

  console.log('Seeding users...');
  const hashedUserPassword = await bcrypt.hash('password123', 10);
  
  // Seed admin user
  const admin = await prisma.user.create({
    data: {
      name: 'Admin Instructor',
      email: 'admin@lms.com',
      password: hashedUserPassword,
      role: 'admin'
    }
  });

  // Seed standard student user
  const student = await prisma.user.create({
    data: {
      name: 'Jane Doe',
      email: 'user@lms.com',
      password: hashedUserPassword,
      role: 'user'
    }
  });

  console.log('Seeding videos...');
  const videosData = [
    {
      title: 'Introduction to Generative Adversarial Networks (GANs)',
      description: 'Learn the core architecture of GANs, how Generator and Discriminator neural networks play a min-max game to synthesize realistic imagery, and how to code a simple GAN from scratch in PyTorch.',
      category: 'Artificial Intelligence',
      videoUrl: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4',
      thumbnailUrl: 'https://images.unsplash.com/photo-1677442136019-21780efad99a?q=80&w=600&auto=format&fit=crop',
      duration: 596, // ~10 mins
      difficulty: 'Intermediate',
      estimatedTime: '10 mins',
      tags: 'Generative AI, GANs, PyTorch, Deep Learning'
    },
    {
      title: 'OWASP Top 10 Vulnerabilities: Deep Dive & Mitigation',
      description: 'An essential masterclass for web security professionals. We will review SQL injections, Cross-Site Scripting (XSS), broken access controls, and demonstrate mitigation techniques in modern Express apps.',
      category: 'Cybersecurity',
      videoUrl: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ElephantsDream.mp4',
      thumbnailUrl: 'https://images.unsplash.com/photo-1563986768609-322da13575f3?q=80&w=600&auto=format&fit=crop',
      duration: 653, // ~11 mins
      difficulty: 'Advanced',
      estimatedTime: '11 mins',
      tags: 'Web Security, OWASP, Penetration Testing, Hacking'
    },
    {
      title: 'Prompt Engineering Masterclass for LLMs',
      description: 'Master the art of prompt design to get predictable and high-quality outputs from GPT-4, Claude, and Llama. Learn advanced paradigms like chain-of-thought, self-consistency, and prompt template parameters.',
      category: 'Artificial Intelligence',
      videoUrl: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerBlazes.mp4',
      thumbnailUrl: 'https://images.unsplash.com/photo-1620712943543-bcc4688e7485?q=80&w=600&auto=format&fit=crop',
      duration: 150, // 2.5 mins
      difficulty: 'Beginner',
      estimatedTime: '3 mins',
      tags: 'LLMs, Prompt Engineering, GPT-4, OpenAI'
    },
    {
      title: 'Network Penetration Testing: Scanning & Enumeration',
      description: 'Learn the legal and procedural aspects of penetration testing. Understand network protocols, and practice hands-on port scanning and operating system fingerprinting using Nmap and Wireshark.',
      category: 'Cybersecurity',
      videoUrl: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerEscapes.mp4',
      thumbnailUrl: 'https://images.unsplash.com/photo-1550751827-4bd374c3f58b?q=80&w=600&auto=format&fit=crop',
      duration: 894, // ~15 mins
      difficulty: 'Intermediate',
      estimatedTime: '15 mins',
      tags: 'Penetration Testing, Nmap, Wireshark, Ethical Hacking'
    },
    {
      title: 'Neural Networks from Scratch in Python',
      description: 'Gain a solid intuition of deep learning by building a complete feed-forward neural network with backpropagation and gradient descent, using only raw Python and NumPy.',
      category: 'Artificial Intelligence',
      videoUrl: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerFun.mp4',
      thumbnailUrl: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?q=80&w=600&auto=format&fit=crop',
      duration: 1205, // 20 mins
      difficulty: 'Advanced',
      estimatedTime: '20 mins',
      tags: 'Deep Learning, Neural Networks, Python, NumPy'
    },
    {
      title: 'Phishing Attacks and Social Engineering Defense',
      description: 'Understanding how attackers manipulate human psychology to breach enterprise systems. This course covers email headers analysis, spear-phishing techniques, and setting up training simulations.',
      category: 'Cybersecurity',
      videoUrl: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerJoyrides.mp4',
      thumbnailUrl: 'https://images.unsplash.com/photo-1601597111158-2fceff270190?q=80&w=600&auto=format&fit=crop',
      duration: 450, // 7.5 mins
      difficulty: 'Beginner',
      estimatedTime: '8 mins',
      tags: 'Phishing, Social Engineering, Security Awareness'
    }
  ];

  for (const video of videosData) {
    await prisma.video.create({
      data: video
    });
  }

  console.log('Database successfully seeded!');
}

main()
  .catch((e) => {
    console.error('Error during seed:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
