sap.ui.define([
	"sap/ui/core/mvc/Controller",
	"sap/m/Button",
	"sap/m/Dialog",
	"sap/m/List",
	"sap/m/StandardListItem",
	"sap/m/Text",
	"sap/m/library",
	"sap/ui/core/IconPool",
	"sap/ui/model/json/JSONModel",
	"sap/ui/model/SimpleType",
	"sap/ui/model/ValidateException",
	"sap/ui/core/util/Export",
	"sap/ui/core/util/ExportTypeCSV"
], function (Controller, Button, Dialog, List, StandardListItem, Text, mobileLibrary, IconPool, JSONModel, SimpleType, ValidateException,
	Export, ExportTypeCSV) {
	"use strict";
	var oView, oSAPuser, t, Button, Dialog, oSelectedItem, data, a, oSelectedItem2, dealer;
	return Controller.extend("AR_REPORTE_RECLAMO_RASA.AR_REPORTE_RECLAMO_RASA.controller.App", {
		onInit: function () {
			t = this;
			oView = this.getView();
			//Sentencia para minimizar contenido
			this.getView().addStyleClass(this.getOwnerComponent().getContentDensityClass());
            var appid = this.getOwnerComponent().getManifestEntry("/sap.app/id").replaceAll(".","/");
  var appModulePath = jQuery.sap.getModulePath(appid);
			$.ajax({
				type: 'GET',
				url:appModulePath + "/services/userapi/currentUser",
				success: function (dataR, textStatus, jqXHR) {
					oSAPuser = dataR.name;
					// oSAPuser = "P001449";
					// oSAPuser = "P001442";
					t.leerUsuario(oSAPuser);
				},
				error: function (jqXHR, textStatus, errorThrown) {}
			});
			t.leerUsuario(oSAPuser);
			t.ConsultaSolicitante();
			//	t.Consulta2();
			t.ConsultaEstados();
			t.ConsultaOdata();
			t.ConsultaOdata2();
		},
		leerUsuario: function (oSAPuser) {
			var flagperfil = true;
            var appid = this.getOwnerComponent().getManifestEntry("/sap.app/id").replaceAll(".","/");
  var appModulePath = jQuery.sap.getModulePath(appid);
			var url =appModulePath + '/destinations/IDP_Nissan/service/scim/Users/' + oSAPuser;
			var company;
			//Consulta
			$.ajax({
				type: 'GET',
				url: url,
				contentType: 'application/json; charset=utf-8',
				dataType: 'json',
				async: false,
				success: function (dataR, textStatus, jqXHR) {
					if (dataR["urn:sap:cloud:scim:schemas:extension:custom:2.0:User"] === undefined) {
						var custom = "";
					} else {
						var custom = dataR["urn:sap:cloud:scim:schemas:extension:custom:2.0:User"].attributes;
					}
					for (var i = 0; i < dataR.groups.length; i++) {

						if (dataR.groups[i].value === "AR_DP_ADMINISTRADORDEALER" || dataR.groups[i].value === "AR_DP_USUARIODEALER") {
							flagperfil = false
							for (var x = 0; x < custom.length; x++) {
								if (custom[x].name === "customAttribute6") {
									company = "0000" + custom[x].value;
								}
							}
							console.log(flagperfil);
						}
					}
					console.log(flagperfil);
					if (!flagperfil) {

						oView.byId("dealer").setSelectedKey(company);
						dealer = company;
						oView.byId("dealer").setEditable(false);
						oView.byId("dealer1").setVisible(false);
						oView.byId("espacio1").setVisible(false);
						oView.byId("solicitantecolum").setVisible(false);

						//	t.ConsultaDestinatario();

						console.log("0000" + dataR.company);
					} else {

						oView.byId("dealer").setEditable(true);
						oView.byId("dealer1").setVisible(true);
						oView.byId("espacio1").setVisible(true);
						oView.byId("solicitantecolum").setVisible(true);

					}
				},
				error: function (jqXHR, textStatus, errorThrown) {

				}
			});

		},
		ConsultaOdata2: function () {
            var appid = this.getOwnerComponent().getManifestEntry("/sap.app/id").replaceAll(".","/");
            var appModulePath = jQuery.sap.getModulePath(appid);
			var UrlSolicitante =appModulePath + '/destinations/AR_DP_REP_DEST_HANA/ODATA_masterPedido.xsodata/Reclamos';

			//Consulta
			$.ajax({
				type: 'GET',
				url: UrlSolicitante,
				contentType: 'application/json; charset=utf-8',
				dataType: 'json',
				async: true,
				success: function (dataR, textStatus, jqXHR) {
					console.log(dataR);

				},
				error: function (jqXHR, textStatus, errorThrown) {
					console.log(JSON.stringify(jqXHR));
				}
			});
		},
		validarcant: function () {
			if (oView.byId("Products").getValue().toString().length >= 4) {
				t.ConsultaMaterial();
			}

		},

		APRUEBA: function () {
			var arr = [];
			var json2;
			var json = oView.getModel("Reclamos").oData;
			// json[oSelectedItem2].REMITOLEGAL;
			var id_reclamo = json[oSelectedItem2].ID_RECLAMO
			var url = '/destinations/AR_DP_REP_DEST_HANA/ODATA_masterPedido.xsodata/Reclamos(' + id_reclamo + ')';
			var obj = {
				ID_RECLAMO: json[oSelectedItem2].ID_RECLAMO,
				ID_DEALER: json[oSelectedItem2].ID_DEALER,
				FECHA: json[oSelectedItem2].FECHA,
				ENTREGA: json[oSelectedItem2].ENTREGA,
				REMITOLEGAL: json[oSelectedItem2].REMITOLEGAL,
				FECHAREMITO: json[oSelectedItem2].FECHAREMITO,
				PEDIDOWEB: json[oSelectedItem2].PEDIDOWEB,
				PEDIDODEALER: json[oSelectedItem2].PEDIDODEALER,
				TIPOPEDIDO: json[oSelectedItem2].TIPOPEDIDO,
				NROPIEZA: json[oSelectedItem2].NROPIEZA,
				DESCRIPCION: json[oSelectedItem2].DESCRIPCION,
				CANTFACTURADA: json[oSelectedItem2].CANTFACTURADA,
				CANTRECLAMADA: json[oSelectedItem2].CANTRECLAMADA,
				FACTURASAP: json[oSelectedItem2].FACTURASAP,
				FACTURALEGAL: json[oSelectedItem2].FACTURALEGAL,
				FECHAFACTURADA: json[oSelectedItem2].FECHAFACTURADA,
				ID_MOTIVO: json[oSelectedItem2].ID_MOTIVO,
				COMENTARIODEALER: json[oSelectedItem2].COMENTARIODEALER,
				COMENTARIONISSAN: oView.byId("f1").getValue(),
				ID_EDO_REC: "03",
				ID_NOTA_ENTREGA: json[oSelectedItem2].ID_NOTA_ENTREGA,
				ID_USUARIO_CREACION: json[oSelectedItem2].ID_USUARIO_CREACION,
				ID_USUARIO_GESTION: oSAPuser
			};
			json2 = JSON.stringify(obj);
            var appid = this.getOwnerComponent().getManifestEntry("/sap.app/id").replaceAll(".","/");
  var appModulePath = jQuery.sap.getModulePath(appid);
			$.ajax({
				type: 'PUT',
				url:appModulePath + url,
				contentType: 'application/json; charset=utf-8',
				dataType: 'json',
				async: true,
				data: json2,
				success: function (data, textStatus, jqXHR) {
					console.log(data);
					if (data === undefined) {
						t.cerrarPopCarga2();
						var obj = {
							codigo: "200",
							descripcion: "Reclamo Aprobado correctamente"
						};
						arr.push(obj);

						t.popSucces(arr, "Aprobado");
						t.limpieza();
						t.CerrarModificar();
					}

				},
				error: function (jqXHR, textStatus, errorThrown) {
					console.log(JSON.stringify(jqXHR));
				}
			});
		},

		Rechazo: function () {
			var arr = [];
			var json2;
			var json = oView.getModel("Reclamos").oData;
			// json[oSelectedItem2].REMITOLEGAL;
			var id_reclamo = json[oSelectedItem2].ID_RECLAMO
			var url = '/destinations/AR_DP_REP_DEST_HANA/ODATA_masterPedido.xsodata/Reclamos(' + id_reclamo + ')';
			var obj = {
				ID_RECLAMO: json[oSelectedItem2].ID_RECLAMO,
				ID_DEALER: json[oSelectedItem2].ID_DEALER,
				FECHA: json[oSelectedItem2].FECHA,
				ENTREGA: json[oSelectedItem2].ENTREGA,
				REMITOLEGAL: json[oSelectedItem2].REMITOLEGAL,
				FECHAREMITO: json[oSelectedItem2].FECHAREMITO,
				PEDIDOWEB: json[oSelectedItem2].PEDIDOWEB,
				PEDIDODEALER: json[oSelectedItem2].PEDIDODEALER,
				TIPOPEDIDO: json[oSelectedItem2].TIPOPEDIDO,
				NROPIEZA: json[oSelectedItem2].NROPIEZA,
				DESCRIPCION: json[oSelectedItem2].DESCRIPCION,
				CANTFACTURADA: json[oSelectedItem2].CANTFACTURADA,
				CANTRECLAMADA: json[oSelectedItem2].CANTRECLAMADA,
				FACTURASAP: json[oSelectedItem2].FACTURASAP,
				FACTURALEGAL: json[oSelectedItem2].FACTURALEGAL,
				FECHAFACTURADA: json[oSelectedItem2].FECHAFACTURADA,
				ID_MOTIVO: json[oSelectedItem2].ID_MOTIVO,
				COMENTARIODEALER: json[oSelectedItem2].COMENTARIODEALER,
				COMENTARIONISSAN: oView.byId("f1").getValue(),
				ID_EDO_REC: "02",
				ID_NOTA_ENTREGA: json[oSelectedItem2].ID_NOTA_ENTREGA,
				ID_USUARIO_CREACION: json[oSelectedItem2].ID_USUARIO_CREACION,
				ID_USUARIO_GESTION: oSAPuser
			};
			json2 = JSON.stringify(obj);
            var appid = this.getOwnerComponent().getManifestEntry("/sap.app/id").replaceAll(".","/");
  var appModulePath = jQuery.sap.getModulePath(appid);
			$.ajax({
				type: 'PUT',
				url:appModulePath + url,
				contentType: 'application/json; charset=utf-8',
				dataType: 'json',
				async: true,
				data: json2,
				success: function (data, textStatus, jqXHR) {
					console.log(data);
					if (data === undefined) {
						var obj = {
							codigo: "200",
							descripcion: "Reclamo Rechazado correctamente"
						};
						arr.push(obj);

						t.popError(arr, "Rechazado");
						t.limpieza();
						t.CerrarModificar();
					}
				},
				error: function (jqXHR, textStatus, errorThrown) {
					console.log(JSON.stringify(jqXHR));
				}
			});
		},
		limpieza: function () {
			oView.byId("f1").setValue();
		},
		limpiezaBusqueda: function () {

			oView.byId("Nreclamo").setValue();
			oView.byId("Factura").setValue();
			oView.byId("Entrega").setValue();
			oView.byId("FechaCreacion").setValue();
			oView.byId("cmbEstados").setSelectedKey();

		},
		GeneraNotaCredito: function () {
			var arr = [];
			var json = oView.getModel("Reclamos").oData;
			t.popCarga();
			var result = [];

			var arrn = {
				"HeaderSet": {
					"Header": {
						"Remito": json[oSelectedItem2].REMITOLEGAL,
						"Nav_Header_Nc": {
							"Nc": [{
								"Remito": json[oSelectedItem2].REMITOLEGAL,
								"Cliente": json[oSelectedItem2].ID_DEALER,
								"Motivopedido": json[oSelectedItem2].ID_MOTIVO,
								"Material": json[oSelectedItem2].NROPIEZA,
								"Cantped": json[oSelectedItem2].CANTRECLAMADA,
								"Tipo": ""
							}]
						}
					}
				}
			};
			result = JSON.stringify(arrn);
			console.log(result);
            var appid = this.getOwnerComponent().getManifestEntry("/sap.app/id").replaceAll(".","/");
            var appModulePath = jQuery.sap.getModulePath(appid);
			var url = '/destinations/AR_DP_DEST_CPI/http/AR/DealerPortal/Reclamo/CrearNotaCredito';

			$.ajax({
				type: 'POST',
				url:appModulePath + url,
				contentType: 'application/json; charset=utf-8',
				dataType: 'json',
				async: true,
				data: result,
				success: function (dataR, textStatus, jqXHR) {
					console.log(dataR);
					// 
					t.APRUEBA();

				},
				error: function (jqXHR, textStatus, errorThrown) {
					console.log(JSON.stringify(jqXHR));

					t.cerrarPopCarga2();
					var obj = {
						codigo: "200",
						descripcion: "Reclamo Rechazado correctamente"
					};
					arr.push(obj);

					t.popError(arr, "Rechazado");
				}
			});
		},

		ConsultaSolicitante: function () {

			var UrlSolicitante = '/destinations/AR_DP_REP_DEST_HANA/ODATA_masterPedido.xsodata/solicitante';
            var appid = this.getOwnerComponent().getManifestEntry("/sap.app/id").replaceAll(".","/");
            var appModulePath = jQuery.sap.getModulePath(appid);
			//Consulta
			$.ajax({
				type: 'GET',
				url:appModulePath + UrlSolicitante,
				contentType: 'application/json; charset=utf-8',
				dataType: 'json',
				async: true,
				success: function (dataR, textStatus, jqXHR) {
					console.log("cliente");
					console.log(dataR);
					var cliente = new sap.ui.model.json.JSONModel(dataR.d.results);

					oView.setModel(cliente, "cliente");
				},
				error: function (jqXHR, textStatus, errorThrown) {
					console.log(JSON.stringify(jqXHR));
				}
			});
		},
		Consulta: function () {
			var total = [];

			if ((oView.byId("FechaCreacion").getValue() === null || oView.byId("FechaCreacion").getValue() === "") && oView.byId("Nreclamo").getValue() ===
				"" && oView.byId("Factura").getValue() === "" && oView.byId("Entrega").getValue() === "") {
				var obj2 = {
					codigo: "03",
					descripcion: "Debe Seleccionar  un rango de fecha, Factura Entrega o  Nro Reclamo"
				};
				var arr2 = [];
				arr2.push(obj2);
				t.popSuccesCorreo(arr2, "ERROR");
			} else {
				var arr = [];
				var semanaEnMilisegundos = (1000 * 60 * 60 * 24 * 90);
				var hoy = new Date() - semanaEnMilisegundos;

				hoy = new Date(hoy).toISOString().slice(0, 10);
				var desde = oView.byId("FechaCreacion").getDateValue();
				var hasta = oView.byId("FechaCreacion").getSecondDateValue();
				desde = new Date(desde).toISOString().slice(0, 10);
				hasta = new Date(hasta).toISOString().slice(0, 10);
				// if (desde < hoy) {
				// 	var obj2 = {
				// 		codigo: "05",
				// 		descripcion: "El rango de busqueda no puede ser mayor a 3 meses"
				// 	};
				// 	arr.push(obj2);

				// 	t.popSuccesCorreo(arr, "ERROR");
				// } else {
				var json = [];
				var recl, fac, ent, fech, est, con, fechdes, fechast, dealer2;

				var Nreclamo = "";
				var Factura = "";
				var Entrega = "";
				var FechaCreacion = "";
				var Estado = "";
				var deal;
				console.log(dealer);
				if (dealer === undefined) {
					dealer = oView.byId("dealer").getSelectedKey();
				}
				console.log(dealer);
				Nreclamo = oView.byId("Nreclamo").getValue();
				Factura = oView.byId("Factura").getValue();
				Entrega = oView.byId("Entrega").getValue();
				FechaCreacion = oView.byId("FechaCreacion").getValue();

				var desde = oView.byId("FechaCreacion").getDateValue();
				var hasta = oView.byId("FechaCreacion").getSecondDateValue()
				desde = new Date(desde).toISOString().slice(0, 10);
				console.log(desde);
				hasta = new Date(hasta).toISOString().slice(0, 10);
				console.log(hasta);

				Estado = oView.byId("cmbEstados").getSelectedKey();
				var consulta = '/destinations/AR_DP_REP_DEST_HANA/ODATA_masterPedido.xsodata/ViewReclamos?$filter=';
				con = '%20and%20';
				recl = 'ID_RECLAMO%20eq%20' + Nreclamo;
				fac = 'FACTURASAP%20eq%20%27' + Factura + '%27';
				ent = 'ENTREGA%20eq%20%27' + Entrega + '%27';
				est = 'ID_EDO_REC%20eq%20%27' + Estado + '%27';
				deal = 'ID_DEALER%20eq%20%27' + dealer + '%27';
				dealer2 = 'ID_DEALER%20eq%20%27' + dealer + '%27';
				var fecha = 'FECHA%20ge%20datetime%27' + desde + 'T00:00:00.0000000%27%20and%20FECHA%20le%20datetime%27' + hasta +
					'T23:59:59.0000000%27';
				if (oView.byId("Nreclamo").getValue() !== "" && consulta ===
					"/destinations/AR_DP_REP_DEST_HANA/ODATA_masterPedido.xsodata/ViewReclamos?$filter=") {
					console.log("re1")
					consulta = consulta + recl;
				} else if (oView.byId("Nreclamo").getValue() !== "") {
					console.log("re2")
					consulta = consulta + con + recl;
				}
				if (oView.byId("Factura").getValue() !== "" && consulta ===
					"/destinations/AR_DP_REP_DEST_HANA/ODATA_masterPedido.xsodata/ViewReclamos?$filter=") {
					console.log("f1")
					consulta = consulta + fac;
				} else if (oView.byId("Factura").getValue() !== "") {
					console.log("f2")
					consulta = consulta + con + fac;
				}
				if (oView.byId("FechaCreacion").getValue() !== "" && consulta ===
					"/destinations/AR_DP_REP_DEST_HANA/ODATA_masterPedido.xsodata/ViewReclamos?$filter=") {
					console.log("fe1")
					consulta = consulta + fecha;
				} else if (oView.byId("FechaCreacion").getValue() !== "") {
					console.log("fe2")
					consulta = consulta + con + fecha;
				}
				if (oView.byId("Entrega").getValue() !== "" && consulta ===
					"/destinations/AR_DP_REP_DEST_HANA/ODATA_masterPedido.xsodata/ViewReclamos?$filter=") {
					console.log("E1")
					consulta = consulta + ent;
				} else if (oView.byId("Entrega").getValue() !== "") {
					console.log("E2")
					consulta = consulta + con + ent;
				}
				// if (oView.byId("Entrega").getValue() !== "") {
				// 	consulta = consulta + con + ent;
				// }
				if (dealer !== "") {
					consulta = consulta + con + deal;
				}
				if (oView.byId("cmbEstados").getSelectedKey() !== "") {
					consulta = consulta + con + est;
				}
				console.log(consulta);
                var appid = this.getOwnerComponent().getManifestEntry("/sap.app/id").replaceAll(".","/");
                var appModulePath = jQuery.sap.getModulePath(appid);
				//Consulta
				$.ajax({
					type: 'GET',
					url:appModulePath + consulta,
					contentType: 'application/json; charset=utf-8',
					dataType: 'json',
					async: true,
					success: function (dataR, textStatus, jqXHR) {
						var color, ncolor, nEstado;
						console.log(dataR);
						var json4 = oView.getModel("cliente").oData;

						for (var i = 0; i < dataR.d.results.length; i++) {
							for (var j = 0; j < json4.length; j++) {
								if (dataR.d.results[i].ID_DEALER === json4[j].SOLICITANTE) {
									var NOMBREDEALER = json4[j].NOMBRE_SOLICITANTE;
								}

							}
							if (Number(dataR.d.results[i].ID_EDO_REC) === 1) {
								color = 'sap-icon://status-critical';
								ncolor = '#ffbc05';
								nEstado = "Pendiente"
							}
							if (Number(dataR.d.results[i].ID_EDO_REC) === 2) {
								color = 'sap-icon://status-negative';
								ncolor = '#e30000'
								nEstado = "Rechazado"
							}
							if (Number(dataR.d.results[i].ID_EDO_REC, 10) === 3) {
								color = 'sap-icon://status-positive';
								ncolor = '#00c753';
								nEstado = "Aprobado"
							}
							//convertir clase
							if (dataR.d.results[i].TIPOPEDIDO === "YNCI") {
								dataR.d.results[i].TIPOPEDIDO = "Pedido Inmovilizado";
							}
							if (dataR.d.results[i].TIPOPEDIDO === "YNCS") {
								dataR.d.results[i].TIPOPEDIDO = "Pedido Stock";
							}
							if (dataR.d.results[i].TIPOPEDIDO === "YNCU") {
								dataR.d.results[i].TIPOPEDIDO = "Pedido Urgente";
							}
							if (dataR.d.results[i].TIPOPEDIDO === "YNPI") {
								dataR.d.results[i].TIPOPEDIDO = "Pedido Interno";
							}
							var json2 = {

								CANTFACTURADA: dataR.d.results[i].CANTFACTURADA,
								CANTRECLAMADA: dataR.d.results[i].CANTRECLAMADA,
								COL: dataR.d.results[i].COL,
								COMENTARIODEALER: dataR.d.results[i].COMENTARIODEALER,
								COMENTARIONISSAN: dataR.d.results[i].COMENTARIONISSAN,
								DESCRIPCION: dataR.d.results[i].DESCRIPCION,
								ENTREGA: dataR.d.results[i].ENTREGA,
								FACTURALEGAL: dataR.d.results[i].FACTURALEGAL,
								FACTURASAP: dataR.d.results[i].FACTURASAP,
								FECHA: dataR.d.results[i].FECHA,
								FECHAFACTURADA: dataR.d.results[i].FECHAFACTURADA,
								FECHAREMITO: dataR.d.results[i].FECHAREMITO,
								FECHA_CREACION: dataR.d.results[i].FECHA_CREACION,
								ID_DEALER: dataR.d.results[i].ID_DEALER,
								NOMBRE_DEALER: NOMBREDEALER,
								ID_EDO_REC: dataR.d.results[i].ID_EDO_REC,
								ID_MOTIVO: dataR.d.results[i].ID_MOTIVO,
								ID_NOTA_ENTREGA: dataR.d.results[i].ID_NOTA_ENTREGA,
								ID_RECLAMO: dataR.d.results[i].ID_RECLAMO,
								ID_USUARIO_CREACION: dataR.d.results[i].ID_USUARIO_CREACION,
								ID_USUARIO_GESTION: dataR.d.results[i].ID_USUARIO_GESTION,
								NROPIEZA: dataR.d.results[i].NROPIEZA,
								PEDIDODEALER: dataR.d.results[i].PEDIDODEALER,
								PEDIDOWEB: dataR.d.results[i].PEDIDOWEB,
								REMITOLEGAL: dataR.d.results[i].REMITOLEGAL,
								TIPOPEDIDO: dataR.d.results[i].TIPOPEDIDO,
								color: color,
								ncolor: ncolor,
								nEstado: nEstado
							};
							json.push(json2);
						}

						var Reclamos = new sap.ui.model.json.JSONModel(json);
						oView.setModel(Reclamos, "Reclamos");
						t.limpiezaBusqueda();
						dealer = undefined;
					},
					error: function (jqXHR, textStatus, errorThrown) {
						console.log(JSON.stringify(jqXHR));
					}
				});
			}
			//	}
		},
		Consulta2: function () {
            var appid = this.getOwnerComponent().getManifestEntry("/sap.app/id").replaceAll(".","/");
            var appModulePath = jQuery.sap.getModulePath(appid);
			var consulta = '/destinations/AR_DP_REP_DEST_HANA/ODATA_masterPedido.xsodata/ViewReclamos';
			$.ajax({
				type: 'GET',
				url: appModulePath + consulta,
				contentType: 'application/json; charset=utf-8',
				dataType: 'json',
				async: true,
				success: function (dataR, textStatus, jqXHR) {
					var json = dataR.d.results;
					for (var i = 0; i < json.length; i++) {
						if (json[i].FECHAREMITO !== "") {

							var dia = json[i].FECHAREMITO.substring(6, 8);
							var mes = json[i].FECHAREMITO.substring(4, 6);
							var year = json[i].FECHAREMITO.substring(0, 4);
							var fecha = dia + "/" + mes + "/" + year;
							json[i].FECHAREMITO = fecha;
						}
						if (json[i].FECHAFACTURADA !== "") {

							var dia = json[i].FECHAFACTURADA.substring(6, 8);
							var mes = json[i].FECHAFACTURADA.substring(4, 6);
							var year = json[i].FECHAFACTURADA.substring(0, 4);
							var fecha = dia + "/" + mes + "/" + year;
							json[i].FECHAFACTURADA = fecha;
						}

					}

					var Reclamos = new sap.ui.model.json.JSONModel(dataR.d.results);
					oView.setModel(Reclamos, "Reclamos");

					console.log(dataR);

				},
				error: function (jqXHR, textStatus, errorThrown) {
					console.log(JSON.stringify(jqXHR));
				}
			});

		},
		InfoDetalle: function (oEvent) {
			oSelectedItem2 = oEvent.getSource().getParent().getBindingContext("Reclamos").sPath;
			oSelectedItem2 = oSelectedItem2.replace(/\//g, "");

			t.popDetalle();

		},
		ConsultaOdata: function () {
            var appid = this.getOwnerComponent().getManifestEntry("/sap.app/id").replaceAll(".","/");
  var appModulePath = jQuery.sap.getModulePath(appid);
			var region = '/destinations/AR_DP_REP_DEST_HANA/ODATA_masterPedido.xsodata/motivosReclamos';
			console.log(region);
			//Consulta
			$.ajax({
				type: 'GET',
				url:appModulePath + region,
				contentType: 'application/json; charset=utf-8',
				dataType: 'json',
				async: true,
				success: function (dataR, textStatus, jqXHR) {

					console.log(dataR);
					var tReclamo = new sap.ui.model.json.JSONModel(dataR.d.results);
					oView.setModel(tReclamo, "reclamos");
				},
				error: function (jqXHR, textStatus, errorThrown) {
					console.log(JSON.stringify(jqXHR));
				}
			});
		},
		CargarDatos: function () {
			var json = oView.getModel("Reclamos").oData;
					var json2 = oView.getModel("reclamos").oData;
			// headerText

			oView.byId("titulo").setHeaderText("Resumen Reclamo (" + json[oSelectedItem2].ID_RECLAMO +" )    ----    Fecha Creación :"+ json[oSelectedItem2].FECHA_CREACION);

			oView.byId("a1").setText(json[oSelectedItem2].ENTREGA);
			oView.byId("a2").setText(json[oSelectedItem2].PEDIDOWEB);
			oView.byId("a3").setText(json[oSelectedItem2].NROPIEZA);
			oView.byId("a4").setText(json[oSelectedItem2].CANTRECLAMADA);
			oView.byId("a5").setSelectedKey(json[oSelectedItem2].ID_EDO_REC);
			//b
			oView.byId("b1").setText(json[oSelectedItem2].REMITOLEGAL);
			oView.byId("b2").setText(json[oSelectedItem2].PEDIDODEALER);
			oView.byId("b3").setText(json[oSelectedItem2].DESCRIPCION);
			oView.byId("b4").setText(json[oSelectedItem2].FACTURASAP);
			oView.byId("b5").setText(json[oSelectedItem2].FECHAFACTURADA);
			//c
			oView.byId("c1").setText(json[oSelectedItem2].FECHAREMITO);
			oView.byId("c2").setText(json[oSelectedItem2].TIPOPEDIDO);
			oView.byId("c3").setText(json[oSelectedItem2].CANTFACTURADA);
			oView.byId("c4").setText(json[oSelectedItem2].FACTURALEGAL);
			//***
            var appid = this.getOwnerComponent().getManifestEntry("/sap.app/id").replaceAll(".","/");
            var appModulePath = jQuery.sap.getModulePath(appid);
			var url = '/destinations/IDP_Nissan/service/scim/Users/' + json[oSelectedItem2].ID_USUARIO_CREACION;
			//Consulta
			$.ajax({
				type: 'GET',
				url:appModulePath + url,
				contentType: 'application/json; charset=utf-8',
				dataType: 'json',
				async: false,
				success: function (dataR, textStatus, jqXHR) {
					console.log(dataR)
					oView.byId("c5").setText(dataR.displayName)
				},
				error: function (jqXHR, textStatus, errorThrown) {

				}
			});
			//***
			//d
			oView.byId("d1").setValue(json[oSelectedItem2].COMENTARIODEALER);

			//e
			for (var x = 0; x < json2.length; x++) {
				if (json2[x].ID_MOTIVO === json[oSelectedItem2].ID_MOTIVO) {
					oView.byId("e1").setValue(json2[x].DESCRIPCION);
				}
			}

			//f1
			oView.byId("f1").setValue(json[oSelectedItem2].COMENTARIONISSAN);
			console.log();

			console.log(json[oSelectedItem2].ENTREGA);

		},

		ConsultaEstados: function () {

			var estados = '/destinations/AR_DP_REP_DEST_HANA/ODATA_masterPedido.xsodata/estadoRepuesto';
			console.log(estados);
            var appid = this.getOwnerComponent().getManifestEntry("/sap.app/id").replaceAll(".","/");
  var appModulePath = jQuery.sap.getModulePath(appid);
			//Consulta
			$.ajax({
				type: 'GET',
				url:appModulePath + estados,
				contentType: 'application/json; charset=utf-8',
				dataType: 'json',
				async: true,
				success: function (dataR, textStatus, jqXHR) {
					console.log(dataR);

					var estado = new sap.ui.model.json.JSONModel(dataR.d.results);
					oView.setModel(estado, "estado");

				},
				error: function (jqXHR, textStatus, errorThrown) {
					console.log(JSON.stringify(jqXHR));
				}
			});
		},
		popCarga: function () {

			var oDialog = oView.byId("indicadorCarga");
			// create dialog lazily
			if (!oDialog) {
				// create dialog via fragment factory
				oDialog = sap.ui.xmlfragment(oView.getId(), "AR_REPORTE_RECLAMO_RASA.AR_REPORTE_RECLAMO_RASA.view.PopUp", this);
				oView.addDependent(oDialog);
			}
			oDialog.open();
			//	oView.byId("textCarga").setText(titulo);
		},
		cerrarPopCarga2: function () {
			oView.byId("indicadorCarga").close();
		},
		Modificar: function (oEvent) {
			//INICIO
			oSelectedItem = oEvent.getSource().getParent();
			mod = oSelectedItem.sId.toString().substring(oSelectedItem.sId.length - 1, oSelectedItem.sId.length);
			//FIN
			//	t.cerrarpopmalos();
			var oDialog = oView.byId("GReclamo");
			// create dialog lazily
			if (!oDialog) {
				// create dialog via fragment factory
				oDialog = sap.ui.xmlfragment(oView.getId(), "AR_REPORTE_RECLAMO_RASA.AR_REPORTE_RECLAMO_RASA.view.Modificar", this);
				oView.addDependent(oDialog);
			}
			oDialog.open();
			//	oView.byId("textCarga").setText(titulo);
		},
		CerrarModificar: function () {
			oView.byId("GReclamo").close();

		},
		popSucces: function (obj, titulo) {
			var oDialog = oView.byId("dialogSucces");
			var log = new sap.ui.model.json.JSONModel(obj);
			oView.setModel(log, "Succes");
			// create dialog lazily
			if (!oDialog) {
				// create dialog via fragment factory
				oDialog = sap.ui.xmlfragment(oView.getId(), "AR_REPORTE_RECLAMO_RASA.AR_REPORTE_RECLAMO_RASA.view.Succes", this);
				oView.addDependent(oDialog);
			}
			oView.byId("dialogSucces").addStyleClass(this.getOwnerComponent().getContentDensityClass());
			oDialog.open();
			oView.byId("dialogSucces").setTitle("Succes: " + titulo);
			//	oView.byId("dialogSucces").setState("Succes");
		},
		cerrarPopSucces: function () {
			oView.byId("dialogSucces").close();

		},
		popDetalle: function () {
			var oDialog = oView.byId("Detalle");

			// create dialog lazily
			if (!oDialog) {
				// create dialog via fragment factory
				oDialog = sap.ui.xmlfragment(oView.getId(), "AR_REPORTE_RECLAMO_RASA.AR_REPORTE_RECLAMO_RASA.view.Detalle", this);
				oView.addDependent(oDialog);
			}
			oView.byId("Detalle").addStyleClass(this.getOwnerComponent().getContentDensityClass());
			oDialog.open();
			t.CargarDatos();

		},
		cerrarpopDetalle: function () {
			oView.byId("Detalle").close();

		},
		popError: function (obj, titulo) {
			var log = new sap.ui.model.json.JSONModel(obj);
			oView.setModel(log, "error");
			var oDialog = oView.byId("dialogError");
			// create dialog lazily
			if (!oDialog) {
				// create dialog via fragment factory
				oDialog = sap.ui.xmlfragment(oView.getId(), "AR_REPORTE_RECLAMO_RASA.AR_REPORTE_RECLAMO_RASA.view.Error", this);
				oView.addDependent(oDialog);
			}
			oView.byId("dialogError").addStyleClass(this.getOwnerComponent().getContentDensityClass());
			oDialog.open();
			oView.byId("dialogError").setTitle("Error: " + titulo);
			//	oView.byId("dialogError").setState("Error");
		},
		cerrarPopError: function () {
			oView.byId("dialogError").close();

		},
		//////*****************************correo********

		EnvioCorreo: function (evt) {

			var oDialog = oView.byId("EnvioCorreo");
			// create dialog lazily
			if (!oDialog) {
				// create dialog via fragment factory
				oDialog = sap.ui.xmlfragment(oView.getId(), "AR_REPORTE_RECLAMO_RASA.AR_REPORTE_RECLAMO_RASA.view.Correo", this);
				oView.addDependent(oDialog);
			}
			oDialog.open();

		},
		cerrarEnvioCorreo: function () {
			//	t.limpiezacorreo();
			oView.byId("EnvioCorreo").close();
		},

		estructura: function () {
			var json = oView.getModel("Reclamos").oData;
			console.log(json.length);

			//	var solicitante = oUsuariosap;
			var datos = "";
			var titulo =
				"<table><tr><td class= subhead>REPORTE -<b>  Reclamo </b><p></td></tr><p><tr><td class= h1>  Desde el portal de Dealer Portal," +
				"se Envia el reporte de Reclamo  " +
				" :  <p> Los Materiales son :<p> ";
			var final = "</tr></table><p>Saludos <p> Dealer Portal Argentina </td> </tr> </table>";
			var cuerpo =
				"<table><tr><th>Nro Reclamo</th><th>ENTREGA</th><th>REMITO LEGAL</th><th>FECHA REMITO</th><th>PEDIDO WEB</th><th>PEDIDO DEALER</th><th>TIPO PEDIDO</th><th>Material</th><th>DESCRIPCION MATERIAL</th></th><th>CANTIDAD FACTURADA</th><th>CANTIDAD RECLAMADA</th><th>FACTURA SAP</th><th>ESTADO RECLAMO</th>";
			for (var i = 0; i < json.length; i++) {
				var dato = "<tr><td>" + json[i].ID_RECLAMO + "</td><td>" + json[i].ENTREGA + "</td><td>" + json[i].REMITOLEGAL + "</td><td>" +
					json[i].FECHAREMITO + "</td><td>" +
					json[i].PEDIDOWEB + "</td><td>" + json[i].PEDIDODEALER + "</td><td>" + json[i].TIPOPEDIDO + "</td><td>" + json[i]
					.NROPIEZA + "</td><td>" + json[i].DESCRIPCION + "</td><td>" + json[i].CANTFACTURADA + "</td><td>  " + json[i].CANTRECLAMADA +
					"</td><td> " + json[i].FACTURASAP + "</td><td> " + json[i].nEstado + "</td></tr> ";
				datos = datos + dato;
			}
			//	var datos = datos + dato
			var contexto = titulo + cuerpo + datos + final;
			console.log(contexto);
			t.envio(contexto);
		},
		envio: function (contexto) {
			t.popCarga();
			var arr = [];
			var json = {
				"root": {
					"strmailto": oView.byId("mail").getValue(),
					"strmailcc": "",
					"strsubject": oView.byId("descrpcion").getValue(),
					"strbody": contexto
				}
			};
			var arrjson = JSON.stringify(json);
            var appid = this.getOwnerComponent().getManifestEntry("/sap.app/id").replaceAll(".","/");
  var appModulePath = jQuery.sap.getModulePath(appid);
			$.ajax({
				type: 'POST',
				url:appModulePath + '/destinations/AR_DP_DEST_CPI/http/AR/DealerPortal/Mail',
				contentType: 'application/json; charset=utf-8',
				dataType: 'json',
				async: true,
				data: arrjson,
				success: function (dataR, textStatus, jqXHR) {

				},
				error: function (jqXHR, textStatus, errorThrown) {

					t.cerrarPopCarga2();

					var obj2 = {
						codigo: "200",
						descripcion: "Correo enviado exitosamente"
					};
					var arr2 = [];
					arr2.push(obj2);
					t.popSuccesCorreo(arr2, "Pedido Creado Exitosamente");
					oView.byId("mail").setValue();
					oView.byId("descrpcion").setValue();
				}
			});
			//	codigoeliminar = "";
		},
		popSuccesCorreo: function (obj, titulo) {
			var oDialog = oView.byId("SuccesCorreo");
			var log = new sap.ui.model.json.JSONModel(obj);
			oView.setModel(log, "Succes");
			// create dialog lazily
			if (!oDialog) {
				// create dialog via fragment factory
				oDialog = sap.ui.xmlfragment(oView.getId(), "AR_REPORTE_RECLAMO_RASA.AR_REPORTE_RECLAMO_RASA.view.SuccesCorreo", this); //aqui se debe cambiar ar_dp_rep
				oView.addDependent(oDialog);
			}
			oView.byId("SuccesCorreo").addStyleClass(this.getOwnerComponent().getContentDensityClass());
			oDialog.open();
			oView.byId("SuccesCorreo").setTitle("Success: " + titulo);
			//	oView.byId("dialogSucces").setState("Succes");
		},
		cerrarPopSuccesCorreo: function () {
			oView.byId("SuccesCorreo").close();
			//	t.limpiezacorreo();
			t.cerrarEnvioCorreo();
		},

		//***********************fin correo
		downloadExcel: sap.m.Table.prototype.exportData || function () {
			var oModel = oView.getModel("Reclamos");
			var IDRECALMO = {
				name: "ID RECALMO",
				template: {
					content: "{ID_RECLAMO}"
				}
			};
			var ENTREGA = {
				name: "ENTREGA",
				template: {
					content: "{ENTREGA}"
				}
			};
			var REMITOLEGAL = {
				name: "REMITO LEGAL",
				template: {
					content: "{REMITOLEGAL}"
				}
			};
			var FECHAREMITO = {
				name: "FECHA REMITO",
				template: {
					content: "{FECHAREMITO}"
				}
			};
			var PEDIDOWEB = {
				name: "PEDIDO WEB",
				template: {
					content: "{PEDIDOWEB}"
				}
			};
			var PEDIDODEALER = {
				name: "PEDIDO DEALER",
				template: {
					content: "{PEDIDODEALER}"
				}
			};
			var TIPOPEDIDO = {
				name: "TIPO PEDIDO",
				template: {
					content: "{TIPOPEDIDO}"
				}
			};
			var NROPIEZA = {
				name: "MATERIAL",
				template: {
					content: "{NROPIEZA}"
				}
			};
			var DESCRIPCION = {
				name: "DESCRIPCIÓN MATERIAL",
				template: {
					content: "{DESCRIPCION}"
				}
			};
			var CANTFACTURADA = {
				name: "CANTIDAD FACTURADA ",
				template: {
					content: "{CANTFACTURADA}"
				}
			};
			var CANTRECLAMADA = {
				name: "CANTIDAD RECLAMADA",
				template: {
					content: "{CANTRECLAMADA}"
				}
			};
			var FACTURASAP = {
				name: "FACTURASAP",
				template: {
					content: "{FACTURASAP}"
				}
			};
			var USUARIOSAP = {
				name: "Usuario Creación",
				template: {
					content: "{ID_USUARIO_CREACION}"
				}
			};
			var ESTADO = {
				name: "ESTADO",
				template: {
					content: "{nEstado}"
				}
			};
			var oExport = new Export({

				exportType: new ExportTypeCSV({
					fileExtension: "csv",
					separatorChar: ";"
				}),

				models: oModel,

				rows: {
					path: "/"
				},
				columns: [
					IDRECALMO,
					ENTREGA,
					REMITOLEGAL,
					FECHAREMITO,
					PEDIDOWEB,
					PEDIDODEALER,
					TIPOPEDIDO,
					NROPIEZA,
					DESCRIPCION,
					CANTFACTURADA,
					CANTRECLAMADA,
					FACTURASAP,
					USUARIOSAP,
					ESTADO

				]
			});
			oExport.saveFile("Listado Reclamo").catch(function (oError) {

			}).then(function () {
				oExport.destroy();
				console.log("esto es una maravilla");
			});

		},
		onSalir: function () {
			var oCrossAppNavigator = sap.ushell.Container.getService("CrossApplicationNavigation");
			oCrossAppNavigator.toExternal({
				target: {
					shellHash: "#"
				}
			});
		},
	});
});