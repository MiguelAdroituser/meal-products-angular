// import { AgingColumn } from "./agingData.interface";

// Define las condiciones de filtro para una propiedad
interface FilterCondition {
  equals?: any;
  in?: any[];
  notIn?: any[];
  lt?: any;
  lte?: any;
  gt?: any;
  gte?: any;
  ilike?: any; // 'ilike' es específico de PostgreSQL
  neq?: any;
  startsWith?: any;
  endsWith?: any;
  between?: [any, any];
  or?: any;
  and?: any;
}
interface FunctionField{
  field:any,
  function: 'SUM' | 'MAX' | 'MIN'| 'COUNT' | 'CASE'|'SUM-CASE',
  alias:string
}
interface ConditionCase {
  WHEN?: string;
  THEN?: string;
  ELSE?: string;
}
// Define los filtros aplicados a propiedades individuales
export interface PropertyFilter {
  [key: string]: string | FilterCondition;
}

export interface viewFilter {
  name?: string;
  parameters?: any;
}

// La interfaz principal para el QueryFilter
export interface QueryFilter {
  fields?: (string | FunctionField | ConditionCase)[]; // Campos específicos a seleccionar
  skip?: number; // Para la paginación
  limit?: number; // Para la paginación
  view?:viewFilter;
  where?: {
    and?: PropertyFilter[]; // Condiciones 'AND'
    or?: PropertyFilter[]; // Condiciones 'OR'
  };
  orderBy?: Record<string, 'ASC' | 'DESC'>; // Para ordenar los resultados
  leftJoin?: (string | { relation: string; where: { and?: PropertyFilter[]; or?: PropertyFilter[]; } })[]; // Ajustar para relaciones Left Join
  innerJoin?: string[]; // Para relaciones Inner Join
  groupBy?: string[],
  queryMode?:'getRawMany' | 'getManyAndCount' | 'getMany'
}

/* export interface CustomQueryFilter {
  view: {
    name: string;
    parameters: {
      type?: string;
      branchId: number;
      agingColumnOne: AgingColumn;
      agingColumnTwo: AgingColumn;
      agingColumnThree: AgingColumn;
      agingColumnFour: AgingColumn;
      agingColumnFive: { valueTwo: number }; // Only `valueTwo` present in agingColumnFive
      partnerIds?: number[]; // Optional array of partner IDs
      division?: string; // Optional division
      currencyId?: number; // Optional currency ID
      country?: string; // Optional country
      expiryStatus?: string; // Optional expiry status
      searchText?: string;
    };
  };
} */
