import format from 'date-fns/format';

export const SUCCESS_RESPONSE_CODE = 0;
export const buttonName = 'Add New';
type PrimitiveValue = string | number | boolean | undefined | object;
export const booleanValueGetter = (key: string) => {
  return (params: { data: { [x: string]: PrimitiveValue } }): PrimitiveValue => {
    if (!params.data) {
      return undefined;
    }
    if (key.includes('.')) {
      return key.split('.').reduce<PrimitiveValue>((acc, curr) => {
        if (acc && typeof acc === 'object' && curr in acc) {
          return (acc as Record<string, PrimitiveValue>)[curr];
        }
      }, params.data);
    }
    return params.data?.[key];
  };
};

export const handleDateTime = (key: string) => {
  return (params: { data: { [x: string]: PrimitiveValue } }): PrimitiveValue => {
    if (!params.data) {
      return undefined;
    }
    let value;
    if (key.includes('.')) {
      value = key.split('.').reduce<PrimitiveValue>((acc, curr) => {
        if (acc && typeof acc === 'object' && curr in acc) {
          return (acc as Record<string, PrimitiveValue>)[curr];
        }
      }, params.data);
    } else {
      value = params?.data?.[key];
    }
    if (value) {
      const dateValue = new Date(value as Date);
      const date = format(new Date(dateValue), 'MMM dd, yyyy HH:mm');
      return date;
    }
    return undefined;
  };
};

export const selectMenuItem = (labelName, valueName, mapval = []) => {
  return mapval
    ?.filter((item) => item)
    ?.map((item) => ({
      label: labelName ? item[labelName] : item,
      value: valueName ? item[valueName] : item,
    }));
};
// export const selectMenuItem = ({ items = [], labelKey, valueKey, mode = 'default' }: DropdownOptionsParams) => {
//   return items.filter(Boolean).map((item) => {
//     let label: any;
//     let value: any;

//     switch (mode) {
//       case 'combo':
//         label = labelKey && valueKey ? `${item[valueKey]} - ${item[labelKey]}` : item;
//         value = valueKey ? item[valueKey] : item;
//         break;

//       default:
//         label = labelKey ? item[labelKey] : item;
//         value = valueKey ? item[valueKey] : item;
//         break;
//     }

//     return { label, value };
//   });
// };

export const FilterIcon = `
  <span class="custom-filter-wrap" aria-hidden="true">
    <svg class="custom-filter-svg" xmlns="http://www.w3.org/2000/svg" width="16" height="16"
      viewBox="0 0 24 24" focusable="false" aria-hidden="true">
      <path d="M3 5h18v2H3zm2 6h14v2H5zm4 6h6v2H9z" fill="#2a4947"/>
    </svg>
  </span>
`;
