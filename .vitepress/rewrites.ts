import fs from "fs";
import path from "path";
import matter from "gray-matter";

interface SidebarItem {
    text: string;
    link: string;
}

interface SidebarGroup {
    text: string;
    collapsed: boolean;
    items: SidebarItem[];
}

type SidebarEntry = SidebarGroup | SidebarItem;

interface GenerateConfigResult {
    rewrites: Record<string, string>;
    sidebar: SidebarEntry[];
}

const docsDir = path.resolve(__dirname, "..", "docs");

function getFrontmatterTitle(filePath: string): string | null {
    try {
        const fileContent = fs.readFileSync(filePath, "utf-8");
        const { data } = matter(fileContent);
        return data.title || null;
    } catch (error) {
        console.warn(`Failed to read frontmatter from ${filePath}:`, error);
        return null;
    }
}

function formatUrl(str: string): string {
    return str
        .toLowerCase()
        .replace(/\s+/g, "-") // Replace spaces with hyphens
        .replace(/%20/g, "-"); // Also replace any existing %20 with hyphens
}

export function generateLinks(): GenerateConfigResult {
    const rewrites: Record<string, string> = {};
    const sidebar: SidebarEntry[] = [];

    // Add check for root files
    const rootFiles = fs
        .readdirSync(docsDir)
        .filter((f) => f.endsWith(".md") && /^\d+\./.test(f));

    // Sort root files by their number prefixes
    rootFiles.sort((a, b) => {
        const aNum = parseInt(a.split(".")[0]);
        const bNum = parseInt(b.split(".")[0]);
        return aNum - bNum;
    });

    // Process root files
    for (const file of rootFiles) {
        const fileName = file.replace(/^\d+\./, "").replace(/\.md$/, "");
        const filePath = path.join(docsDir, file);
        const title = getFrontmatterTitle(filePath);

        rewrites[file] = `${formatUrl(fileName)}.md`;
        sidebar.push({
            text: title || fileName.replace(/-/g, " "),
            link: `/${formatUrl(fileName)}`,
        });
    }

    const folders = fs.readdirSync(docsDir).filter((f) => {
        return (
            fs.statSync(path.join(docsDir, f)).isDirectory() && /^\d+\./.test(f) // Only include folders that start with a number and a dot
        );
    });
    // Sort folders by their number prefixes
    folders.sort((a, b) => {
        const aNum = parseInt(a.split(".")[0]);
        const bNum = parseInt(b.split(".")[0]);
        return aNum - bNum;
    });

    for (const folder of folders) {
        const folderPath = path.join(docsDir, folder);

        // Extract folder name without number
        const folderName = folder.replace(/^\d+\./, "");

        const section: SidebarGroup = {
            text: folderName.replace(/-/g, " "),
            collapsed: false,
            items: [],
        };

        const files = fs
            .readdirSync(folderPath)
            .filter((f) => f.endsWith(".md"));

        // Sort files by their number prefixes
        files.sort((a, b) => {
            const aNum = parseInt(a.split(".")[0]);
            const bNum = parseInt(b.split(".")[0]);
            return aNum - bNum;
        });

        for (const file of files) {
            const filePath = path.join(folderPath, file);
            const fileName = file.replace(/^\d+\./, "").replace(/\.md$/, "");
            const title = getFrontmatterTitle(filePath);

            const numberedPath = `${folder}/${file}`;
            const cleanPath = `${formatUrl(folderName)}/${formatUrl(
                fileName
            )}.md`;

            rewrites[numberedPath] = cleanPath;
            section.items.push({
                text: title || fileName.replace(/-/g, " "),
                link: `/${formatUrl(folderName)}/${formatUrl(fileName)}`,
            });
        }

        sidebar.push(section);
    }

    return { rewrites, sidebar };
}
