// Copyright (c) 2021, vanessa bualat and contributors
// For license information, please see license.txt

frappe.ui.form.on('Sample Lot Letter', {
	customer: function(frm) {

	    frappe.call({
                method:"tobientrading_custom.tobientrading_custom.doctype.sample_lot_letter.sample_lot_letter.auto_fetch",
                args:{"customer":frm.doc.customer},
                callback:function(r){
                    var data = r.message[0]
                    console.log(data)
                    console.log(data["address"])
                    frm.set_value("customer_adress", data["address_billing"])
                    frm.set_value("shipping_address_name", data["address_shipping"])
                    frm.set_value("contact_person", data["contact"])
                }
            });

	},

    vat: function(frm) {
        var vat = parseFloat(frm.doc.vat)/100
        var total_amount = parseFloat(frm.doc.net_total) + vat

        frm.set_value("total", total_amount)

	}
});

frappe.ui.form.on('Sample Lot Table', {
	sample_lot: function (frm, cdt, cdn) {
		var d = locals[cdt][cdn];
		var temp_total_qty = 0
        var temp_net = 0
        var vat
		for (var i=0;i < cur_frm.doc.sample_lot_table.length;i++){
		   temp_total_qty += parseInt(cur_frm.doc.sample_lot_table[i].qty);
		   temp_net += parseFloat(cur_frm.doc.sample_lot_table[i].rate);
		}
		cur_frm.set_value("total_qty", temp_total_qty)
		cur_frm.set_value("net_total", temp_net)
		cur_frm.refresh_fields("total_qty");
		cur_frm.refresh_fields("net_total");

		cur_frm.doc.vat ? vat = cur_frm.doc.vat/100 : vat = 0.00
        var total_vat = temp_net * vat
        var total_amount = temp_net + total_vat
        cur_frm.set_value("total", total_amount)
		cur_frm.refresh_fields("total");

    },

    qty: function (frm, cdt, cdn) {
		var d = locals[cdt][cdn];
		var temp_total_qty=0
		for (var i=0;i < cur_frm.doc.sample_lot_table.length;i++){
		   temp_total_qty += parseInt(cur_frm.doc.sample_lot_table[i].qty);
		}
		cur_frm.set_value("total_qty", temp_total_qty)
		cur_frm.refresh_fields("total_qty");
    },
    rate: function (frm, cdt, cdn) {
		var d = locals[cdt][cdn];
        var temp_net = 0
        var vat
		for (var i=0;i < cur_frm.doc.sample_lot_table.length;i++){
		   temp_net += parseFloat(cur_frm.doc.sample_lot_table[i].rate);
		}
		cur_frm.set_value("net_total", temp_net)
		cur_frm.refresh_fields("net_total");

        cur_frm.doc.vat ? vat = cur_frm.doc.vat/100 : vat = 0.00
        var total_vat = temp_net * vat
        var total_amount = temp_net + total_vat
        cur_frm.set_value("total", total_amount)
		cur_frm.refresh_fields("total");
    },
})
