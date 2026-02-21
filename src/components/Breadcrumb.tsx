import { Link, useLocation } from 'react-router-dom';
import { getEntityById } from '../data';

interface BreadcrumbItem {
  label: string;
  path: string;
}

const routeLabels: Record<string, string> = {
  '': 'Home',
  wheel: 'Wheel',
  graph: 'Graph',
  realms: 'Realms',
  compare: 'Compare',
  profile: 'My Chart',
  planets: 'Planets',
  signs: 'Signs',
  houses: 'Houses',
  elements: 'Elements',
  aspects: 'Aspects',
  dignities: 'Dignities',
  decans: 'Decans',
  configurations: 'Patterns',
  weaver: 'Aspect Weaver',
  contemplate: 'Contemplation',
  // Gene Keys
  'gene-keys': 'Gene Keys',
  'codon-rings': 'Codon Rings',
  // Human Design
  'human-design': 'Human Design',
  centers: 'Centers',
  channels: 'Channels',
};

export function Breadcrumb() {
  const location = useLocation();
  const pathSegments = location.pathname.split('/').filter(Boolean);

  // Don't show breadcrumb on home page
  if (pathSegments.length === 0) {
    return null;
  }

  const breadcrumbs: BreadcrumbItem[] = [{ label: 'Home', path: '/' }];

  // Build breadcrumb items
  let currentPath = '';
  pathSegments.forEach((segment) => {
    currentPath += `/${segment}`;

    // Check if this is a route or an entity ID
    if (routeLabels[segment]) {
      breadcrumbs.push({
        label: routeLabels[segment],
        path: currentPath,
      });
    } else {
      // This is likely an entity ID - try to get the entity name
      const entity = getEntityById(segment);
      if (entity) {
        breadcrumbs.push({
          label: entity.name,
          path: currentPath,
        });
      } else {
        // Fallback to capitalized segment
        breadcrumbs.push({
          label: segment.charAt(0).toUpperCase() + segment.slice(1),
          path: currentPath,
        });
      }
    }
  });

  return (
    <nav className="text-sm text-theme-text-secondary mb-6">
      {breadcrumbs.map((item, index) => (
        <span key={item.path}>
          {index > 0 && <span className="mx-2">/</span>}
          {index === breadcrumbs.length - 1 ? (
            <span className="text-theme-text-primary">{item.label}</span>
          ) : (
            <Link to={item.path} className="hover:text-theme-text-primary transition-colors">
              {item.label}
            </Link>
          )}
        </span>
      ))}
    </nav>
  );
}
