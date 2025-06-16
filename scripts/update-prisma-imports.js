const fs = require('fs');
const path = require('path');

const files = [
  'app/blog/[slug]/page.tsx',
  'app/blog/page.tsx',
  'app/api/news/route.ts',
  'app/api/popup/route.ts',
  'app/api/site-settings/route.ts',
  'app/api/auth/change-password/route.ts',
  'app/api/marquee/route.ts',
  'app/api/admin/users/[id]/route.ts',
  'app/api/admin/seo-settings/route.ts',
  'app/api/admin/site-settings/route.ts',
  'app/api/admin/marquee/route.ts',
  'app/api/form-submission/route.ts',
  'app/api/admin/blogs/route.ts',
  'app/api/admin/marquee/[id]/route.ts',
  'app/api/admin/change-password/route.ts'
];

files.forEach(file => {
  const filePath = path.join(process.cwd(), file);
  if (fs.existsSync(filePath)) {
    let content = fs.readFileSync(filePath, 'utf8');
    content = content.replace(
      /import\s+(?:{?\s*prisma\s*}?|prisma)\s+from\s+["']@\/lib\/db["']/g,
      'import { prisma } from "@/lib/prisma"'
    );
    fs.writeFileSync(filePath, content);
    console.log(`Updated ${file}`);
  } else {
    console.log(`File not found: ${file}`);
  }
}); 