import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";
import { getUserSettings } from "@/lib/storage";
import { getCurrentLocation } from "@/lib/location";
import { generateMessage } from "@/lib/message";
import { useState } from "react";
import { Loader2, Copy, Share2 } from "lucide-react";

export default function Home() {
  const [isGenerating, setIsGenerating] = useState(false);
  const [message, setMessage] = useState<string | null>(null);
  const { toast } = useToast();

  const handleGenerate = async () => {
    try {
      setIsGenerating(true);
      const settings = getUserSettings();

      if (!settings) {
        toast({
          title: "Settings Required",
          description: "Please configure your username in settings first",
          variant: "destructive",
        });
        return;
      }

      let location = null;
      if (settings.includeLocation) {
        location = await getCurrentLocation();
      }

      const generatedMessage = generateMessage(settings.username, location);
      setMessage(generatedMessage);
      await navigator.clipboard.writeText(generatedMessage);

      toast({
        title: "Success!",
        description: "Message generated and copied to clipboard",
      });
    } catch (error) {
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : "Failed to generate message",
        variant: "destructive",
      });
    } finally {
      setIsGenerating(false);
    }
  };

  const shareOnWhatsApp = () => {
    if (!message) return;
    const encodedMessage = encodeURIComponent(message);
    const whatsappUrl = `https://wa.me/?text=${encodedMessage}`;
    window.open(whatsappUrl, '_blank');
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-[calc(100vh-8rem)] p-4 gap-6">
      <Button
        size="lg"
        className="w-full max-w-[280px] h-16 text-lg font-semibold shadow-lg hover:shadow-xl transition-all"
        onClick={handleGenerate}
        disabled={isGenerating}
      >
        {isGenerating ? (
          <>
            <Loader2 className="mr-2 h-6 w-6 animate-spin" />
            Generating...
          </>
        ) : (
          "Generate Message"
        )}
      </Button>

      {message && (
        <Card className="w-full max-w-[500px] shadow-md">
          <CardContent className="p-4 sm:p-6">
            <div className="flex flex-col sm:flex-row justify-between items-start gap-4">
              <p className="text-sm sm:text-base text-muted-foreground flex-1 break-words">
                {message}
              </p>
              <div className="flex gap-2 self-end sm:self-start mt-4 sm:mt-0">
                <Button
                  variant="outline"
                  size="lg"
                  className="h-12 px-6"
                  onClick={async () => {
                    await navigator.clipboard.writeText(message);
                    toast({ title: "Copied to clipboard" });
                  }}
                >
                  <Copy className="h-5 w-5 sm:mr-2" />
                  <span className="hidden sm:inline">Copy</span>
                </Button>
                <Button
                  variant="outline"
                  size="lg"
                  className="h-12 px-6"
                  onClick={shareOnWhatsApp}
                >
                  <Share2 className="h-5 w-5 sm:mr-2" />
                  <span className="hidden sm:inline">Share</span>
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}