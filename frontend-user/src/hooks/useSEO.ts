import { useEffect } from 'react';

interface SEOProps {
    title?: string;
    description?: string;
    keywords?: string;
    image?: string;
    url?: string;
}

export const useSEO = ({ title, description, keywords, image, url }: SEOProps) => {
    useEffect(() => {
        const baseTitle = "BookStore - Nơi tri thức hội tụ";
        document.title = title ? `${title} | ${baseTitle}` : baseTitle;

        const updateMeta = (name: string, content: string | undefined, attr: 'name' | 'property' = 'name') => {
            if (!content) return;
            let el = document.querySelector(`meta[${attr}="${name}"]`);
            if (!el) {
                el = document.createElement('meta');
                el.setAttribute(attr, name);
                document.head.appendChild(el);
            }
            el.setAttribute('content', content);
        };

        updateMeta('description', description);
        updateMeta('keywords', keywords);
        updateMeta('og:title', title, 'property');
        updateMeta('og:description', description, 'property');
        updateMeta('og:image', image, 'property');
        updateMeta('og:url', url || window.location.href, 'property');
        updateMeta('twitter:card', 'summary_large_image');
    }, [title, description, keywords, image, url]);
};
