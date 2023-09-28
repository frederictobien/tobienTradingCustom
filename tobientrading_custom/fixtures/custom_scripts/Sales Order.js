frappe.ui.form.on("Sales Order", {
    onload: function(frm) {
        if (frm.doc.name){
            $('button:contains("New Email")').on('click', function() {
               setTimeout(() => {
                   $('*[data-fieldname="subject"]').val("Your PO " + frm.doc.po_no + " (" + frm.doc.name + ")");
               },500);
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
