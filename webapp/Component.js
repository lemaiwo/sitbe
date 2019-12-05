sap.ui.define(
	[
		"sap/ui/core/UIComponent"
	], 
	function(UIComponent) {
		"use strict";

		/**
		 * @name		be.fiddle.sitbe.Component
		 * @alias 		be.fiddle.sitbe.Component
		 * @memberof 	be.fiddle.sitbe
		 * @constructor
		 * @public
		 * @extends sap.ui.core.mvc.Controller
		 * @class
		 * The main component of your app. This also serves as public interface when your component is embedded in another app.<br/>
		 * Be sure to define properties and events that need to be accessible from outside, as well as public methods.<br/>
		 **/
		const Component = UIComponent.extend("be.fiddle.sitbe.Component", 
			/**@lends be.fiddle.sitbe.Component.prototype */
			{		
				metadata: {
					manifest: "json"
				},

				constructor:function(){
					UIComponent.prototype.constructor.apply(this, arguments);            
				}
			}
		);

		/**
		 * @method	init
		 * @public
		 * @instance
		 * @memberof	be.fiddle.sitbe.Component
		 * initialization of manifest and removal of the loader icon.<br/>
		 **/
		Component.prototype.init = function() {
			UIComponent.prototype.init.apply(this, arguments);

			// Remove the splash screen
			$(".loader-icon").removeClass("spinning-cog").addClass("shrinking-cog");
			$(".loader-background").fadeOut();
			$(".loader-text").fadeOut();
			window.setTimeout(function() { $("#loader").remove(); }, 400);
		};

		return Component;

	}
);
