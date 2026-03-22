'use client';
import * as React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { ChevronRight, Home } from 'lucide-react';
import { cn } from '@/lib/utils';

interface BreadcrumbItem {
  label: string;
  href?: string;
}

interface BreadcrumbsProps {
  items?: BreadcrumbItem[];
  className?: string;
}

export default function Breadcrumbs({ items, className }: BreadcrumbsProps) {
  const pathname = usePathname();

  // Auto-generate breadcrumbs from pathname if not provided
  const breadcrumbItems = React.useMemo(() => {
    if (items) return items;

    const pathSegments = pathname.split('/').filter(Boolean);
    const crumbs: BreadcrumbItem[] = [{ label: 'Home', href: '/' }];

    let currentPath = '';
    pathSegments.forEach((segment, index) => {
      currentPath += `/${segment}`;

      // Format segment labels
      let label = segment;
      if (segment === 'new') label = 'New';
      else if (segment === 'forms') label = 'Forms';
      else if (segment === 'analytics') label = 'Analytics';
      else if (/^[a-f0-9]{24}$/.test(segment)) label = 'Form'; // MongoDB ObjectId
      else label = label.charAt(0).toUpperCase() + label.slice(1);

      crumbs.push({
        label,
        href: index === pathSegments.length - 1 ? undefined : currentPath
      });
    });

    return crumbs;
  }, [items, pathname]);

  if (breadcrumbItems.length <= 1) return null;

  return (
    <nav
      className={cn("flex items-center space-x-1 text-sm text-muted-foreground", className)}
      aria-label="Breadcrumb"
    >
      {breadcrumbItems.map((item, index) => (
        <React.Fragment key={index}>
          {index > 0 && (
            <ChevronRight className="h-4 w-4 text-muted-foreground/50" />
          )}

          {item.href ? (
            <Link
              href={item.href}
              className="flex items-center space-x-1 hover:text-foreground transition-colors"
            >
              {index === 0 && <Home className="h-4 w-4" />}
              <span>{item.label}</span>
            </Link>
          ) : (
            <span className="flex items-center space-x-1 text-foreground font-medium">
              {index === 0 && <Home className="h-4 w-4" />}
              <span>{item.label}</span>
            </span>
          )}
        </React.Fragment>
      ))}
    </nav>
  );
}