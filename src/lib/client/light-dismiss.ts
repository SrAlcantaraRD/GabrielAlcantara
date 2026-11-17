/**
 * Light dismiss for `<dialog closedby="any">` where the attribute is missing
 * (Safari, so far).
 *
 * The test is the pointer position, never `event.target`: the dialog is also
 * the target for its own padding and for the gaps between its children, so a
 * target check would close on a click that never left the card. Press and
 * release both have to land outside, so a drag that starts on the copy and ends
 * on the backdrop does not dismiss it.
 */

export interface LightDismissOptions {
	signal?: AbortSignal;
	/** Defaults to `dialog.close()`; a caller with an exit animation passes its own. */
	onDismiss?: () => void;
}

export function enableLightDismiss(
	dialog: HTMLDialogElement,
	{ signal, onDismiss }: LightDismissOptions = {},
): void {
	if ("closedBy" in HTMLDialogElement.prototype) return;

	const dismiss = onDismiss ?? (() => dialog.close());
	const outside = (event: PointerEvent) => {
		const rect = dialog.getBoundingClientRect();
		return (
			event.clientX < rect.left ||
			event.clientX > rect.right ||
			event.clientY < rect.top ||
			event.clientY > rect.bottom
		);
	};

	let pressedOutside = false;

	dialog.addEventListener(
		"pointerdown",
		(event) => {
			pressedOutside = outside(event);
		},
		{ signal },
	);

	dialog.addEventListener(
		"pointerup",
		(event) => {
			const dismissNow = pressedOutside && outside(event);
			pressedOutside = false;
			if (dismissNow) dismiss();
		},
		{ signal },
	);
}
