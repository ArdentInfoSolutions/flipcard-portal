// 📁 src/app/create/website/page.tsx
"use client";

import WebsiteDetailsForm from "@/components/WebsiteDetailsForm";

export default function CreateWebsitePage() {
    return (
        <div className="container mx-auto py-8 px-4">
            <WebsiteDetailsForm />
        </div>
    );
}
