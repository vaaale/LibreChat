export interface CodeBlock {
  id: string;
  language: string;
  content: string;
}

export interface ArtifactSource {
  type: 'llm' | 'mcp';
  mcpServer?: string;
}

export interface Artifact {
  id: string;
  lastUpdateTime: number;
  index?: number;
  messageId?: string;
  identifier?: string;
  language?: string;
  content?: string;
  title?: string;
  type?: string;
  /** Source of the artifact - tracks whether it came from LLM or MCP server */
  source?: ArtifactSource;
}

export type ArtifactFiles =
  | {
      'App.tsx': string;
      'index.tsx': string;
      '/components/ui/MermaidDiagram.tsx': string;
    }
  | Partial<{
      [x: string]: string | undefined;
    }>;
