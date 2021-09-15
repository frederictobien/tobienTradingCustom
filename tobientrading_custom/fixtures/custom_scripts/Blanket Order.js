
frappe.ui.form.on('Blanket Order', {
	shipping_address_name: function(frm) {
		// your code here
		if (frm.doc.shipping_address_name){
		    erpnext.utils.get_address_display(frm, 'shipping_address_name', 'shipping_address', true)
		}
	},
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
			})
		}
	},

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
			})
		}
	},
	taxes_and_charges: function(frm) {
		if(frm.doc.taxes_and_charges) {
			return frm.call({
				method: "erpnext.controllers.accounts_controller.get_taxes_and_charges",
				args: {
					"master_doctype": frappe.meta.get_docfield(frm.doc.doctype, "taxes_and_charges",
						frm.doc.name).options,
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
							console.log(r.message)
				// 			frm.cscript.calculate_taxes_and_totals()
						}
					}
				}
			});
		}
	},
})

frappe.ui.form.on('Blanket Order Item', {
	rate: function(frm, cdt, cdn) {
		var d = locals[cdt][cdn];
		if(d.rate) {
			var total = 0
			for (var i=0; i < cur_frm.doc.items.length;i++){
		        total += parseFloat(cur_frm.doc.items[i].rate);
		    }
		    console.log(total)
		    cur_frm.set_value("total", total)
		    cur_frm.set_value("net_total", total)
		    cur_frm.set_value("grand_total", total)
		    cur_frm.set_value("rounded_total", total)
		    cur_frm.set_value("base_total", total)
		    cur_frm.set_value("base_net_total", total)
		    cur_frm.set_value("base_grand_total", total)
		    cur_frm.refresh_fields("total");
		    cur_frm.refresh_fields("net_total");
		    cur_frm.refresh_fields("grand_total");
		    cur_frm.refresh_fields("rounded_total");
		    cur_frm.refresh_fields("base_total");
		    cur_frm.refresh_fields("base_net_total");
		    cur_frm.refresh_fields("base_grand_total");
		}
	},
	item_code: function(frm, cdt, cdn) {
		var d = locals[cdt][cdn];
		if(d.item_code) {
		    cur_frm.set_value("total_qty", cur_frm.doc.items.length)
		    cur_frm.refresh_fields("total_qty");
		}
	}
});
