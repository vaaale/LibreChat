import dedent from 'dedent';
import { shadcnComponents } from 'librechat-data-provider';
import type {
  SandpackProviderProps,
  SandpackPredefinedTemplate,
} from '@codesandbox/sandpack-react';

const artifactFilename = {
  'application/vnd.react': 'App.tsx',
  'text/html': 'index.html',
  'application/vnd.code-html': 'index.html',
  'application/vnd.external-app': 'index.html',
  // mermaid and markdown types are handled separately in useArtifactProps.ts
  default: 'index.html',
  // 'css': 'css',
  // 'javascript': 'js',
  // 'typescript': 'ts',
  // 'jsx': 'jsx',
  // 'tsx': 'tsx',
};

const artifactTemplate: Record<
  | keyof typeof artifactFilename
  | 'application/vnd.mermaid'
  | 'text/markdown'
  | 'text/md'
  | 'text/plain',
  SandpackPredefinedTemplate | undefined
> = {
  'text/html': 'static',
  'application/vnd.react': 'react-ts',
  'application/vnd.mermaid': 'react-ts',
  'application/vnd.code-html': 'static',
  'application/vnd.external-app': undefined, // External apps don't use Sandpack
  'text/markdown': 'react-ts',
  'text/md': 'react-ts',
  'text/plain': 'react-ts',
  default: 'static',
  // 'css': 'css',
  // 'javascript': 'js',
  // 'typescript': 'ts',
  // 'jsx': 'jsx',
  // 'tsx': 'tsx',
};

export function getKey(type: string, language?: string): string {
  return `${type}${(language?.length ?? 0) > 0 ? `-${language}` : ''}`;
}

export function getArtifactFilename(type: string, language?: string): string {
  const key = getKey(type, language);
  return artifactFilename[key] ?? artifactFilename.default;
}

export function getTemplate(type: string, language?: string): SandpackPredefinedTemplate {
  const key = getKey(type, language);
  return artifactTemplate[key] ?? (artifactTemplate.default as SandpackPredefinedTemplate);
}

const standardDependencies = {
  three: '^0.167.1',
  'lucide-react': '^0.394.0',
  'react-router-dom': '^6.11.2',
  'class-variance-authority': '^0.6.0',
  clsx: '^1.2.1',
  'date-fns': '^3.3.1',
  'tailwind-merge': '^1.9.1',
  'tailwindcss-animate': '^1.0.5',
  recharts: '2.12.7',
  '@radix-ui/react-accordion': '^1.1.2',
  '@radix-ui/react-alert-dialog': '^1.0.2',
  '@radix-ui/react-aspect-ratio': '^1.1.0',
  '@radix-ui/react-avatar': '^1.1.0',
  '@radix-ui/react-checkbox': '^1.0.3',
  '@radix-ui/react-collapsible': '^1.0.3',
  '@radix-ui/react-dialog': '^1.0.2',
  '@radix-ui/react-dropdown-menu': '^2.1.1',
  '@radix-ui/react-hover-card': '^1.0.5',
  '@radix-ui/react-label': '^2.0.0',
  '@radix-ui/react-menubar': '^1.1.1',
  '@radix-ui/react-navigation-menu': '^1.2.0',
  '@radix-ui/react-popover': '^1.0.7',
  '@radix-ui/react-progress': '^1.1.0',
  '@radix-ui/react-radio-group': '^1.1.3',
  '@radix-ui/react-select': '^2.0.0',
  '@radix-ui/react-separator': '^1.0.3',
  '@radix-ui/react-slider': '^1.1.1',
  '@radix-ui/react-switch': '^1.0.3',
  '@radix-ui/react-tabs': '^1.0.3',
  '@radix-ui/react-toast': '^1.1.5',
  '@radix-ui/react-slot': '^1.1.0',
  '@radix-ui/react-toggle': '^1.1.0',
  '@radix-ui/react-toggle-group': '^1.1.0',
  '@radix-ui/react-tooltip': '^1.2.8',
  'embla-carousel-react': '^8.2.0',
  'react-day-picker': '^9.0.8',
  'dat.gui': '^0.7.9',
  vaul: '^0.9.1',
};

