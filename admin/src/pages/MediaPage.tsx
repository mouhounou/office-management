import { useCallback, useRef, useState } from "react";
import { useSearchParams } from "react-router-dom";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { Copy, FileText, ImageIcon, Trash2, Upload } from "lucide-react";
import { toast } from "sonner";

import { ConfirmDialog, Dialog } from "@/components/ui/dialog";
import { Pagination, SearchInput } from "@/components/ui/data";
import { Button, Card, EmptyState, ErrorBlock, Field, Input, LoadingBlock, PageHeader } from "@/components/ui/primitives";
import { api, errorMessage, type AnyRecord } from "@/lib/api";
import { useAuth } from "@/lib/auth";
import { paramsFrom, useList, useRemove, type ListParams } from "@/lib/queries";
import { cn, formatBytes, formatDate } from "@/lib/utils";

export function MediaPage() {
  const [search, setSearch] = useSearchParams();
  const params: ListParams = { ...paramsFrom(search, ["folder"]), limit: 24 };
  const { data, isLoading, error, refetch } = useList("media", params);
  const { can } = useAuth();
  const queryClient = useQueryClient();
  const inputRef = useRef<HTMLInputElement>(null);
  const [dragging, setDragging] = useState(false);
  const [selected, setSelected] = useState<AnyRecord | null>(null);

  const setParam = useCallback(
    (key: string, value: string) =>
      setSearch((prev) => {
        const next = new URLSearchParams(prev);
        if (value) next.set(key, value);
        else next.delete(key);
        if (key !== "page") next.delete("page");
        return next;
      }),
    [setSearch],
  );
  const onSearch = useCallback((value: string) => setParam("q", value), [setParam]);

  const upload = useMutation({
    mutationFn: async (files: File[]) => {
      const form = new FormData();
      files.forEach((file) => form.append("files", file));
      form.append("folder", String(params.folder || "general"));
      return (await api.post<{ items: AnyRecord[] }>("/media", form)).data.items;
    },
    onSuccess: (items) => {
      queryClient.invalidateQueries({ queryKey: ["media"] });
      toast.success(`${items.length} fichier${items.length > 1 ? "s" : ""} téléversé${items.length > 1 ? "s" : ""}`);
    },
    onError: (err) => toast.error(errorMessage(err)),
  });

  const pick = (files: FileList | null) => {
    const list = Array.from(files ?? []).slice(0, 10);
    if (list.length) upload.mutate(list);
  };

  return (
    <>
      <PageHeader
        title="Médiathèque"
        description="Images du site, stockées sur Cloudinary (8 Mo max par fichier)."
        actions={
          can("edit") && (
            <Button onClick={() => inputRef.current?.click()} loading={upload.isPending}>
              {!upload.isPending && <Upload className="h-4 w-4" />} Téléverser
            </Button>
          )
        }
      />
      <input ref={inputRef} type="file" accept="image/*" multiple hidden onChange={(e) => { pick(e.target.files); e.target.value = ""; }} />

      <Card
        onDragOver={(e) => { if (can("edit")) { e.preventDefault(); setDragging(true); } }}
        onDragLeave={() => setDragging(false)}
        onDrop={(e) => { e.preventDefault(); setDragging(false); if (can("edit")) pick(e.dataTransfer.files); }}
        className={cn(dragging && "ring-2 ring-primary")}
      >
        <div className="flex flex-wrap gap-3 border-b border-border p-4">
          <SearchInput value={String(params.q ?? "")} onChange={onSearch} placeholder="Nom, texte alternatif…" className="w-full sm:w-auto sm:min-w-56 sm:flex-1" />
          <Input value={String(params.folder ?? "")} onChange={(e) => setParam("folder", e.target.value)} placeholder="Dossier (ex. contenus)" className="w-full sm:w-48" />
        </div>

        {isLoading ? (
          <LoadingBlock />
        ) : error ? (
          <ErrorBlock error={error} onRetry={refetch} />
        ) : !data?.items.length ? (
          <EmptyState icon={ImageIcon} title="Aucun fichier" description={can("edit") ? "Glissez-déposez des images ici ou utilisez « Téléverser »." : undefined} />
        ) : (
          <>
            <ul className="grid grid-cols-2 gap-4 p-4 sm:grid-cols-3 md:grid-cols-4 xl:grid-cols-6">
              {data.items.map((media) => (
                <li key={media.id}>
                  <button onClick={() => setSelected(media)} className="group block w-full overflow-hidden rounded-lg border border-border text-left transition hover:border-primary">
                    <div className="flex aspect-square items-center justify-center bg-muted">
                      {media.mimeType?.startsWith("image/") ? (
                        <img src={media.url} alt={media.alt ?? ""} loading="lazy" className="h-full w-full object-cover transition group-hover:scale-105" />
                      ) : (
                        <FileText className="h-8 w-8 text-muted-foreground" />
                      )}
                    </div>
                    <div className="px-2 py-1.5">
                      <div className="truncate text-xs font-medium">{media.name}</div>
                      <div className="text-[11px] text-muted-foreground">{formatBytes(media.sizeBytes)}</div>
                    </div>
                  </button>
                </li>
              ))}
            </ul>
            <Pagination page={data.page} pages={data.pages} total={data.total} onChange={(page) => setParam("page", String(page))} />
          </>
        )}
      </Card>

      {selected && <MediaDialog media={selected} onClose={() => setSelected(null)} />}
    </>
  );
}

