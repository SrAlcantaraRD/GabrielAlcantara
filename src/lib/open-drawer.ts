export type DrawerRequest =
	| { kind: "project"; id: string }
	| { kind: "list"; label: string; ids: string[] };

export function openDrawer(request: DrawerRequest): void {
	window.dispatchEvent(new CustomEvent<DrawerRequest>("cv:open", { detail: request }));
}
