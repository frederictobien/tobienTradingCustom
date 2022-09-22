frappe.ui.form.on("Purchase Invoice", {
    onload: function(frm) {
        if (frm.doc.name){
            $('button:contains("New Email")').on('click', function() {
               setTimeout(() => {
                   $('*[data-fieldname="subject"]').val(frm.doc.bill_no + " ("+frm.doc.name+")");
               },500);
            });

        }
    },
    refresh: function(frm) {
        if (frm.doc.items) {
            check_fetch_delivery_dates(frm);
        }
    }
});

function check_fetch_delivery_dates(frm) {
    // loop through items
    for (var i = 0; i < frm.doc.items.length; i++) {
        // check if there is a purchase receipt and no delivery date
        if ((frm.doc.items[i].purchase_receipt) && (!frm.doc.items[i].delivery_date)) {
            // fetch delivery date from purchase receipt
            frappe.call({
                "method": "frappe.client.get",
                "args": {
                    "doctype": "Purchase Receipt",
                    "name": frm.doc.items[i].purchase_receipt
                },
                "async": false,
                "callback": function(response) {
                    var purchase_receipt = response.message;
                    if (purchase_receipt) {
                        frappe.model.set_value(cur_frm.doc.items[i].doctype, cur_frm.doc.items[i].name, "delivery_date", purchase_receipt.posting_date);
                    } 
                }
            });
        }
    }
}