function MediaDialog({ media, onClose }: { media: AnyRecord; onClose: () => void }) {
  const { can } = useAuth();
  const queryClient = useQueryClient();
  const remove = useRemove("media");
  const [form, setForm] = useState({ name: media.name ?? "", alt: media.alt ?? "", folder: media.folder ?? "" });
  const [confirm, setConfirm] = useState(false);

  const save = useMutation({
    mutationFn: () => api.patch(`/media/${media.id}`, form),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["media"] });
      toast.success("Fichier mis à jour");
      onClose();
    },
    onError: (err) => toast.error(errorMessage(err)),
  });

  const copy = async () => {
    try {
      await navigator.clipboard.writeText(media.url);
      toast.success("URL copiée");
    } catch {
      toast.error("Copie impossible");
    }
  };

  return (
    <>
      <Dialog
        open
        onClose={onClose}
        size="lg"
        title={media.name}
        description={`${formatBytes(media.sizeBytes)}${media.width ? ` · ${media.width}×${media.height}` : ""} · ajouté le ${formatDate(media.createdAt)}`}
        footer={
          <>
            {can("edit") && (
              <Button variant="outline" className="mr-auto text-destructive" onClick={() => setConfirm(true)}>
                <Trash2 className="h-4 w-4" /> Supprimer
              </Button>
            )}
            <Button variant="outline" onClick={copy}>
              <Copy className="h-4 w-4" /> Copier l'URL
            </Button>
            {can("edit") && <Button onClick={() => save.mutate()} loading={save.isPending}>Enregistrer</Button>}
          </>
        }
      >
        <div className="grid gap-5 sm:grid-cols-2">
          <div className="flex items-center justify-center overflow-hidden rounded-lg bg-muted">
            {media.mimeType?.startsWith("image/") ? <img src={media.url} alt={media.alt ?? ""} className="max-h-72 object-contain" /> : <FileText className="h-12 w-12 text-muted-foreground" />}
          </div>
          <div className="space-y-4">
            <Field label="Nom" htmlFor="m-name">
              <Input id="m-name" value={form.name} disabled={!can("edit")} onChange={(e) => setForm({ ...form, name: e.target.value })} />
            </Field>
            <Field label="Texte alternatif" htmlFor="m-alt" hint="Décrit l'image pour l'accessibilité et le référencement.">
              <Input id="m-alt" value={form.alt} disabled={!can("edit")} onChange={(e) => setForm({ ...form, alt: e.target.value })} />
            </Field>
            <Field label="Dossier" htmlFor="m-folder">
              <Input id="m-folder" value={form.folder} disabled={!can("edit")} onChange={(e) => setForm({ ...form, folder: e.target.value })} />
            </Field>
          </div>
        </div>
      </Dialog>
      <ConfirmDialog
        open={confirm}
        onClose={() => setConfirm(false)}
        loading={remove.isPending}
        title="Supprimer ce fichier ?"
        description="Il sera aussi supprimé de Cloudinary. Les pages qui l'affichent n'auront plus d'image."
        onConfirm={async () => {
          try {
            await remove.mutateAsync(media.id);
            toast.success("Fichier supprimé");
            onClose();
          } catch (err) {
            toast.error(errorMessage(err));
          }
        }}
      />
    </>
  );
}
