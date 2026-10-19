import{build}from'vite';import react from'@vitejs/plugin-react';import fs from'node:fs';
await build({configFile:false,plugins:[react()],define:{'process.env.NODE_ENV':'"production"'},build:{lib:{entry:'prototypes/defense-review/mount.jsx',name:'DefenseReview',formats:['iife'],fileName:()=> 'review.js'},outDir:'tmp/defense-review-build',minify:true}});
const shell=fs.readFileSync('prototypes/defense-review/shell.html','utf8');
fs.writeFileSync('/workspace/defensive-engine-concepts.html',shell.replace('/* REVIEW_STYLE */',()=>fs.readFileSync('tmp/defense-review-build/schemebuilders-v2.css','utf8')).replace('/* REVIEW_SCRIPT */',()=>fs.readFileSync('tmp/defense-review-build/review.js','utf8')));
