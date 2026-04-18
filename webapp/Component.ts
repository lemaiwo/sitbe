import UIComponent from "sap/ui/core/UIComponent";

/**
 * @namespace be.wl.sitbe
 */
export default class Component extends UIComponent {

	public static readonly metadata = {
		manifest: "json",
		interfaces: ["sap.ui.core.IAsyncContentCreation"]
	};

	public init(): void {
		super.init();
		this._hideSplash();
	}

	private _hideSplash(): void {
		const loader = document.getElementById("sitbe-loader");
		if (!loader) {
			return;
		}
		loader.classList.add("sitbe-loader--hidden");
		window.setTimeout(() => loader.remove(), 500);
	}
}
