frappe.ui.form.on("Delivery Note", {
    onload: function(frm) {
        if (frm.doc.name){
            $('button:contains("New Email")').on('click', function() {
                frappe.call({
                    method: "tobientrading_custom.api.delivery_note.get_customer_po",
                    args: {
                        so: frm.doc.items[0]['against_sales_order']
                    },
                    callback: function(r) {
                        if(r.message && !r.exc) {
                            setTimeout(() => {
                               $('*[data-fieldname="subject"]').val("Your PO " + r.message + " (" + frm.doc.name + ")");
                           },500);
                        }
                    }
                })
            });
        }
    }
})