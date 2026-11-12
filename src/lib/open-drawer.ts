export type DrawerRequest =
	| { kind: "project"; id: string; origin?: Element | null }
	| { kind: "list"; label: string; ids: string[]; origin?: Element | null };

export function openDrawer(request: DrawerRequest): void {
	window.dispatchEvent(new CustomEvent<DrawerRequest>("cv:open", { detail: request }));
}