const mermaidDependencies = {
  mermaid: '^11.4.1',
  'react-zoom-pan-pinch': '^3.6.1',
  'class-variance-authority': '^0.6.0',
  clsx: '^1.2.1',
  'tailwind-merge': '^1.9.1',
  '@radix-ui/react-slot': '^1.1.0',
};

const markdownDependencies = {
  'marked-react': '^2.0.0',
};

const dependenciesMap: Record<
  | keyof typeof artifactFilename
  | 'application/vnd.mermaid'
  | 'text/markdown'
  | 'text/md'
  | 'text/plain',
  Record<string, string>
> = {
  'application/vnd.mermaid': mermaidDependencies,
  'application/vnd.react': standardDependencies,
  'text/html': standardDependencies,
  'application/vnd.code-html': standardDependencies,
  'text/markdown': markdownDependencies,
  'text/md': markdownDependencies,
  'text/plain': markdownDependencies,
  default: standardDependencies,
};

export function getDependencies(type: string): Record<string, string> {
  return dependenciesMap[type] ?? standardDependencies;
}

export function getProps(type: string): Partial<SandpackProviderProps> {
  return {
    customSetup: {
      dependencies: getDependencies(type),
    },
  };
}

export const sharedOptions: SandpackProviderProps['options'] = {
  externalResources: ['https://cdn.tailwindcss.com/3.4.17'],
};

export const EXTERNAL_APP_TYPE = 'application/vnd.external-app';

/**
 * Extracts URLs from HTML content (meta refresh, script redirects, iframe src, etc.)
 */
