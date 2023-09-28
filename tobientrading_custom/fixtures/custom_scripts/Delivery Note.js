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
    },
    after_save: function(frm) {
	   frappe.call({
            "method": "frappe.client.get",
            "args": {
                "doctype": "Customer",
                "name": frm.doc.customer
            },
            "async": false,
            "callback": function(response) {
                var customer = response.message;
                console.log(response);
                if(customer.customer_label_requierments == 1){
                        frappe.msgprint({
                        title: __('Label Required<br>'),
                        indicator: 'black',
                        message: __("<b>Label für die Gebinde:</b><br><div style='border-style: solid; border-color: red; border-width: 1rem; padding: 1rem;background-color: #E2B700;'>" + customer.customer_label_on_packaging_requiered_.replaceAll("\n", "<br>") + "</div>")
                    });
                }
            }
        });
        frappe.call({
            "method": "frappe.client.get",
            "args": {
                "doctype": "Customer",
                "name": frm.doc.customer
            },
            "async": false,
            "callback": function(response) {
                var customer = response.message;
                console.log(response);
                if(customer.customer_label_on_pallet_requiered == 1){
                        frappe.msgprint({
                        title: __('Label Required<br>'),
                        indicator: 'black',
                        message: __("<b>Label für die Palette:</b><br><div style='border-style: solid; border-color: red; border-width: 1rem; padding: 1rem;background-color: #E2B700;'>" + customer.customer_label_on_pallet_requiered_text.replaceAll("\n", "<br>") + "</div>")
                    });
                }
            }
        });
	},
});
