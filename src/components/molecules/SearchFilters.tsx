import type { ProductFilters } from '../../types/product';
import { Button } from '../atoms/Button';
import { SelectInput } from '../atoms/SelectInput';
import { TextInput } from '../atoms/TextInput';

interface SearchFiltersProps {
  filters: ProductFilters;
  categories: string[];
  onChange: (filters: ProductFilters) => void;
  onClear: () => void;
}

export function SearchFilters({ filters, categories, onChange, onClear }: SearchFiltersProps) {
  return (
    <div className="lm-panel row g-2 align-items-end mx-0 mb-3">
      <div className="col-12 col-md-5">
        <label htmlFor="filtro-texto" className="form-label small fw-semibold mb-1">Buscar</label>
        <TextInput
          id="filtro-texto"
          type="search"
          placeholder="Código, nombre, marca o subcategoría"
          value={filters.texto}
          onChange={(texto) => onChange({ ...filters, texto })}
        />
      </div>
      <div className="col-12 col-sm-6 col-md-3">
        <label htmlFor="filtro-categoria" className="form-label small fw-semibold mb-1">Categoría</label>
        <SelectInput
          id="filtro-categoria"
          placeholder="Todas las categorías"
          options={categories}
          value={filters.categoria}
          onChange={(categoria) => onChange({ ...filters, categoria })}
        />
      </div>
      <div className="col-12 col-sm-6 col-md-2">
        <div className="form-check">
          <input
            id="filtro-stock-bajo"
            type="checkbox"
            className="form-check-input"
            checked={filters.soloStockBajo}
            onChange={(e) => onChange({ ...filters, soloStockBajo: e.target.checked })}
          />
          <label htmlFor="filtro-stock-bajo" className="form-check-label">Solo stock bajo</label>
        </div>
      </div>
      <div className="col-12 col-md-2 d-grid">
        <Button variant="outline-secondary" onClick={onClear}>Limpiar filtros</Button>
      </div>
    </div>
  );
}
