import { defineConfig } from "vitepress";
import { generateLinks } from "./rewrites.ts";
import { getHead, transformHead } from "./head.ts";

const { sidebar, rewrites } = generateLinks();

export default defineConfig({
    title: "Asemic Blog",
    head: getHead(),
    description: "Advanced product analytics platform",
    srcDir: "docs",
    transformHead: ({ pageData }) => transformHead(pageData),
    rewrites: rewrites,
    cleanUrls: true,
    ignoreDeadLinks: true,
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
