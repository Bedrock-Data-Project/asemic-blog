import { HeadConfig, PageData } from "vitepress";
import dotenv from "dotenv";

dotenv.config();

const baseHeaders: HeadConfig[] = [
    [
        "meta",
        {
            property: "og:type",
            content: "website",
        },
    ],
    [
        "meta",
        {
            property: "twitter:card",
            content: "summary_large_image",
        },
    ],
    [
        "meta",
        {
            property: "linkedin:card",
            content: "summary_large_image",
        },
    ],
];

const analytics: HeadConfig = [
    "script",
    {
        defer: "true",
        src: process.env.UMAMI_SRC as string,
        "data-website-id": process.env.UMAMI_WEBSITE_ID as string,
    },
];

export function getHead() {
    return process.env.ENVIRONMENT === "production"
        ? [...baseHeaders, analytics]
        : baseHeaders;
}

export function transformHead(pageData: PageData) {
    const head: HeadConfig[] = [];

    const title = pageData.frontmatter.title;
    const description = pageData.frontmatter.description;
    const pageUrl = getPageUrl(pageData.relativePath);
    const imageUrl = getImageUrl(pageData.frontmatter.image);
    console.log(imageUrl);
    if (title) {
        head.push(["meta", { property: "og:title", content: title }]);
        head.push(["meta", { property: "twitter:title", content: title }]);
        head.push(["meta", { property: "linkedin:title", content: title }]);
    }

    if (description) {
        head.push([
            "meta",
            {
                property: "og:description",
                content: description,
            },
        ]);
        head.push([
            "meta",
            {
                property: "twitter:description",
                content: description,
            },
        ]);
        head.push([
            "meta",
            {
                property: "linkedin:description",
                content: description,
            },
        ]);
    }

    if (pageUrl) {
        head.push(["meta", { property: "og:url", content: pageUrl }]);
        head.push(["meta", { property: "twitter:url", content: pageUrl }]);
        head.push(["meta", { property: "linkedin:url", content: pageUrl }]);
    }

    head.push(["meta", { property: "og:image", content: imageUrl }]);
    head.push(["meta", { property: "twitter:image", content: imageUrl }]);
    head.push(["meta", { property: "linkedin:image", content: imageUrl }]);

    return head;
}

function getPageUrl(path: string) {
    const relativePath = path.replace(".md", "");

    if (relativePath === "index") {
        return process.env.APP_URL;
    } else {
        return `${process.env.APP_URL}${relativePath}`;
    }
}

function getImageUrl(image: string): string {
    if (image) {
        return image;
    } else {
        return "/img/social.jpg";
    }
}
