// /components/StatePicker.tsx
import * as React from "react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

// list of objects with name values for all Brazilian states (value is abreviation)
const BRAZIL_STATES = [
    { name: "Acre", uf: "AC" },
    { name: "Alagoas", uf: "AL" },
    { name: "Amapá", uf: "AP" },
    { name: "Amazonas", uf: "AM" },
    { name: "Bahia", uf: "BA" },
    { name: "Ceará", uf: "CE" },
    { name: "Distrito Federal", uf: "DF" },
    { name: "Espírito Santo", uf: "ES" },
    { name: "Goiás", uf: "GO" },
    { name: "Maranhão", uf: "MA" },
    { name: "Mato Grosso", uf: "MT" },
    { name: "Mato Grosso do Sul", uf: "MS" },
    { name: "Minas Gerais", uf: "MG" },
    { name: "Pará", uf: "PA" },
    { name: "Paraíba", uf: "PB" },
    { name: "Paraná", uf: "PR" },
    { name: "Pernambuco", uf: "PE" },
    { name: "Piauí", uf: "PI" },
    { name: "Rio de Janeiro", uf: "RJ" },
    { name: "Rio Grande do Norte", uf: "RN" },
    { name: "Rio Grande do Sul", uf: "RS" },
    { name: "Rondônia", uf: "RO" },
    { name: "Roraima", uf: "RR" },
    { name: "Santa Catarina", uf: "SC" },
    { name: "São Paulo", uf: "SP" },
    { name: "Sergipe", uf: "SE" },
    { name: "Tocantins", uf: "TO" },
];

export default function StatePicker({
  value,
  onChange,
  placeholder = "Selecione o estado",
  disabled,
  id,
  name,
}) {
  return (
    <Select value={value} onValueChange={onChange} disabled={disabled} name={name}>
      <SelectTrigger id={id}>
        <SelectValue placeholder={placeholder} />
      </SelectTrigger>
      <SelectContent>
        {BRAZIL_STATES.map((state) => (
          <SelectItem key={`state-picker-${state.uf}`} value={state.uf}>
            {state.name} ({state.uf})
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
}
