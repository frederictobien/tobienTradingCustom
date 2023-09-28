frappe.ui.form.on("Sales Invoice", {
    before_save: function(frm) {
        apply_revenue_accounts(frm);
    },
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
                });
            });
        }
    }
});

function apply_revenue_accounts(frm) {
    // apply revenue accounts
    var items = frm.doc.items;
    items.forEach(function (item) {
        if (item.income_account.startsWith("3200")) {
            if (frm.doc.debit_to.startsWith("1104")) {
                item.income_account = "3201 - Handelserlöse CHF - TTG";
            } else if (frm.doc.debit_to.startsWith("1105")) {
                item.income_account = "3202 - Handelserlöse USD - TTG";
            }
        }
    });
}
