// gitprofile.config.ts
const CONFIG = {
  github: {
    username: 'ratul0547', // Your GitHub org/user name. (This is the only required config)
  },
  /**
   * Manual profile — replaces GitHub API for avatar, name, bio, location.
   * Set avatar to a URL or a public-folder path (e.g. '/profile/avatar.jpg').
   */
  manualProfile: {
    name: 'MD JAHIRUL ISLAM BEPARI',
    bio: 'System Administrator\nTech Enthusiast',
    location: 'St. Louis, MO',
    company: '',
    avatar: '/portfolio/picture.jpg',
  },
  /**
   * If you are deploying to https://<USERNAME>.github.io/, for example your repository is at https://github.com/arifszn/arifszn.github.io, set base to '/'.
   * If you are deploying to https://<USERNAME>.github.io/<REPO_NAME>/,
   * for example your repository is at https://github.com/arifszn/portfolio, then set base to '/portfolio/'.
   */
  base: '/portfolio/',
  projects: {
    github: {
      display: false, // Display GitHub projects?
      header: 'Github Projects',
      mode: 'automatic', // Mode can be: 'automatic' or 'manual'
      automatic: {
        sortBy: 'stars', // Sort projects by 'stars' or 'updated'
        limit: 8, // How many projects to display.
        exclude: {
          forks: false, // Forked projects will not be displayed if set to true.
          projects: [], // These projects will not be displayed. example: ['arifszn/my-project1', 'arifszn/my-project2']
        },
      },
      manual: {
        // Properties for manually specifying projects
        projects: [], // List of repository names to display. example: ['arifszn/my-project1', 'arifszn/my-project2']
      },
    },
    external: {
      header: 'My Projects',
      // To hide the `External Projects` section, keep it empty.
      projects: [
        {
          title: 'Proxmox VE',
          icon: '🖥️',
          description:
            'Enterprise-grade virtualization platform serving as the foundation for the entire home lab infrastructure, enabling efficient resource management and high availability.',
          imageUrl: '/pic01.png',
          skillsDemonstrated: [
            'Virtualization',
            'Resource Management',
            'High Availability',
          ],
          link: '',
        },
        {
          title: 'DNS Server',
          icon: '🌐',
          description:
            'Network-wide ad and malware blocking using pi-hole and bind9 DNS server - providing enhanced privacy and protection against malicious domains.',
          imageUrl: '',
          skillsDemonstrated: ['DNS Administration', 'Network Security'],
          link: '',
        },
        {
          title: 'Tailscale Mesh',
          icon: '🕸️',
          description:
            'Zero-configuration VPN mesh network enabling secure peer-to-peer connectivity across devices with automatic key rotation and modern cryptography.',
          imageUrl: '',
          skillsDemonstrated: [
            'Mesh Networking',
            'VPN Configuration',
            'Secure Connectivity',
          ],
          link: '',
        },
        {
          title: 'WireGuard Tunnel',
          icon: '🔐',
          description:
            'High-performance VPN tunnel providing secure remote access with minimal overhead, modern cryptography, and exceptional speed.',
          imageUrl: '',
          skillsDemonstrated: [
            'WireGuard Setup',
            'Remote Access Security',
            'Network Performance Tuning',
          ],
          link: '',
        },
        {
          title: 'NextCloud',
          icon: '☁️',
          description:
            'Self-hosted cloud storage and collaboration platform providing complete control over personal data with file sync, sharing, and productivity tools.',
          imageUrl: '',
          skillsDemonstrated: [
            'Self-Hosting',
            'Data Privacy',
            'File Synchronization',
          ],
          link: '',
        },
        {
          title: 'Bitwarden',
          icon: '🔑',
          description:
            'Self-hosted password manager ensuring secure credential storage with end-to-end encryption, cross-platform sync, and complete data ownership.',
          imageUrl: '',
          skillsDemonstrated: [
            'Password Management',
            'End-to-End Encryption',
            'Identity Security',
          ],
          link: '',
        },
        {
          title: 'Immich photo backup',
          icon: '🖼️',
          description:
            'Private backup and recovery solution for Images and Videos across devices. Alternative to cloud backups for self and for family members.',
          imageUrl: '',
          skillsDemonstrated: [
            'Media Backup',
            'Data Recovery',
            'Multi-Device Sync',
          ],
          link: '',
        },
        {
          title: 'OpenMediaVault',
          icon: '💾',
          description:
            'Network Storage For services accross the servers, with redundency and backup solutions in place.',
          imageUrl: '',
          skillsDemonstrated: [
            'Network Attached Storage',
            'Storage Redundancy',
            'Service Availability',
          ],
          link: '',
        },
        {
          title: 'Borg Backup',
          icon: '🗄️',
          description:
            'Automated deduplicating backup System utilizing lz4 compression by default. Supports Encryption and a secure way to backup data.',
          imageUrl: '',
          skillsDemonstrated: [
            'Automated Backups',
            'Deduplication',
            'Backup Encryption',
          ],
          link: '',
        },
        {
          title: 'OwnCloud',
          icon: '📁',
          description:
            'Open source cloud solution for file storage, colaboration, and backup. Ease of deployment paired with flexibility and scalability.',
          imageUrl: '',
          skillsDemonstrated: [
            'Cloud File Management',
            'Collaboration Systems',
            'Service Deployment',
          ],
          link: '',
        },
        {
          title: 'MantisBT',
          icon: '🐞',
          description:
            'Lightweight, fast, and powerful issue tracker. Helpful to keep track of the issues in my setup and maintaining a record of the solutions',
          imageUrl: '',
          skillsDemonstrated: [
            'Issue Tracking',
            'Workflow Management',
            'Operational Documentation',
          ],
          link: '',
        },
        {
          title: 'iRedmail',
          icon: '📧',
          description:
            'Self-hosted resource efficient full-featured email server, along with RoundCube webmail interface, for internal networking and mail exchange between servers.',
          imageUrl: '',
          skillsDemonstrated: [
            'Mail Server Administration',
            'Internal Communication Systems',
            'Service Integration',
          ],
          link: '',
        },
      ],
    },
  },
  social: {
    linkedin: 'jahirul547',
    x: '',
    mastodon: '',
    researchGate: '',
    facebook: '',
    instagram: '',
    reddit: '',
    threads: '',
    youtube: '', // example: 'pewdiepie'
    udemy: '',
    dribbble: '',
    behance: '',
    medium: '',
    dev: '',
    stackoverflow: '', // example: '1/jeff-atwood'
    discord: '',
    telegram: '',
    website: '',
    phone: '+13149646490',
    email: 'jahirul.b@outlook.com',
  },
  resume: {
    fileUrl: '', // Empty fileUrl will hide the `Download Resume` button.
  },
  skills: [
    'Ubuntu',
    'CentOS',
    'Debian',
    'Kali',
    'Linux server',
    'Windows Server',
    'Active Directory',
    'Snipe-IT',
    'Group Policy Management',
    'Access Control',
    'FreshService',
    'Ticketing Systems',
    'Knowledge Management Systems',
    'Bug Tracking',
    'Office365',
    'Git',
    'Version Management',
    'Hardware Troubleshooting',
    'Software Troubleshooting',
    'Computer Hardware Replacement',
    'Phone Parts Replacement',
    'iOS',
    'Android',
    'MacOS',
    'Firewall',
    'Wireguard',
    'TCP/IP',
    'Network Troubleshooting',
    'DHCP',
    'DNS',
    'NAT',
    'VPN',
    'AWS',
    'Google Cloud',
    'QEMU',
    'KVM',
    'VirtualBox',
    'VMware',
    'Proxmox',
    'Docker',
    'Kubernetes',
    'Podman',
    'Nmap',
    'Wireshark',
    'Metasploit',
    'HTML',
    'CSS',
    'JavaScript',
    'Python',
    'Bash',
    'PowerShell',
    'Virtualization',
    'Resource Management',
    'High Availability',
    'DNS Administration',
    'Network Security',
    'Mesh Networking',
    'VPN Configuration',
    'Secure Connectivity',
    'WireGuard Setup',
    'Remote Access Security',
    'Network Performance Tuning',
    'Self-Hosting',
    'Data Privacy',
    'File Synchronization',
    'Password Management',
    'End-to-End Encryption',
    'Identity Security',
    'Media Backup',
    'Data Recovery',
    'Multi-Device Sync',
    'Network Attached Storage',
    'Storage Redundancy',
    'Service Availability',
    'Automated Backups',
    'Deduplication',
    'Backup Encryption',
    'Cloud File Management',
    'Collaboration Systems',
    'Service Deployment',
    'Issue Tracking',
    'Workflow Management',
    'Operational Documentation',
    'Mail Server Administration',
    'Internal Communication Systems',
    'Service Integration',
  ],
  experiences: [
    {
      company: 'Upskill Consultancy Inc',
      position: 'System Administrator',
      from: 'October 2025',
      to: 'Present',
      CompanyLink: '',
    },
    {
      company: 'Webster University',
      position: 'IT Asset Management Assistant',
      from: 'October 2024',
      to: 'July 2025',
      companyLink: '',
    },
    {
      company: 'Golden Harvest InfoTech Ltd.',
      position: 'Data Entry Operator',
      from: 'August 2022',
      to: 'October 2022',
      companyLink: '',
    },
    {
      company: 'Dhamrai Govt. University College',
      position: 'Guest Lecturer in English',
      from: 'January 2022',
      to: 'June 2022',
      companyLink: '',
    },
    {
      company: 'Community Projects',
      position: 'E-Sports Manager for Multiplayer Games',
      from: 'March 2020',
      to: 'November 2021',
      companyLink: '',
    },
  ],
  certifications: [
    {
      name: 'IT Security: Defense against the digital dark arts',
      body: 'Coursera',
      year: '2026',
      link: 'https://www.coursera.org/account/accomplishments/records/YA3GNXHQ1ZAL',
    },
    {
      name: 'System Administration and IT Infrastructure Services',
      body: 'Coursera',
      year: '2025',
      link: 'https://www.coursera.org/account/accomplishments/verify/RTW4OYZ48Q1Q',
    },
    {
      name: 'Operating Systems and You: Becoming a Power User',
      body: 'Coursera',
      year: '2025',
      link: 'https://www.coursera.org/account/accomplishments/records/D5RHFZCDQ8DA',
    },
    {
      name: 'Technical Support Fundamentals',
      body: 'Coursera',
      year: '2025',
      link: 'https://www.coursera.org/account/accomplishments/records/PBWS2W4IJY6M',
    },
    {
      name: 'The Bits and Bytes of Computer Networking',
      body: 'Coursera',
      year: '2025',
      link: 'https://www.coursera.org/account/accomplishments/records/L6T2KJU9JY6B',
    },
  ],
  educations: [
    {
      institution: 'Webster University',
      degree: 'Master’s (MA), IT Management',
      from: '2023',
      to: '2025',
    },
    {
      institution: 'Jahangirnagar University',
      degree: 'Master’s (MA), Applied Linguistics and ELT',
      from: '2019',
      to: '2020',
    },
    {
      institution: 'Jahangirnagar University',
      degree: 'Bachelor of Arts (BA), English',
      from: '2015',
      to: '2019',
    },
    {
      institution: 'Cambrian School & College',
      degree: 'Higher Secondary Certificate (HSC), Science',
      from: '2011',
      to: '2013',
    },
  ],
  publications: [],
  // Display articles from your medium or dev account. (Optional)
  blog: {
    source: 'dev', // medium | dev
    username: '', // to hide blog section, keep it empty
    limit: 2, // How many articles to display. Max is 10.
  },
  themeConfig: {
    defaultTheme: 'light',

    // Hides the switch in the navbar
    // Useful if you want to support a single color mode
    disableSwitch: false,

    // Should use the prefers-color-scheme media-query,
    // using user system preferences, instead of the hardcoded defaultTheme
    respectPrefersColorScheme: true,

    // Display the ring in Profile picture
    displayAvatarRing: true,

    // Available themes. To remove any theme, exclude from here.
    themes: ['light', 'dark'],
  },

  // Optional Footer. Supports plain text or HTML.
  footer: ``,
};

export default CONFIG;
