import type { ComponentType } from 'react';
import type React from 'react';

export type ChildrenProps = {
  children: React.ReactNode;
};
export type DateTypes = {
  createdAt?: string;
  updatedAt?: string;
};
export type DataObjectType = { [x: string]: unknown };
export type StepTypes = {
  value: number;
  label: string;
  icon: ComponentType<{ size?: number; className?: string }>;
}[];
export type EventProps = {
  target: {
    checked: boolean;
    name: string;
    value: string;
  };
};
export type ResetFormType = { resetForm: () => void };

type DropdownItem = Record<string, any>;
export interface DropdownOptionsParams {
  items?: DropdownItem[];
  labelKey: string | null;
  valueKey?: string | null;
  mode?: 'default' | 'combo' | 'custom';
}
export interface Row {
  [key: string]: unknown;
}
export interface ApiResponseType {
  responseCode?: string;
  responseMessage?: string;
  data: Row[];
}