export function extractUrlsFromHtml(html: string): string[] {
  const urls: string[] = [];

  // Match meta refresh URLs
  const metaRefreshMatch = html.match(/content=["'][^"']*url=([^"'\s>]+)/i);
  if (metaRefreshMatch?.[1]) {
    urls.push(metaRefreshMatch[1]);
  }

  // Match window.location or window.top.location assignments
  const locationMatch = html.match(/(?:window\.(?:top\.)?location(?:\.href)?)\s*=\s*["']([^"']+)["']/i);
  if (locationMatch?.[1]) {
    urls.push(locationMatch[1]);
  }

  // Match iframe src
  const iframeSrcMatch = html.match(/<iframe[^>]+src=["']([^"']+)["']/i);
  if (iframeSrcMatch?.[1]) {
    urls.push(iframeSrcMatch[1]);
  }

  // Match anchor href with target="_top" or target="_parent"
  const anchorMatch = html.match(/<a[^>]+href=["']([^"']+)["'][^>]+target=["'](?:_top|_parent)["']/i);
  if (anchorMatch?.[1]) {
    urls.push(anchorMatch[1]);
  }

  return urls;
}

/**
 * Validates if an external app artifact is allowed based on server config
 */
export function isExternalAppAllowed(
  artifactType: string | undefined,
  artifactSource: { type: 'llm' | 'mcp'; mcpServer?: string } | undefined,
  artifactContent: string | undefined,
  mcpServers: Record<string, { externalApps?: { enabled: boolean; allowedOrigins: string[] } }> | undefined,
): { allowed: boolean; validatedUrl?: string; reason?: string } {
  // Must be external-app type
  if (artifactType !== EXTERNAL_APP_TYPE) {
    return { allowed: false, reason: 'Not an external app artifact' };
  }

  // Must come from an MCP server
  if (artifactSource?.type !== 'mcp' || !artifactSource.mcpServer) {
    return { allowed: false, reason: 'External apps must come from a trusted MCP server' };
  }

  const serverName = artifactSource.mcpServer;
  const serverConfig = mcpServers?.[serverName];

  // Server must have externalApps enabled
  if (!serverConfig?.externalApps?.enabled) {
    return { allowed: false, reason: `MCP server "${serverName}" does not have external apps enabled` };
  }

  const allowedOrigins = serverConfig.externalApps.allowedOrigins || [];
  if (allowedOrigins.length === 0) {
    return { allowed: false, reason: `MCP server "${serverName}" has no allowed origins configured` };
  }

  // Extract URLs from the artifact content
  const urls = extractUrlsFromHtml(artifactContent || '');
  if (urls.length === 0) {
    return { allowed: false, reason: 'No URLs found in artifact content' };
  }

  // Check if any extracted URL matches an allowed origin
  for (const url of urls) {
    for (const allowedOrigin of allowedOrigins) {
      if (url.startsWith(allowedOrigin)) {
        return { allowed: true, validatedUrl: url };
      }
    }
  }

  return { allowed: false, reason: `URLs in artifact do not match allowed origins for "${serverName}"` };
}

export const sharedFiles = {
  '/lib/utils.ts': shadcnComponents.utils,
  '/components/ui/accordion.tsx': shadcnComponents.accordian,
  '/components/ui/alert-dialog.tsx': shadcnComponents.alertDialog,
  '/components/ui/alert.tsx': shadcnComponents.alert,
  '/components/ui/avatar.tsx': shadcnComponents.avatar,
  '/components/ui/badge.tsx': shadcnComponents.badge,
  '/components/ui/breadcrumb.tsx': shadcnComponents.breadcrumb,
  '/components/ui/button.tsx': shadcnComponents.button,
  '/components/ui/calendar.tsx': shadcnComponents.calendar,
  '/components/ui/card.tsx': shadcnComponents.card,
  '/components/ui/carousel.tsx': shadcnComponents.carousel,
  '/components/ui/checkbox.tsx': shadcnComponents.checkbox,
  '/components/ui/collapsible.tsx': shadcnComponents.collapsible,
  '/components/ui/dialog.tsx': shadcnComponents.dialog,
  '/components/ui/drawer.tsx': shadcnComponents.drawer,
  '/components/ui/dropdown-menu.tsx': shadcnComponents.dropdownMenu,
  '/components/ui/input.tsx': shadcnComponents.input,
  '/components/ui/label.tsx': shadcnComponents.label,
  '/components/ui/menubar.tsx': shadcnComponents.menuBar,
  '/components/ui/navigation-menu.tsx': shadcnComponents.navigationMenu,
  '/components/ui/pagination.tsx': shadcnComponents.pagination,
  '/components/ui/popover.tsx': shadcnComponents.popover,
  '/components/ui/progress.tsx': shadcnComponents.progress,
  '/components/ui/radio-group.tsx': shadcnComponents.radioGroup,
  '/components/ui/select.tsx': shadcnComponents.select,
  '/components/ui/separator.tsx': shadcnComponents.separator,
  '/components/ui/skeleton.tsx': shadcnComponents.skeleton,
  '/components/ui/slider.tsx': shadcnComponents.slider,
  '/components/ui/switch.tsx': shadcnComponents.switchComponent,
  '/components/ui/table.tsx': shadcnComponents.table,
  '/components/ui/tabs.tsx': shadcnComponents.tabs,
  '/components/ui/textarea.tsx': shadcnComponents.textarea,
  '/components/ui/toast.tsx': shadcnComponents.toast,
  '/components/ui/toaster.tsx': shadcnComponents.toaster,
  '/components/ui/toggle-group.tsx': shadcnComponents.toggleGroup,
  '/components/ui/toggle.tsx': shadcnComponents.toggle,
  '/components/ui/tooltip.tsx': shadcnComponents.tooltip,
  '/components/ui/use-toast.tsx': shadcnComponents.useToast,
  '/public/index.html': dedent`
    <!DOCTYPE html>
    <html lang="en">
      <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Document</title>
        <script src="https://cdn.tailwindcss.com/3.4.17"></script>
      </head>
      <body>
        <div id="root"></div>
      </body>
    </html>
  `,
};
