import fs from 'fs';
import { transformSync } from 'esbuild';

const files = [
  'src/App.jsx',
  'src/components/AnalyticsCharts.jsx',
  'src/components/JobModal.jsx',
  'src/pages/Kanban.jsx',
  'src/context/JobContext.jsx'
];

for (const file of files) {
  try {
    const content = fs.readFileSync(file, 'utf-8');
    transformSync(content, { loader: 'jsx' });
    console.log(file + ' OK');
  } catch (err) {
    // Only print the first error lines
    console.error(file + ' ERROR:', err.message.split('\n').slice(0, 5).join('\n'));
  }
}
