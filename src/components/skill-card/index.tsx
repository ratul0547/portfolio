import { skeleton } from '../../utils';

type SkillCategory = {
  label: string;
  badgeClass: string;
  skills: string[];
};

const SKILL_CATEGORIES: SkillCategory[] = [
  {
    label: 'Cloud',
    badgeClass: 'badge-accent',
    skills: ['AWS', 'Google Cloud', 'Self-Hosting', 'Cloud File Management'],
  },
  {
    label: 'Virtualization',
    badgeClass: 'badge-info',
    skills: [
      'QEMU',
      'KVM',
      'VirtualBox',
      'VMware',
      'Proxmox',
      'Virtualization',
      'Resource Management',
      'High Availability',
    ],
  },
  {
    label: 'Servers & Infrastructure',
    badgeClass: 'badge-secondary',
    skills: [
      'Docker',
      'Kubernetes',
      'Podman',
      'File Synchronization',
      'Media Backup',
      'Multi-Device Sync',
      'Network Attached Storage',
      'Storage Redundancy',
      'Service Availability',
      'Automated Backups',
      'Deduplication',
      'Service Deployment',
      'Mail Server Administration',
      'Service Integration',
    ],
  },
  {
    label: 'Network',
    badgeClass: 'badge-success',
    skills: [
      'Firewall',
      'Wireguard',
      'TCP/IP',
      'Network Troubleshooting',
      'DHCP',
      'DNS',
      'NAT',
      'VPN',
      'DNS Administration',
      'Mesh Networking',
      'VPN Configuration',
      'Secure Connectivity',
      'WireGuard Setup',
      'Remote Access Security',
      'Network Performance Tuning',
      'Internal Communication Systems',
    ],
  },
  {
    label: 'Security',
    badgeClass: 'badge-error',
    skills: [
      'Nmap',
      'Wireshark',
      'Metasploit',
      'Network Security',
      'Data Privacy',
      'Password Management',
      'End-to-End Encryption',
      'Identity Security',
      'Backup Encryption',
    ],
  },
  {
    label: 'Scripting & Development',
    badgeClass: 'badge-warning',
    skills: ['HTML', 'CSS', 'JavaScript', 'Python', 'Bash', 'PowerShell'],
  },
  {
    label: 'Operating Systems',
    badgeClass: 'badge-primary',
    skills: [
      'Ubuntu',
      'CentOS',
      'Debian',
      'Kali',
      'Linux server',
      'Windows Server',
      'iOS',
      'Android',
      'MacOS',
    ],
  },
  {
    label: 'Management & Tools',
    badgeClass: 'badge-violet',
    skills: [
      'Active Directory',
      'Snipe-IT',
      'Group Policy Management',
      'Access Control',
      'FreshService',
      'Ticketing Systems',
      'Knowledge Management Systems',
      'Bug Tracking',
      'Collaboration Systems',
      'Issue Tracking',
      'Workflow Management',
      'Operational Documentation',
      'Office365',
      'Git',
      'Version Management',
    ],
  },
  {
    label: 'Troubleshooting',
    badgeClass: 'badge-orange',
    skills: [
      'Hardware Troubleshooting',
      'Software Troubleshooting',
      'Computer Hardware Replacement',
      'Phone Parts Replacement',
      'Data Recovery',
    ],
  },
];

const SkillCard = ({
  loading,
  skills,
}: {
  loading: boolean;
  skills: string[];
}) => {
  const renderSkeleton = () => {
    const array = [];
    for (let index = 0; index < 12; index++) {
      array.push(
        <div key={index}>
          {skeleton({ widthCls: 'w-16', heightCls: 'h-4', className: 'm-1' })}
        </div>,
      );
    }
    return array;
  };

  const skillSet = new Set(skills);

  const categorized = SKILL_CATEGORIES.map((cat) => ({
    ...cat,
    matched: cat.skills.filter((s) => skillSet.has(s)),
  })).filter((cat) => cat.matched.length > 0);

  return (
    <div className="card shadow-lg card-sm bg-base-100">
      <div className="card-body">
        <div className="mx-3">
          <h5 className="card-title">
            {loading ? (
              skeleton({ widthCls: 'w-32', heightCls: 'h-8' })
            ) : (
              <span className="text-base-content opacity-70">Tech Stack</span>
            )}
          </h5>
        </div>
        <div className="p-3 flow-root">
          {loading ? (
            <div className="-m-1 flex flex-wrap justify-center gap-2">
              {renderSkeleton()}
            </div>
          ) : (
            <div className="flex flex-col gap-4">
              {categorized.map((cat) => (
                <div key={cat.label}>
                  <p className="text-xs font-semibold text-base-content/50 uppercase tracking-wider mb-2 px-1">
                    {cat.label}
                  </p>
                  <div className="flex flex-wrap gap-2">
                    {cat.matched.map((skill) => (
                      <div
                        key={skill}
                        className={`badge ${cat.badgeClass} badge-md font-bold z-hover`}
                      >
                        {skill}
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default SkillCard;
