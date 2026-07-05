import { create } from 'zustand';

export const useLayout = create((set) => ({
    breadcrumbs: [],
    setBreadcrumbs: (breadcrumbs) => set({ breadcrumbs })
}));