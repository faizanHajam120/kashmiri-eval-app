const SITE_URL = "https://kashmiri-eval.vercel.app";

export default function robots() {
    return {
        rules: [
            {
                userAgent: "*",
                allow: "/",
                disallow: ["/admin", "/evaluate", "/progress", "/login", "/signup"],
            },
        ],
        sitemap: `${SITE_URL}/sitemap.xml`,
    };
}
