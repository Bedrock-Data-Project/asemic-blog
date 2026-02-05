import { defineConfig } from "vitepress";
import { generateLinks } from "./rewrites.ts";
import { getHead, transformHead } from "./head.ts";

const { sidebar, rewrites } = generateLinks();

export default defineConfig({
    title: "Asemic Blog - Insights on Product Analytics & Data Modeling",
    head: getHead(),
    description: "Explore insights on product analytics, data modeling, semantic layers, and user behavior analysis. Learn about freemium metrics, DWH-native analytics, and modern data architecture.",
    srcDir: "docs",
    transformHead: ({ pageData }) => transformHead(pageData),
    rewrites: rewrites,
    cleanUrls: true,
    ignoreDeadLinks: true,
    sitemap: {
        hostname: "https://blog.asemicanalytics.com",
    },
    themeConfig: {
        search: {
            provider: "local",
        },
        nav: [
            { text: "Blog", link: "/analysis-is-about-building-dataset" },
            { text: "Asemic", link: "https://www.asemicanalytics.com" },
            {
                text: "Docs",
                link: "https://docs.asemicanalytics.com/get-started/introduction",
            },
            { text: "Demo", link: "https://www.asemicanalytics.com/book-a-demo" },
        ],
        sidebar: sidebar,
    },
});
