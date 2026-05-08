(function () {
  const STORAGE_KEY = 'gitprofile-theme';
  const ABOUT = [
    'Infrastructure-focused IT Systems Administrator with demonstrated expertise in Linux system administration, virtualization, and automation across different technical environments. Professional experience encompasses end-user support and IT asset management, complemented by interdisciplinary academic degrees that include a Master\'s degree in IT Management from Webster University and a Master of Arts in Applied Linguistics and ELT from Jahangirnagar University.',
    'Research and professional interests center on infrastructure optimization, cloud computing, containerization, cybersecurity, and the application of large language models to emerging technology challenges.',
  ];

  const SKILL_CATEGORIES = [
    { label: 'Cloud', skills: ['AWS', 'Google Cloud', 'Self-Hosting', 'Cloud File Management'] },
    { label: 'Virtualization Platforms', skills: ['QEMU', 'KVM', 'VirtualBox', 'VMware', 'Proxmox', 'Virtualization', 'Resource Management', 'High Availability'] },
    { label: 'Servers & Infrastructure', skills: ['Docker', 'Kubernetes', 'Podman', 'File Synchronization', 'Media Backup', 'Multi-Device Sync', 'Network Attached Storage', 'Storage Redundancy', 'Service Availability', 'Automated Backups', 'Deduplication', 'Service Deployment', 'Mail Server Administration', 'Service Integration'] },
    { label: 'Network', skills: ['Firewall', 'Wireguard', 'TCP/IP', 'Network Troubleshooting', 'DHCP', 'DNS', 'NAT', 'VPN', 'DNS Administration', 'Mesh Networking', 'VPN Configuration', 'Secure Connectivity', 'WireGuard Setup', 'Remote Access Security', 'Network Performance Tuning', 'Internal Communication Systems'] },
    { label: 'Security', skills: ['Nmap', 'Wireshark', 'Metasploit', 'Network Security', 'Data Privacy', 'Password Management', 'End-to-End Encryption', 'Identity Security', 'Backup Encryption'] },
    { label: 'Scripting & Development', skills: ['HTML', 'CSS', 'JavaScript', 'Python', 'Bash', 'PowerShell'] },
    { label: 'Operating Systems', skills: ['Ubuntu', 'CentOS', 'Debian', 'Kali', 'Linux server', 'Windows Server', 'iOS', 'Android', 'MacOS'] },
    { label: 'Management & Tools', skills: ['Active Directory', 'Snipe-IT', 'Group Policy Management', 'Access Control', 'FreshService', 'Ticketing Systems', 'Knowledge Management Systems', 'Bug Tracking', 'Collaboration Systems', 'Issue Tracking', 'Workflow Management', 'Operational Documentation', 'Office365', 'Git', 'Version Management'] },
    { label: 'Troubleshooting', skills: ['Hardware Troubleshooting', 'Software Troubleshooting', 'Computer Hardware Replacement', 'Phone Parts Replacement', 'Data Recovery'] },
  ];

  function escapeHtml(value) {
    return String(value ?? '')
      .replaceAll('&', '&amp;')
      .replaceAll('<', '&lt;')
      .replaceAll('>', '&gt;')
      .replaceAll('"', '&quot;')
      .replaceAll("'", '&#39;');
  }

  function normalizeConfig(config) {
    return {
      github: config.github || { username: '' },
      base: config.base || '/',
      manualProfile: config.manualProfile || null,
      projects: {
        github: {
          display: config.projects?.github?.display ?? true,
          header: config.projects?.github?.header || 'Github Projects',
          mode: config.projects?.github?.mode || 'automatic',
          automatic: {
            sortBy: config.projects?.github?.automatic?.sortBy || 'stars',
            limit: config.projects?.github?.automatic?.limit || 8,
            exclude: {
              forks: config.projects?.github?.automatic?.exclude?.forks ?? false,
              projects: config.projects?.github?.automatic?.exclude?.projects || [],
            },
          },
          manual: { projects: config.projects?.github?.manual?.projects || [] },
        },
        external: {
          header: config.projects?.external?.header || 'My Projects',
          projects: config.projects?.external?.projects || [],
        },
      },
      social: config.social || {},
      resume: config.resume || { fileUrl: '' },
      skills: config.skills || [],
      experiences: config.experiences || [],
      certifications: config.certifications || [],
      educations: config.educations || [],
      publications: config.publications || [],
      blog: config.blog || { source: 'dev', username: '', limit: 2 },
      footer: config.footer || '',
      themeConfig: {
        defaultTheme: config.themeConfig?.defaultTheme || 'light',
        disableSwitch: config.themeConfig?.disableSwitch ?? false,
        respectPrefersColorScheme: config.themeConfig?.respectPrefersColorScheme ?? true,
        displayAvatarRing: config.themeConfig?.displayAvatarRing ?? true,
        themes: config.themeConfig?.themes || ['light', 'dark'],
      },
    };
  }

  function resolveBase(base) {
    const b = base || '/';
    if (b === '/') return '/';
    return b.endsWith('/') ? b : `${b}/`;
  }

  function resolveUrl(base, url) {
    if (!url) return '';
    if (/^https?:\/\//i.test(url) || url.startsWith('mailto:') || url.startsWith('tel:')) return url;
    const normalizedBase = resolveBase(base);
    if (url.startsWith(normalizedBase)) return url;
    if (url.startsWith('/')) return `${normalizedBase}public/${url.slice(1)}`;
    return `${normalizedBase}${url}`;
  }

  function getInitialTheme(themeConfig) {
    if (themeConfig.disableSwitch) return themeConfig.defaultTheme;
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved && themeConfig.themes.includes(saved)) return saved;
    if (themeConfig.respectPrefersColorScheme && window.matchMedia('(prefers-color-scheme: dark)').matches) return 'dark';
    return themeConfig.defaultTheme;
  }

  function setTheme(theme) {
    document.documentElement.setAttribute('data-theme', theme);
    localStorage.setItem(STORAGE_KEY, theme);
  }

  function profileFromManualOrApi(config, apiData) {
    if (config.manualProfile) {
      return {
        avatar: resolveUrl(config.base, config.manualProfile.avatar || ''),
        name: config.manualProfile.name || ' ',
        bio: config.manualProfile.bio || '',
        location: config.manualProfile.location || '',
        company: config.manualProfile.company || '',
      };
    }
    return {
      avatar: apiData.avatar_url || '',
      name: apiData.name || ' ',
      bio: apiData.bio || '',
      location: apiData.location || '',
      company: apiData.company || '',
    };
  }

  async function getGithubProjects(config, publicRepoCount) {
    if (!config.projects.github.display) return [];
    if (config.projects.github.mode === 'automatic') {
      if (!publicRepoCount) return [];
      const excluded = config.projects.github.automatic.exclude.projects.map((p) => `+-repo:${p}`).join('');
      const query = `user:${config.github.username}+fork:${!config.projects.github.automatic.exclude.forks}${excluded}`;
      const url = `https://api.github.com/search/repositories?q=${query}&sort=${config.projects.github.automatic.sortBy}&per_page=${config.projects.github.automatic.limit}&type=Repositories`;
      const res = await fetch(url, { headers: { 'Content-Type': 'application/vnd.github.v3+json' } });
      if (!res.ok) throw new Error('Could not load GitHub projects.');
      const data = await res.json();
      return data.items || [];
    }
    const manual = config.projects.github.manual.projects;
    if (!manual.length) return [];
    const repos = manual.map((project) => `+repo:${project}`).join('');
    const url = `https://api.github.com/search/repositories?q=${repos}+fork:true&type=Repositories`;
    const res = await fetch(url, { headers: { 'Content-Type': 'application/vnd.github.v3+json' } });
    if (!res.ok) throw new Error('Could not load manual GitHub projects.');
    const data = await res.json();
    return data.items || [];
  }

  function dateKey(value) {
    const months = ['january','february','march','april','may','june','july','august','september','october','november','december'];
    const lower = (value || '').toLowerCase();
    const yearMatch = lower.match(/\d{4}/);
    const year = yearMatch ? Number(yearMatch[0]) : 0;
    const month = months.findIndex((m) => lower.includes(m));
    return year * 100 + (month >= 0 ? month + 1 : 0);
  }

  function isPresent(value) {
    const v = (value || '').toLowerCase().trim();
    return v === 'present' || v === 'current' || v === 'now';
  }

  function buildTimeline(experiences, educations) {
    const events = [];
    experiences.forEach((exp) => {
      events.push({ sortKey: dateKey(exp.from), dateStr: exp.from, side: 'right', type: 'work', title: exp.position ? `Joined as ${exp.position}` : 'Started working', subtitle: exp.company || '', link: exp.companyLink || '', tooltipTitle: exp.tooltipTitle, tooltipDescription: exp.tooltipDescription, tooltipHighlights: exp.tooltipHighlights || [] });
      if (!isPresent(exp.to)) {
        events.push({ sortKey: dateKey(exp.to), dateStr: exp.to, side: 'right', type: 'work', title: `Left ${exp.company || 'role'}`, subtitle: exp.position || '', link: exp.companyLink || '', tooltipTitle: exp.tooltipTitle, tooltipDescription: exp.tooltipDescription, tooltipHighlights: exp.tooltipHighlights || [] });
      }
    });
    educations.forEach((edu) => {
      events.push({ sortKey: dateKey(edu.from), dateStr: edu.from, side: 'left', type: 'edu', title: `Enrolled at ${edu.institution || 'school'}`, subtitle: edu.degree || '' });
      events.push({ sortKey: dateKey(edu.to), dateStr: edu.to, side: 'left', type: 'edu', title: `Completed ${edu.degree || 'degree'}`, subtitle: edu.institution || '' });
    });

    events.sort((a, b) => b.sortKey - a.sortKey);
    const keys = [...new Set(events.map((e) => e.sortKey))].sort((a, b) => b - a);
    return keys.map((key) => ({
      key,
      left: events.find((e) => e.sortKey === key && e.side === 'left') || null,
      right: events.find((e) => e.sortKey === key && e.side === 'right') || null,
    }));
  }

  function detailRows(config, profile) {
    const social = config.social;
    const rows = [];
    if (profile.location) rows.push(['Based in', profile.location, '']);
    if (profile.company) rows.push(['Organization', profile.company, '']);
    rows.push(['GitHub', config.github.username, `https://github.com/${config.github.username}`]);
    if (social.researchGate) rows.push(['ResearchGate', social.researchGate, `https://www.researchgate.net/profile/${social.researchGate}`]);
    if (social.mastodon) {
      const [user, server] = String(social.mastodon).split('@');
      if (user && server) rows.push(['Mastodon', `${user}@${server}`, `https://${server}/@${user}`]);
    }
    if (social.linkedin) rows.push(['LinkedIn', social.linkedin, `https://www.linkedin.com/in/${social.linkedin}`]);
    if (social.dribbble) rows.push(['Dribbble', social.dribbble, `https://dribbble.com/${social.dribbble}`]);
    if (social.behance) rows.push(['Behance', social.behance, `https://www.behance.net/${social.behance}`]);
    if (social.facebook) rows.push(['Facebook', social.facebook, `https://www.facebook.com/${social.facebook}`]);
    if (social.instagram) rows.push(['Instagram', social.instagram, `https://www.instagram.com/${social.instagram}`]);
    if (social.reddit) rows.push(['Reddit', social.reddit, `https://www.reddit.com/user/${social.reddit}`]);
    if (social.threads) rows.push(['Threads', social.threads, `https://www.threads.net/@${String(social.threads).replace('@', '')}`]);
    if (social.youtube) rows.push(['YouTube', `@${social.youtube}`, `https://www.youtube.com/@${social.youtube}`]);
    if (social.udemy) rows.push(['Udemy', social.udemy, `https://www.udemy.com/user/${social.udemy}`]);
    if (social.medium) rows.push(['Medium', social.medium, `https://medium.com/@${social.medium}`]);
    if (social.dev) rows.push(['Dev', social.dev, `https://dev.to/${social.dev}`]);
    if (social.stackoverflow) rows.push(['Stack Overflow', String(social.stackoverflow).split('/').slice(-1)[0], `https://stackoverflow.com/users/${social.stackoverflow}`]);
    if (social.x) rows.push(['X', social.x, `https://x.com/${social.x}`]);
    if (social.website) rows.push(['Website', social.website.replace(/^https?:\/\//, ''), social.website.startsWith('http') ? social.website : `http://${social.website}`]);
    if (social.telegram) rows.push(['Telegram', social.telegram, `https://t.me/${social.telegram}`]);
    if (social.phone) rows.push(['Phone', social.phone, `tel:${social.phone}`]);
    if (social.email) rows.push(['Email', social.email, `mailto:${social.email}`]);
    if (social.discord) rows.push(['Discord', social.discord, 'https://discord.com/app']);
    return rows;
  }

  function render(config, profile, githubProjects) {
    const root = document.getElementById('app');
    const timelineRows = buildTimeline(config.experiences, config.educations);
    const skillSet = new Set(config.skills);

    const skillGroups = SKILL_CATEGORIES
      .map((cat) => ({ label: cat.label, skills: cat.skills.filter((s) => skillSet.has(s)) }))
      .filter((cat) => cat.skills.length > 0);

    const extProjects = config.projects.external.projects || [];

    root.innerHTML = `
      <section class="layout">
        <div class="stack">
          <article class="card"><div class="card-body center">
            ${config.themeConfig.disableSwitch ? '' : '<button id="themeToggle" class="btn" aria-label="Toggle theme">Toggle Theme</button>'}
            <img class="avatar ${config.themeConfig.displayAvatarRing ? 'ring' : ''}" src="${escapeHtml(profile.avatar || '')}" alt="${escapeHtml(profile.name || 'Avatar')}" />
            <h2>${escapeHtml(profile.name || '')}</h2>
            <p class="bio">${escapeHtml(profile.bio || '')}</p>
            ${config.resume.fileUrl ? `<p style="margin-top:10px;"><a class="btn link" href="${escapeHtml(resolveUrl(config.base, config.resume.fileUrl))}" target="_blank" rel="noreferrer">Download Resume</a></p>` : ''}
          </div></article>

          <article class="card"><div class="card-body">
            <h3 class="section-title">About Me</h3>
            <p class="small">${escapeHtml(ABOUT[0])}</p>
            <p class="small" style="margin-top:10px;">${escapeHtml(ABOUT[1])}</p>
          </div></article>

          ${skillGroups.length ? `<article class="card"><div class="card-body"><h3 class="section-title">Tech Stack</h3>${skillGroups.map((group) => `<p class="group-title">${escapeHtml(group.label)}</p><div class="skills-grid">${group.skills.map((s) => `<span class="badge">${escapeHtml(s)}</span>`).join('')}</div>`).join('')}</div></article>` : ''}

          ${config.certifications.length ? `<article class="card"><div class="card-body"><h3 class="section-title">Certification</h3><ol>${config.certifications.map((c) => `<li style="margin-bottom:10px;"><div class="small">${escapeHtml(c.year || '')}</div><div><a class="link" target="_blank" rel="noreferrer" href="${escapeHtml(c.link || '#')}">${escapeHtml(c.name || '')}</a></div><div class="small">${escapeHtml(c.body || '')}</div></li>`).join('')}</ol></div></article>` : ''}

          <article class="card"><div class="card-body">
            <h3 class="section-title">Details</h3>
            ${detailRows(config, profile).map(([title, value, link]) => `<div class="row"><strong>${escapeHtml(title)}:</strong><span>${link ? `<a class="link" target="_blank" rel="noreferrer" href="${escapeHtml(link)}">${escapeHtml(value)}</a>` : escapeHtml(value)}</span></div>`).join('')}
          </div></article>
        </div>

        <div class="stack">
          ${extProjects.length ? `<article class="card"><div class="card-body"><h3 class="section-title">${escapeHtml(config.projects.external.header)}</h3><div class="projects">${extProjects.map((p, i) => `<div class="flip-card" data-project="${i}" tabindex="0"><div class="flip-inner"><div class="flip-side flip-front"><h4>${escapeHtml(p.icon || '🛠️')} ${escapeHtml(p.title || '')}</h4>${p.imageUrl ? `<img class="project-image" src="${escapeHtml(resolveUrl(config.base, p.imageUrl))}" alt="${escapeHtml(p.title || '')}">` : `<p class="project-description">${escapeHtml(p.description || '')}</p>`}</div><div class="flip-side flip-back"><h4>${escapeHtml(p.icon || '🛠️')} ${escapeHtml(p.title || '')}</h4><p class="project-description">${escapeHtml(p.description || '')}</p>${(p.skillsDemonstrated || []).length ? `<div class="badges">${(p.skillsDemonstrated || []).map((s) => `<span class="badge">${escapeHtml(s)}</span>`).join('')}</div>` : ''}</div></div></div>`).join('')}</div></div></article>` : ''}

          ${(config.experiences.length || config.educations.length) ? `<article class="card"><div class="card-body"><h3 class="section-title">Timeline</h3><div class="small" style="margin-bottom:10px;">🔵 Education &nbsp; 🟠 Work</div><div class="timeline">${timelineRows.map((row, idx) => {
            const dot = row.left?.type || row.right?.type || 'edu';
            const left = row.left ? `<div class="time-item left"><div class="event-date">${escapeHtml(row.left.dateStr || '')}</div><div class="event-title">${row.left.link ? `<a class="link" href="${escapeHtml(row.left.link)}" target="_blank" rel="noreferrer">${escapeHtml(row.left.title)}</a>` : escapeHtml(row.left.title)}</div><div class="event-sub">${escapeHtml(row.left.subtitle || '')}</div></div>` : '';
            const right = row.right ? `<div class="time-item right"><div class="event-date">${escapeHtml(row.right.dateStr || '')}</div><div class="event-title" tabindex="0">${row.right.link ? `<a class="link" href="${escapeHtml(row.right.link)}" target="_blank" rel="noreferrer">${escapeHtml(row.right.title)}</a>` : escapeHtml(row.right.title)}${row.right.tooltipTitle ? `<span class="tooltip"><strong>${escapeHtml(row.right.tooltipTitle)}</strong>${row.right.tooltipDescription ? `<p class="small" style="margin:6px 0 0;">${escapeHtml(row.right.tooltipDescription)}</p>` : ''}${(row.right.tooltipHighlights || []).length ? `<ul class="list">${row.right.tooltipHighlights.map((h) => `<li>${escapeHtml(h)}</li>`).join('')}</ul>` : ''}</span>` : ''}</div><div class="event-sub">${escapeHtml(row.right.subtitle || '')}</div></div>` : '';
            return `<div class="timeline-row"><div>${left}</div><div class="timeline-center"><span class="dot ${dot === 'work' ? 'work' : 'edu'}"></span>${idx < timelineRows.length - 1 ? '<span class="line"></span>' : ''}</div><div>${right}</div></div>`;
          }).join('')}</div></div></article>` : ''}

          ${config.projects.github.display ? `<article class="card"><div class="card-body"><h3 class="section-title">${escapeHtml(config.projects.github.header)}</h3>${githubProjects.length ? `<div class="projects">${githubProjects.map((p) => `<div class="card"><div class="card-body"><h4><a class="link" href="${escapeHtml(p.html_url)}" target="_blank" rel="noreferrer">${escapeHtml(p.full_name)}</a></h4><p class="project-description">${escapeHtml(p.description || 'No description provided.')}</p><p class="small">⭐ ${escapeHtml(String(p.stargazers_count || 0))} • ${escapeHtml(p.language || 'Unknown')}</p></div></div>`).join('')}</div>` : '<p class="empty">No repositories found.</p>'}</div></article>` : ''}
        </div>
      </section>
      ${config.footer ? `<footer class="footer card"><div class="card-body">${config.footer}</div></footer>` : ''}
    `;

    document.querySelectorAll('.flip-card').forEach((node) => {
      node.addEventListener('click', (event) => {
        event.stopPropagation();
        const card = event.currentTarget;
        const already = card.classList.contains('flipped');
        document.querySelectorAll('.flip-card.flipped').forEach((n) => n.classList.remove('flipped'));
        if (!already) card.classList.add('flipped');
      });
      node.addEventListener('keydown', (event) => {
        if (event.key === 'Enter' || event.key === ' ') {
          event.preventDefault();
          node.click();
        }
      });
    });

    document.addEventListener('click', () => {
      document.querySelectorAll('.flip-card.flipped').forEach((n) => n.classList.remove('flipped'));
    });

    const toggle = document.getElementById('themeToggle');
    if (toggle) {
      toggle.addEventListener('click', () => {
        const current = document.documentElement.getAttribute('data-theme') || config.themeConfig.defaultTheme;
        const next = current === 'light' ? 'dark' : 'light';
        setTheme(next);
      });
    }
  }

  async function init() {
    const rawConfig = window.CONFIG;
    if (!rawConfig || !rawConfig.github || !rawConfig.github.username) {
      document.getElementById('app').innerHTML = '<p style="padding:20px;">Invalid config.</p>';
      return;
    }

    const config = normalizeConfig(rawConfig);
    setTheme(getInitialTheme(config.themeConfig));

    let apiProfile = { public_repos: 0 };
    try {
      const profileResponse = await fetch(`https://api.github.com/users/${config.github.username}`);
      if (profileResponse.ok) {
        apiProfile = await profileResponse.json();
      }
    } catch (error) {}

    const profile = profileFromManualOrApi(config, apiProfile);
    let projects = [];
    try {
      projects = await getGithubProjects(config, apiProfile.public_repos || 0);
    } catch (error) {}

    render(config, profile, projects);
  }

  init();
})();
