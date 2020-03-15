sap.ui.define(
	[
		"sap/ui/core/mvc/Controller",
		"sap/ui/core/Fragment"
	],
	function (Controller, Fragment) {
		/**
		 * @name	be.fiddle.sitbe.controllers.Main
		 * @alias 	be.fiddle.sitbe.controllers.Main
		 * @memberof be.fiddle.sitbe.controllers
		 * @constructor
		 * @public
		 * @extends sap.ui.core.mvc.Controller
		 * @class
		 * 
		 **/
		const Main = Controller.extend("be.fiddle.sitbe.controllers.Main",
			/** @lends be.fiddle.sitbe.controller.Main.prototype */
			{

			}
		);

		/**
		 * 
		 * @method onInit
		 * @public
		 * @instance
		 * @memberof be.fiddle.sitbe.controllers.Main
		 */
		Main.prototype.onInit = function(){
		};

		/**
		 * 
		 * @method onAfterRendering
		 * @public
		 * @instance
		 * @memberof be.fiddle.sitbe.controllers.Main
		 * @param {event} event 
		 */
		Main.prototype.onAfterRendering = function(event){
			this.getView().getModel("info").attachRequestCompleted({}, this.updateSessionDates, this );
		};

		/**
		 * 
		 * @method updateSessionDates
		 * @public
		 * @instance
		 * @memberof be.fiddle.sitbe.controllers.Main
		 * @param {event} event 
		 */
		Main.prototype.updateSessionDates = function(event){
			this.setPath( "/0" );

			//convert the json dates, because the calendar element is being a bitch
			let sessions = this.getView().getModel("info").getProperty("/sessions");
			sessions && sessions.forEach(function(session){
				session.startDate = new Date(session.startdate);
				session.endDate = new Date(session.enddate);
			});

			this.getView().getModel("info").setProperty("/sessions",sessions);
		};
		
		/**
		 * 
		 * @method onClickSession
		 * @public
		 * @instance
		 * @memberof be.fiddle.sitbe.controllers.Main
		 * @param {event} event 
		 */
		Main.prototype.onClickSession = function(event){
			//get the bindingcontext of the session
			let source = event.getParameter("appointment"); //using source variable for reuse later, since the event variable is binned after event cycle
			let context = source.getBindingContext("info");
			
			if(context){
				//instantiate the fragment:
				Fragment.load({name:"be.fiddle.sitbe.fragments.Session"}).then( function( popover ){
					//attach the bindingcontext to the fragment
					this.getView().addDependent(popover);
					popover.setBindingContext(context, "info"); //keep the same model name
					popover.attachAfterClose(function(event){ //make sure the popover is destroyed when it closes
						popover.destroy();
					});
					popover.openBy(source);
				}.bind(this));
			}
		};

		/**
		 * 
		 * @method onSelectYear
		 * @public
		 * @instance
		 * @memberof be.fiddle.sitbe.controllers.Main
		 * @param {event} event 
		 */
		Main.prototype.onSelectYear = function(event){
			//use the binding of the selected item as the binding for the objectpage
			let selectedContext = event.getParameter("selectedItem").getBindingContext("info");
			this.setPath(selectedContext.getPath() );
		};

		/**
		 * 
		 * @method setPath
		 * @public
		 * @instance
		 * @memberof be.fiddle.sitbe.controllers.Main
		 * @param {string} path - instance path 
		 */
		Main.prototype.setPath = function(path){
			let objectPage = this.getView().byId("Detail");
			//use the binding of the selected item as the binding for the objectpage
			objectPage.bindElement({path:path + "/data", model:"info"}); 

			//and change the binding for the participant service:
			this.getView().bindElement({
				path: 'participants>/Events(' + this.getOwnerComponent().getModel("info").getProperty(path + "/data/eventId") + ')',
				parameters:{
					expand:'Participants'
				}
			});
		};

		/**
		 * 
		 * @method formatDate
		 * @public
		 * @instance
		 * @memberof be.fiddle.sitbe.controllers.Main
		 * @param {string|date} date -  
		 * @return {string} readable date format
		 */
		Main.prototype.formatDate = function(date){
			let newDate = new Date( date );
			if (newDate){
				return newDate.toDateString();
			}
			return "Error parsing date";
		};

		/**
		 * 
		 * @method asDate
		 * @public
		 * @instance
		 * @memberof be.fiddle.sitbe.controllers.Main
		 * @param {string} date -  date in text form. will be interpreted
		 * @return {Date} converted date ojbect
		 */
		Main.prototype.asDate = function(date){
			if (date){
				let newDate = new Date( date );
				if (newDate){
					return newDate;
				}
			}
			return new Date();
		};

		/**
		 * 
		 * @method isArrayVisible
		 * @public
		 * @instance
		 * @memberof be.fiddle.sitbe.controllers.Main
		 * @param {any} list -  an object that could be an array or not
		 * @return {boolean} is it an array, and does it hold elements?
		 */
		Main.prototype.isArrayVisible = function(list){
			if ( list instanceof Array && list.length > 0) return true;
			return false;
		};

		return Main;
	}
);
