import { useCallback } from "react";
import { Link, useNavigate, useParams, useSearchParams } from "react-router-dom";
import { Download, Inbox, Plus } from "lucide-react";
import { toast } from "sonner";

import { Card, EmptyState, ErrorBlock, LoadingBlock, PageHeader, Select, Button } from "@/components/ui/primitives";
import { Pagination, SearchInput, Table, Td, Th } from "@/components/ui/data";
import { api, errorMessage } from "@/lib/api";
import { useAuth } from "@/lib/auth";
import { paramsFrom, useList } from "@/lib/queries";
import { RESOURCE_BY_KEY, type ResourceDef } from "@/lib/resources";
import { NotFoundPage } from "@/pages/NotFoundPage";

export function ResourceListPage() {
  const { resource: key = "" } = useParams();
  const def = RESOURCE_BY_KEY[key];
  if (!def) return <NotFoundPage />;
  // La clé force un état neuf quand on passe d'une ressource à l'autre.
  return <ResourceList key={def.key} def={def} />;
}

function ResourceList({ def }: { def: ResourceDef }) {
  const [search, setSearch] = useSearchParams();
  const navigate = useNavigate();
  const { can } = useAuth();
  const filterKeys = (def.filters ?? []).map((f) => f.name);
  const params = paramsFrom(search, filterKeys);
  const { data, isLoading, error, refetch, isFetching } = useList(def.key, params);

  const update = useCallback(
    (key: string, value: string) => {
      setSearch((prev) => {
        const next = new URLSearchParams(prev);
        if (value) next.set(key, value);
        else next.delete(key);
        if (key !== "page") next.delete("page");
        return next;
      });
    },
    [setSearch],
  );
  const onSearch = useCallback((value: string) => update("q", value), [update]);

  const exportCsv = async () => {
    if (!def.csvExport) return;
    try {
      const { data: csv } = await api.get<Blob>(def.csvExport, { responseType: "blob" });
      const url = URL.createObjectURL(csv);
      const anchor = Object.assign(document.createElement("a"), { href: url, download: `${def.key}.csv` });
      anchor.click();
      URL.revokeObjectURL(url);
    } catch (err) {
      toast.error(errorMessage(err));
    }
  };

  const canCreate = def.mode === "content" && can("edit");

  return (
    <>
      <PageHeader
        title={def.title}
        description={def.description}
        actions={
          <>
            {def.csvExport && (
              <Button variant="outline" onClick={exportCsv}>
                <Download className="h-4 w-4" /> Exporter CSV
              </Button>
            )}
            {canCreate && (
              <Button onClick={() => navigate(`/${def.key}/new`)}>
                <Plus className="h-4 w-4" /> Nouveau
              </Button>
            )}
          </>
        }
      />

      <Card>
        <div className="flex flex-wrap items-center gap-3 border-b border-border p-4">
          <SearchInput value={String(params.q ?? "")} onChange={onSearch} placeholder={def.searchPlaceholder} className="w-full sm:w-auto sm:min-w-56 sm:flex-1" />
          {def.filters?.map((filter) => (
            <Select key={filter.name} value={String(params[filter.name] ?? "")} onChange={(e) => update(filter.name, e.target.value)} className="min-w-[45%] flex-1 sm:w-auto sm:min-w-40 sm:flex-none" aria-label={filter.label}>
              <option value="">{filter.label} : tous</option>
              {filter.options.map((o) => (
                <option key={o.value} value={o.value}>
                  {o.label}
                </option>
              ))}
            </Select>
          ))}
        </div>

        {isLoading ? (
          <LoadingBlock />
        ) : error ? (
          <ErrorBlock error={error} onRetry={refetch} />
        ) : !data?.items.length ? (
          <EmptyState
            icon={def.icon ?? Inbox}
            title={params.q || filterKeys.some((k) => params[k]) ? "Aucun résultat" : `Aucun(e) ${def.singular} pour l'instant`}
            description={params.q ? "Essayez d'autres mots-clés ou retirez des filtres." : undefined}
            action={canCreate && !params.q ? <Button onClick={() => navigate(`/${def.key}/new`)}><Plus className="h-4 w-4" /> Créer</Button> : undefined}
          />
        ) : (
          <div className={isFetching ? "opacity-70 transition" : "transition"}>
            {/* Mobile : une fiche par élément, toutes les colonnes visibles sans défilement horizontal. */}
            <ul className="divide-y divide-border sm:hidden">
              {data.items.map((item) => {
                const [first, ...rest] = def.columns;
                return (
                  <li key={item.id}>
                    <Link to={`/${def.key}/${item.id}`} className="block space-y-2 px-4 py-3 transition active:bg-muted">
                      <div className="text-sm">{first.render ? first.render(item) : (item[first.key] ?? "—")}</div>
                      <dl className="flex flex-wrap items-center gap-x-4 gap-y-1.5 text-xs">
                        {rest.map((column) => (
                          <div key={column.key} className="flex items-center gap-1.5">
                            <dt className="text-muted-foreground">{column.label} :</dt>
                            <dd>{column.render ? column.render(item) : (item[column.key] ?? "—")}</dd>
                          </div>
                        ))}
                      </dl>
                    </Link>
                  </li>
                );
              })}
            </ul>
            <div className="hidden sm:block">
            <Table>
              <thead>
                <tr>
                  {def.columns.map((column) => (
                    <Th key={column.key} className={column.className}>
                      {column.label}
                    </Th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {data.items.map((item) => (
                  <tr key={item.id} className="cursor-pointer transition hover:bg-muted/60" onClick={() => navigate(`/${def.key}/${item.id}`)}>
                    {def.columns.map((column, index) => (
                      <Td key={column.key} className={column.className}>
                        {index === 0 ? (
                          <Link to={`/${def.key}/${item.id}`} className="outline-none focus-visible:underline" onClick={(e) => e.stopPropagation()}>
                            {column.render ? column.render(item) : (item[column.key] ?? "—")}
                          </Link>
                        ) : column.render ? (
                          column.render(item)
                        ) : (
                          (item[column.key] ?? "—")
                        )}
                      </Td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </Table>
            </div>
            <Pagination page={data.page} pages={data.pages} total={data.total} onChange={(page) => update("page", String(page))} />
          </div>
        )}
      </Card>
    </>
  );
}
