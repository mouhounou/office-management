import { useState } from "react";

import { ImageUpload } from "@/components/ImageUpload";
import { Field, Input, Select, Switch, Textarea } from "@/components/ui/primitives";
import type { AnyRecord, FieldErrors } from "@/lib/api";
import type { FieldDef } from "@/lib/resources";
import { cn, toDateInput } from "@/lib/utils";

type Values = Record<string, unknown>;

/** Valeurs du formulaire à partir d'un élément existant (ou des défauts). */
function initialValues(fields: FieldDef[], item?: AnyRecord | null): Values {
  return Object.fromEntries(
    fields.map((field) => {
      const raw = item?.[field.name];
      if (field.type === "boolean") return [field.name, raw ?? field.defaultValue ?? false];
      if (field.type === "date") return [field.name, toDateInput(raw)];
      if (field.type === "lines") return [field.name, Array.isArray(raw) ? raw.join("\n") : (raw ?? "")];
      if (field.type === "number") return [field.name, raw ?? field.defaultValue ?? ""];
      return [field.name, raw ?? field.defaultValue ?? ""];
    }),
  );
}

/** Corps de requête : dates vides → null, nombres convertis, champs facultatifs omis. */
function toPayload(fields: FieldDef[], values: Values) {
  const payload: Values = {};
  for (const field of fields) {
    const value = values[field.name];
    if (field.omitIfEmpty && (value === "" || value == null)) continue;
    if (field.type === "date") payload[field.name] = value || null;
    else if (field.type === "number") payload[field.name] = value === "" ? undefined : Number(value);
    else payload[field.name] = value;
  }
  return payload;
}

export function ResourceForm({
  fields,
  item,
  errors = {},
  readOnly,
  onSubmit,
  formId,
}: {
  fields: FieldDef[];
  item?: AnyRecord | null;
  errors?: FieldErrors;
  readOnly?: boolean;
  onSubmit: (payload: Values) => void;
  formId: string;
}) {
  const [values, setValues] = useState<Values>(() => initialValues(fields, item));
  const set = (name: string, value: unknown) => setValues((prev) => ({ ...prev, [name]: value }));

  return (
    <form
      id={formId}
      className="grid gap-5 sm:grid-cols-2"
      onSubmit={(event) => {
        event.preventDefault();
        onSubmit(toPayload(fields, values));
      }}
    >
      {fields.map((field) => {
        const id = `${formId}-${field.name}`;
        const value = values[field.name];
        const error = errors[field.name];
        const common = { id, disabled: readOnly, "aria-invalid": Boolean(error) };

        if (field.type === "boolean") {
          return (
            <div key={field.name} className="flex items-center sm:col-span-2">
              <Switch checked={Boolean(value)} onChange={(v) => set(field.name, v)} label={field.label} disabled={readOnly} />
            </div>
          );
        }

        let control: React.ReactNode;
        switch (field.type) {
          case "textarea":
          case "lines":
            control = (
              <Textarea {...common} rows={field.rows ?? 4} value={String(value ?? "")} required={field.required} onChange={(e) => set(field.name, e.target.value)} />
            );
            break;
          case "select":
            control = (
              <Select {...common} value={String(value ?? "")} required={field.required} onChange={(e) => set(field.name, e.target.value)}>
                <option value="">— Choisir —</option>
                {field.options?.map((o) => (
                  <option key={o.value} value={o.value}>
                    {o.label}
                  </option>
                ))}
              </Select>
            );
            break;
          case "image":
            control = <ImageUpload value={String(value ?? "")} onChange={(url) => set(field.name, url)} disabled={readOnly} />;
            break;
          default:
            control = (
              <Input
                {...common}
                type={field.type === "email" ? "email" : field.type === "date" ? "date" : field.type === "number" ? "number" : "text"}
                value={String(value ?? "")}
                required={field.required}
                onChange={(e) => set(field.name, e.target.value)}
              />
            );
        }

        return (
          <Field key={field.name} label={field.label} htmlFor={id} required={field.required} error={error} hint={field.hint} className={cn(field.full && "sm:col-span-2")}>
            {control}
          </Field>
        );
      })}
    </form>
  );
}
