/* global QUnit */
QUnit.config.autostart = false;

sap.ui.getCore().attachInit(function () {
	"use strict";

	sap.ui.require([
		"AR_REPORTE_RECLAMO_RASA/AR_REPORTE_RECLAMO_RASA/test/unit/AllTests"
	], function () {
		QUnit.start();
	});
});