import Controller from "sap/ui/core/mvc/Controller";
import Fragment from "sap/ui/core/Fragment";
import Event from "sap/ui/base/Event";
import Control from "sap/ui/core/Control";
import CustomData from "sap/ui/core/CustomData";
import JSONModel from "sap/ui/model/json/JSONModel";
import Popover from "sap/m/ResponsivePopover";
import UIComponent from "sap/ui/core/UIComponent";

interface SessionData {
	name?: string;
	speaker?: string;
	description?: string;
	startdate?: string;
	enddate?: string;
	startDate?: Date;
	endDate?: Date;
	links?: Array<{ url: string }>;
}

interface YearData {
	year?: string;
	data?: {
		date?: string;
		sessions?: SessionData[];
		[key: string]: unknown;
	};
}

/**
 * @namespace be.wl.sitbe.controllers
 */
export default class Main extends Controller {

	public onInit(): void {
		const oModel = this.getOwnerComponent()!.getModel("info") as JSONModel;
		void oModel.dataLoaded().then(() => this._onInfoLoaded());
	}

	private _onInfoLoaded(): void {
		const oModel = this.getOwnerComponent()!.getModel("info") as JSONModel;
		const aYears = (oModel.getProperty("/") as YearData[]) || [];

		aYears.forEach((oYear) => {
			const aSessions = oYear?.data?.sessions;
			if (!Array.isArray(aSessions)) {
				return;
			}
			aSessions.forEach((oSession) => {
				if (oSession.startdate) {
					oSession.startDate = new Date(oSession.startdate);
				}
				if (oSession.enddate) {
					oSession.endDate = new Date(oSession.enddate);
				}
			});
		});
		oModel.refresh(true);

		this.setPath("/0");
	}

	public setPath(sPath: string): void {
		(this.byId("Detail") as Control).bindElement({
			path: sPath + "/data",
			model: "info"
		});
	}

	public onSelectYear(oEvent: Event): void {
		const oItem = oEvent.getParameter("item" as never) as Control | undefined;
		const oContext = oItem?.getBindingContext("info");
		if (oContext) {
			this.setPath(oContext.getPath());
		}
	}

	public onRegisterPress(oEvent: Event): void {
		this._openCustomHref(oEvent.getSource() as Control);
	}

	public onSubmitSessionPress(oEvent: Event): void {
		this._openCustomHref(oEvent.getSource() as Control);
	}

	private _openCustomHref(oSource: Control): void {
		const oData = (oSource.getCustomData() || []).find(
			(cd: CustomData) => cd.getKey() === "href"
		);
		const sHref = oData?.getValue() as string | undefined;
		if (sHref) {
			window.open(sHref, "_blank", "noopener");
		}
	}

	public onClickSession(oEvent: Event): void {
		const oSource = oEvent.getParameter("appointment" as never) as Control | undefined;
		const oContext = oSource?.getBindingContext("info");
		if (!oContext || !oSource) {
			return;
		}

		void Fragment.load({
			id: this.getView()!.getId(),
			name: "be.wl.sitbe.fragments.Session",
			controller: this
		}).then((oPopover) => {
			const oPop = oPopover as Popover;
			this.getView()!.addDependent(oPop);
			oPop.setBindingContext(oContext, "info");
			oPop.attachAfterClose(() => oPop.destroy());
			oPop.openBy(oSource);
		});
	}

	public formatDate(vDate: string | Date | undefined): string {
		if (!vDate) {
			return "";
		}
		const oDate = new Date(vDate as string);
		if (isNaN(oDate.getTime())) {
			return "";
		}
		return oDate.toLocaleDateString(undefined, {
			weekday: "long",
			day: "numeric",
			month: "long",
			year: "numeric"
		});
	}

	public asDate(vDate: string | Date | undefined): Date {
		if (vDate) {
			const oDate = new Date(vDate as string);
			if (!isNaN(oDate.getTime())) {
				return oDate;
			}
		}
		return new Date();
	}

	public isArrayVisible(aList: unknown): boolean {
		return Array.isArray(aList) && aList.length > 0;
	}

	public getOwnerComponent(): UIComponent {
		return super.getOwnerComponent() as UIComponent;
	}
}
