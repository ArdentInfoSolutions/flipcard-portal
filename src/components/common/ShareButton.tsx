import { Share2 } from "lucide-react";
import { Button } from "@/components/ui/button";

//exporting share options
import {
  FacebookShareButton,
  WhatsappShareButton,
  TwitterShareButton,
  FacebookIcon,
  WhatsappIcon,
  TwitterIcon,
} from "next-share";

export function SocialShare({ url, title }: { url: string; title: string }) {
  return (
    <div className="flex gap-2">
      <FacebookShareButton url={url} quote={title}>
        <FacebookIcon size={32} round />
      </FacebookShareButton>
      <WhatsappShareButton url={url} title={title}>
        <WhatsappIcon size={32} round />
      </WhatsappShareButton>
      <TwitterShareButton url={url} title={title}>
        <TwitterIcon size={32} round />
      </TwitterShareButton>
    </div>
  );
}


export function ShareButton({ title, url }: { title: string; url: string }) {
  const handleShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title,
          text: `Check this out: ${title}`,
          url,
        });
      } catch (err) {
        //console.error("Share failed:", err);
      }
    } else {
      // fallback: copy link to clipboard
      try {
        await navigator.clipboard.writeText(url);
        alert("🔗 Link copied to clipboard!");
      } catch (err) {
        console.error("Clipboard write failed:", err);
      }
    }
  };
  const onClick = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    e.stopPropagation();
    
    handleShare();
  };

  return (
    <Button
      variant="outline"
      size="icon"
      onClick={onClick}
      className="flex items-center"
    >
      <Share2 className="h-4 w-4" />
    </Button>
  );
}