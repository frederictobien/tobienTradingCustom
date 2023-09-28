
frappe.ui.form.on('Blanket Order', {
    refresh: function(frm) {
			frappe.call({
            method: "tobientrading_custom.api.blanket_order.get_taxes_template", //dotted path to server method
            callback: function(r) {
                // code snippet
                if (r.message){
                    set_field_options("taxes_and_charges", r.message);

                }
            }
        });
	},
	shipping_address_name: function(frm) {
		// your code here
		if (frm.doc.shipping_address_name){
		    var shipping_address_display = erpnext.utils.get_address_display(frm, 'shipping_address_name', 'shipping_address', true);
		    //frm.set_value('shipping_address',shipping_address_display);
		}
	},
	shipping_address_name1: function(frm) {
		// your code here
		if (frm.doc.shipping_address_name1){
		    var shipping_address_display = erpnext.utils.get_address_display(frm, 'shipping_address_name1', 'shipping_address1', true);
		    //frm.set_value('shipping_address1',shipping_address_display);
		}
	},
	customer: function(frm){
	    var customer = frappe.get_doc("Customer",frm.doc.customer);
	    frappe.call({
                method: "frappe.client.get_value",
                args: {
                  doctype: "Customer",
                  filters: { name: frm.doc.customer },
                  fieldname: "payment_terms",
                },
                callback: function(r){
                    console.log(r);
                    frm.set_value('payment_terms_template', r.message.payment_terms);
                    frm.refresh_field('payment_terms_template');
                }
        });
	},
	supplier: function(frm){
	    var supplier = frappe.get_doc("Supplier",frm.doc.customer);
	    frappe.call({
                method: "frappe.client.get_value",
                args: {
                  doctype: "Supplier",
                  filters: { name: frm.doc.supplier },
                  fieldname: "payment_terms",
                },
                callback: function(r){
                    console.log(r);
                    frm.set_value('payment_terms_template', r.message.payment_terms);
                    frm.refresh_field('payment_terms_template');
                }
        });
	},
	/**
	payment_terms_template: function(frm) {
		if(frm.doc.payment_terms_template && frm.doc.doctype !== 'Delivery Note') {
			var posting_date = frm.doc.posting_date || frm.doc.transaction_date;
			frappe.call({
				method: "erpnext.controllers.accounts_controller.get_payment_terms",
				args: {
					terms_template: frm.doc.payment_terms_template,
					posting_date: posting_date,
					grand_total: frm.doc.rounded_total || frm.doc.grand_total,
					bill_date: frm.doc.bill_date
				},
				callback: function(r) {
					if(r.message && !r.exc) {
						frm.set_value("payment_schedule", r.message);
					}
				}
			});
		}
	},
    */
	payment_term: function(doc, cdt, cdn) {
		var row = locals[cdt][cdn];
		if(row.payment_term) {
			frappe.call({
				method: "erpnext.controllers.accounts_controller.get_payment_term_details",
				args: {
					term: row.payment_term,
					bill_date: this.frm.doc.bill_date,
					posting_date: this.frm.doc.posting_date || this.frm.doc.transaction_date,
					grand_total: this.frm.doc.rounded_total || this.frm.doc.grand_total
				},
				callback: function(r) {
					if(r.message && !r.exc) {
						for (var d in r.message) {
							frappe.model.set_value(cdt, cdn, d, r.message[d]);
						}
					}
				}
			});
		}
	},
	taxes_and_charges: function(frm) {
		if(frm.doc.taxes_and_charges) {

		    frappe.call({
                method: "frappe.client.get_value",
                args: {
                  doctype: "Purchase Taxes and Charges Template",
                  filters: { name: frm.doc.taxes_and_charges },
                  fieldname: "name",
                },
                callback: function (r) {
                  if (r.message.name) {
                    let master_doctype = "Purchase Taxes and Charges Template";
                    return frm.call({
        				method: "erpnext.controllers.accounts_controller.get_taxes_and_charges",
        				args: {
        					"master_doctype": master_doctype,
        					"master_name": frm.doc.taxes_and_charges
        				},
        				callback: function(r) {
        					if(!r.exc) {
        						if(frm.doc.shipping_rule && frm.doc.taxes) {
        							for (let tax of r.message) {
        								frm.add_child("taxes", tax);
        							}

        							refresh_field("taxes");
        						} else {
        							frm.set_value("taxes", r.message);
        				// 			frm.cscript.calculate_taxes_and_totals()
        						}
        					}
        				}
        			});
                  }
                  else{
                      let master_doctype = "Sales Taxes and Charges Template";
                      return frm.call({
        				method: "erpnext.controllers.accounts_controller.get_taxes_and_charges",
        				args: {
        					"master_doctype": master_doctype,
        					"master_name": frm.doc.taxes_and_charges
        				},
        				callback: function(r) {
        					if(!r.exc) {
        						if(frm.doc.shipping_rule && frm.doc.taxes) {
        							for (let tax of r.message) {
        								frm.add_child("taxes", tax);
        							}

        							refresh_field("taxes");
        						} else {
        							frm.set_value("taxes", r.message);
        				// 			frm.cscript.calculate_taxes_and_totals()
        						}
        					}
        				}
        			});
                  }
                },
              });
		}
	},
	currency: function(frm) {
		if(frm.doc.items.length > 0) {
			frm.refresh();
		}
	}
});

frappe.ui.form.on('Blanket Order Item', {
	rate: function(frm, cdt, cdn) {
		var d = locals[cdt][cdn];
		if(d.rate) {
			var total = d.qty * d.rate;
			frappe.model.set_value(
              cdt,
              cdn,
              "total_amount",
              total
            );

		}
	},
	qty: function(frm, cdt, cdn) {
		var d = locals[cdt][cdn];
		if(d.rate) {
			var total = d.qty * d.rate;
			frappe.model.set_value(
              cdt,
              cdn,
              "total_amount",
              total
            );

		}
	},
	total_amount: function(frm, cdt, cdn) {
		var d = locals[cdt][cdn];
		if(d.total_amount) {
			var total = 0;
			for (var i=0; i < cur_frm.doc.items.length;i++){
		        total += parseFloat(cur_frm.doc.items[i].total_amount);
		    }
		    cur_frm.set_value("total", total);
		    cur_frm.set_value("net_total", total);
		    cur_frm.set_value("grand_total", total);
		    cur_frm.set_value("rounded_total", total);
		    cur_frm.set_value("base_total", total);
		    cur_frm.set_value("base_net_total", total);
		    cur_frm.set_value("base_grand_total", total);
		    frm.refresh();
		}
	},
	item_code: function(frm, cdt, cdn) {
		var d = locals[cdt][cdn];
		if(d.item_code) {
		    cur_frm.set_value("total_qty", cur_frm.doc.items.length);
		    cur_frm.refresh_fields("total_qty");
		}
	}
});

