import { useRef, useState } from "react";
import { ImagePlus, X } from "lucide-react";
import { toast } from "sonner";

import { Button, Input } from "@/components/ui/primitives";
import { api, errorMessage } from "@/lib/api";

/**
 * Champ URL d'image avec téléversement direct vers la médiathèque (Cloudinary).
 * L'URL reste saisissable à la main pour une image hébergée ailleurs.
 */
export function ImageUpload({
  value,
  onChange,
  folder = "contenus",
  disabled,
}: {
  value: string;
  onChange: (url: string) => void;
  folder?: string;
  disabled?: boolean;
}) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [uploading, setUploading] = useState(false);

  const upload = async (file: File) => {
    const form = new FormData();
    form.append("files", file);
    form.append("folder", folder);
    setUploading(true);
    try {
      const { data } = await api.post<{ items: { url: string }[] }>("/media", form);
      onChange(data.items[0].url);
      toast.success("Image téléversée");
    } catch (error) {
      toast.error(errorMessage(error));
    } finally {
      setUploading(false);
    }
  };

  return (
    <div className="space-y-2">
      <div className="flex gap-2">
        <Input value={value} onChange={(e) => onChange(e.target.value)} placeholder="https://…" disabled={disabled} />
        <Button type="button" variant="outline" loading={uploading} disabled={disabled} onClick={() => inputRef.current?.click()}>
          {!uploading && <ImagePlus className="h-4 w-4" />}
          Téléverser
        </Button>
        <input
          ref={inputRef}
          type="file"
          accept="image/*"
          hidden
          onChange={(e) => {
            const file = e.target.files?.[0];
            if (file) upload(file);
            e.target.value = "";
          }}
        />
      </div>
      {value && (
        <div className="relative inline-block">
          <img src={value} alt="" className="h-24 rounded-lg border border-border object-cover" />
          {!disabled && (
            <button
              type="button"
              onClick={() => onChange("")}
              className="absolute -top-2 -right-2 rounded-full bg-destructive p-1 text-white shadow"
              aria-label="Retirer l'image"
            >
              <X className="h-3 w-3" />
            </button>
          )}
        </div>
      )}
    </div>
  );
}
