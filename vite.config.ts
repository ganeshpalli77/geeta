
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react-swc';
import path from 'path';

// Create a plugin to resolve figma:asset imports
function figmaAssetPlugin() {
  return {
    name: 'figma-asset-resolver',
    resolveId(id: string) {
      if (id.startsWith('figma:asset/')) {
        const filename = id.replace('figma:asset/', '');
        const resolvedPath = path.resolve(__dirname, './src/assets', filename);
        return resolvedPath;
      }
      return null; // Return null for other imports to let Vite handle them
    },
  };
}

export default defineConfig({
  plugins: [react(), figmaAssetPlugin()],
  resolve: {
    extensions: ['.js', '.jsx', '.ts', '.tsx', '.json', '.png', '.jpg', '.jpeg', '.svg'],
    alias: {
      'vaul@1.1.2': 'vaul',
      'sonner@2.0.3': 'sonner',
      'recharts@2.15.2': 'recharts',
      'react-resizable-panels@2.1.7': 'react-resizable-panels',
      'react-hook-form@7.55.0': 'react-hook-form',
      'react-day-picker@8.10.1': 'react-day-picker',
      'next-themes@0.4.6': 'next-themes',
      'lucide-react@0.487.0': 'lucide-react',
      'input-otp@1.4.2': 'input-otp',
      'figma:asset/fdcbeb1bd6eaf5f0de07c1c8beccea431c8d892e.png': path.resolve(__dirname, './src/assets/fdcbeb1bd6eaf5f0de07c1c8beccea431c8d892e.png'),
      'figma:asset/efb57fa65cd0ed6435b7a325b7bce684ff56d49f.png': path.resolve(__dirname, './src/assets/efb57fa65cd0ed6435b7a325b7bce684ff56d49f.png'),
      'figma:asset/ed490f058240e311ed9a1717bca41bcdbe4954ba.png': path.resolve(__dirname, './src/assets/ed490f058240e311ed9a1717bca41bcdbe4954ba.png'),
      'figma:asset/ed1389060fec7b047c20c2280d90378f169a3725.png': path.resolve(__dirname, './src/assets/ed1389060fec7b047c20c2280d90378f169a3725.png'),
      'figma:asset/e1311a82a975c11c46165799ccc918e5f8db2f77.png': path.resolve(__dirname, './src/assets/e1311a82a975c11c46165799ccc918e5f8db2f77.png'),
      'figma:asset/e01cfce0b00579d44b5757f2a6dddc81d94d137a.png': path.resolve(__dirname, './src/assets/e01cfce0b00579d44b5757f2a6dddc81d94d137a.png'),
      'figma:asset/d361286d97b8cacfde253ac6ef139d46142f1b6c.png': path.resolve(__dirname, './src/assets/d361286d97b8cacfde253ac6ef139d46142f1b6c.png'),
      'figma:asset/d217db6412e098f80f4cfd325ad8d9254fb04095.png': path.resolve(__dirname, './src/assets/d217db6412e098f80f4cfd325ad8d9254fb04095.png'),
      'figma:asset/b77932ec01d08386272811a89b496dcce465cf5e.png': path.resolve(__dirname, './src/assets/b77932ec01d08386272811a89b496dcce465cf5e.png'),
      'figma:asset/b1be310313346b4cc41a1c19e0c46ac2b1e530ee.png': path.resolve(__dirname, './src/assets/b1be310313346b4cc41a1c19e0c46ac2b1e530ee.png'),
      'figma:asset/adb4b523dfe1b7e90c142a3a1a1b74dccbc437ed.png': path.resolve(__dirname, './src/assets/adb4b523dfe1b7e90c142a3a1a1b74dccbc437ed.png'),
      'figma:asset/ab0f179662b8df4740827b653b04cc0565952fa8.png': path.resolve(__dirname, './src/assets/ab0f179662b8df4740827b653b04cc0565952fa8.png'),
      'figma:asset/a2fac2f316b024e99694889927cce46f4b049a3c.png': path.resolve(__dirname, './src/assets/a2fac2f316b024e99694889927cce46f4b049a3c.png'),
      'figma:asset/a2bf327d3524de693214b7d0523907ebc8a46bc9.png': path.resolve(__dirname, './src/assets/a2bf327d3524de693214b7d0523907ebc8a46bc9.png'),
      'figma:asset/948ef51074efa0a5c3a4bd84a2e188d01807e0c8.png': path.resolve(__dirname, './src/assets/948ef51074efa0a5c3a4bd84a2e188d01807e0c8.png'),
      'figma:asset/91f840562edf6c931819d72ca7bfce73080731d9.png': path.resolve(__dirname, './src/assets/91f840562edf6c931819d72ca7bfce73080731d9.png'),
      'figma:asset/8b4f97933a4356ab6ebc253799594480430c7b21.png': path.resolve(__dirname, './src/assets/8b4f97933a4356ab6ebc253799594480430c7b21.png'),
      'figma:asset/84f19c2ba36d94dd58ba0503ccdfe2faae953498.png': path.resolve(__dirname, './src/assets/84f19c2ba36d94dd58ba0503ccdfe2faae953498.png'),
      'figma:asset/6c8f53855abde9cefdbf907162db195cb225d671.png': path.resolve(__dirname, './src/assets/6c8f53855abde9cefdbf907162db195cb225d671.png'),
      'figma:asset/61f604eee1e4b9e65612d9e884e4f9c27eb449a9.png': path.resolve(__dirname, './src/assets/61f604eee1e4b9e65612d9e884e4f9c27eb449a9.png'),
      'figma:asset/4db57f4a98cef27888772fb1d7e0abd9c321656b.png': path.resolve(__dirname, './src/assets/4db57f4a98cef27888772fb1d7e0abd9c321656b.png'),
      'figma:asset/4bcaefc4e9f69e78ddf7b89054609454ba6c3e99.png': path.resolve(__dirname, './src/assets/4bcaefc4e9f69e78ddf7b89054609454ba6c3e99.png'),
      'figma:asset/4b035e5a54e0630a8e20bbfcdcc5ad1fef238061.png': path.resolve(__dirname, './src/assets/4b035e5a54e0630a8e20bbfcdcc5ad1fef238061.png'),
      'figma:asset/435ea7088cc57855bdf284db416a1ddbf3b33b33.png': path.resolve(__dirname, './src/assets/435ea7088cc57855bdf284db416a1ddbf3b33b33.png'),
      'figma:asset/3df4021e49f5f030fd2973b9ed6aa711b3ff3951.png': path.resolve(__dirname, './src/assets/3df4021e49f5f030fd2973b9ed6aa711b3ff3951.png'),
      'figma:asset/1baf62afc6e548dfe5a1b468b24bd371202e9f47.png': path.resolve(__dirname, './src/assets/1baf62afc6e548dfe5a1b468b24bd371202e9f47.png'),
      'figma:asset/16145dd8c00c2a0c9ba422ce5e1de27e6b98be41.png': path.resolve(__dirname, './src/assets/16145dd8c00c2a0c9ba422ce5e1de27e6b98be41.png'),
      'figma:asset/05e419c6a2f9ca2c49ca6c49d36e50c98d0b64fa.png': path.resolve(__dirname, './src/assets/05e419c6a2f9ca2c49ca6c49d36e50c98d0b64fa.png'),
      'embla-carousel-react@8.6.0': 'embla-carousel-react',
      'cmdk@1.1.1': 'cmdk',
      'class-variance-authority@0.7.1': 'class-variance-authority',
      '@radix-ui/react-tooltip@1.1.8': '@radix-ui/react-tooltip',
      '@radix-ui/react-toggle@1.1.2': '@radix-ui/react-toggle',
      '@radix-ui/react-toggle-group@1.1.2': '@radix-ui/react-toggle-group',
      '@radix-ui/react-tabs@1.1.3': '@radix-ui/react-tabs',
      '@radix-ui/react-switch@1.1.3': '@radix-ui/react-switch',
      '@radix-ui/react-slot@1.1.2': '@radix-ui/react-slot',
      '@radix-ui/react-slider@1.2.3': '@radix-ui/react-slider',
      '@radix-ui/react-separator@1.1.2': '@radix-ui/react-separator',
      '@radix-ui/react-select@2.1.6': '@radix-ui/react-select',
      '@radix-ui/react-scroll-area@1.2.3': '@radix-ui/react-scroll-area',
      '@radix-ui/react-radio-group@1.2.3': '@radix-ui/react-radio-group',
      '@radix-ui/react-progress@1.1.2': '@radix-ui/react-progress',
      '@radix-ui/react-popover@1.1.6': '@radix-ui/react-popover',
      '@radix-ui/react-navigation-menu@1.2.5': '@radix-ui/react-navigation-menu',
      '@radix-ui/react-menubar@1.1.6': '@radix-ui/react-menubar',
      '@radix-ui/react-label@2.1.2': '@radix-ui/react-label',
      '@radix-ui/react-hover-card@1.1.6': '@radix-ui/react-hover-card',
      '@radix-ui/react-dropdown-menu@2.1.6': '@radix-ui/react-dropdown-menu',
      '@radix-ui/react-dialog@1.1.6': '@radix-ui/react-dialog',
      '@radix-ui/react-context-menu@2.2.6': '@radix-ui/react-context-menu',
      '@radix-ui/react-collapsible@1.1.3': '@radix-ui/react-collapsible',
      '@radix-ui/react-checkbox@1.1.4': '@radix-ui/react-checkbox',
      '@radix-ui/react-avatar@1.1.3': '@radix-ui/react-avatar',
      '@radix-ui/react-aspect-ratio@1.1.2': '@radix-ui/react-aspect-ratio',
      '@radix-ui/react-alert-dialog@1.1.6': '@radix-ui/react-alert-dialog',
      '@radix-ui/react-accordion@1.2.3': '@radix-ui/react-accordion',
      '@': path.resolve(__dirname, './src'),
    },
  },
  build: {
    target: 'esnext',
    outDir: 'build',
  },
  server: {
    port: 3000,
    open: true,
  },
});