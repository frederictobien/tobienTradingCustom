frappe.ui.form.on('Technical Data Sheet', {
	product_no: function(frm) {
        frappe.model.with_doc("Item", frm.doc.product_no, function() {
            var tabletransfer= frappe.model.get_doc("Item", frm.doc.product_no)
            $.each(tabletransfer.origins, function(index, row){
                var d = frm.add_child("origins");
                d.country_of_origin = row.country_of_origin;
                frm.refresh_field("origins");
            });
        });
    }
})
