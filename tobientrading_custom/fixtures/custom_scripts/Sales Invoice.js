frappe.ui.form.on("Sales Invoice", {
    onload: function(frm) {
        if (frm.doc.name){
            $('button:contains("New Email")').on('click', function() {
                frappe.call({
                    method: "tobientrading_custom.api.delivery_note.get_customer_po",
                    args: {
                        so: frm.doc.items[0]['sales_order']
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