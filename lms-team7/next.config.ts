// next.config.ts
import type { NextConfig } from 'next';
import path from 'path';

const config: NextConfig = {
  turbopack: {
    // Force the workspace root to THIS folder
    root: path.resolve(__dirname),
  },
};

export default config;
