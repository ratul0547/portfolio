import { skeleton } from '../../utils';

type SkillCategory = {
  label: string;
  badgeClass: string;
  skills: string[];
};

const SKILL_CATEGORIES: SkillCategory[] = [
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
    label: 'Servers & Infrastructure',
    badgeClass: 'badge-secondary',
    skills: ['Docker', 'Kubernetes', 'Podman'],
  },
  {
    label: 'Virtualization',
    badgeClass: 'badge-info',
    skills: ['QEMU', 'KVM', 'VirtualBox', 'VMware', 'Proxmox'],
  },
  {
    label: 'Cloud',
    badgeClass: 'badge-accent',
    skills: ['AWS', 'Google Cloud'],
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
    ],
  },
  {
    label: 'Security',
    badgeClass: 'badge-error',
    skills: ['Nmap', 'Wireshark', 'Metasploit'],
  },
  {
    label: 'Scripting & Development',
    badgeClass: 'badge-warning',
    skills: ['HTML', 'CSS', 'JavaScript', 'Python', 'Bash', 'PowerShell'],
  },
  {
    label: 'Troubleshooting',
    badgeClass: 'badge-neutral',
    skills: [
      'Hardware Troubleshooting',
      'Software Troubleshooting',
      'Computer Hardware Replacement',
      'Phone Parts Replacement',
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
      'Office365',
      'Git',
      'Version Management',
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

  const categorized = SKILL_CATEGORIES.map((cat) => ({
    ...cat,
    matched: cat.skills.filter((s) => skills.includes(s)),
  })).filter((cat) => cat.matched.length > 0);

  const categorizedSkills = new Set(
    SKILL_CATEGORIES.flatMap((cat) => cat.skills),
  );
  const uncategorized = skills.filter((s) => !categorizedSkills.has(s));

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
                    {cat.matched.map((skill, idx) => (
                      <div
                        key={idx}
                        className={`badge ${cat.badgeClass} badge-md font-bold z-hover`}
                      >
                        {skill}
                      </div>
                    ))}
                  </div>
                </div>
              ))}
              {uncategorized.length > 0 && (
                <div>
                  <p className="text-xs font-semibold text-base-content/50 uppercase tracking-wider mb-2 px-1">
                    Other
                  </p>
                  <div className="flex flex-wrap gap-2">
                    {uncategorized.map((skill, idx) => (
                      <div
                        key={idx}
                        className="badge badge-ghost badge-md font-bold z-hover"
                      >
                        {skill}
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default SkillCard;
