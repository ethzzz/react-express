import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react-swc'
import AutoImport from 'unplugin-auto-import/vite'
import AntdResolver from 'unplugin-antd-resolver'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    react(),
    AutoImport({
      imports: ['react',  'react-router-dom'],
      include: [/\.tsx$/, /\.ts$/],
      resolvers: [AntdResolver()],
      dts: 'src/auto-imports.d.ts',
      // dts:true
    })
  ],
  resolve: {
    alias: {
      '@': '/src',
      '#': '/types'
    }
  },
  server:{
    proxy:{
      '/socket.io':{
        target:'http://localhost:3001',
        changeOrigin:true,
        ws:true,
        rewrite: (path)=>path.replace(new RegExp('^/socket.io'), '')
      },
      '/api':{
        target:'http://localhost:3000',
        changeOrigin:true,
        ws:true,
        rewrite: (path)=>path.replace(new RegExp('^/api'), '')
      },
      '/upload':{
        target:'http://localhost:3000',
        changeOrigin:true,
        ws:true,
        // rewrite: (path)=>path.replace(new RegExp('^/upload'), '')
      },
      '/mock':{
        // target:'http://localhost:3000',
        changeOrigin:true,
        ws:true,
        // rewrite:(path)=>path.replace(/^\/api/,'/api')
      },
    }
  }
})
