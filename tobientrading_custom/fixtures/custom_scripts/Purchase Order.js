frappe.ui.form.on("Purchase Order", {
    onload: function(frm) {
        if (frm.doc.name){
            $('button:contains("New Email")').on('click', function() {
               setTimeout(() => {
                   $('*[data-fieldname="subject"]').val(frm.doc.name);
               },500);
            });

        }
    },
    loading_address: function(frm) {
        if (frm.doc.loading_address) {
            // fetch_tax_category(frm);
        }
    },
    before_save: function(frm) {
        if (frm.doc.__islocal) {
            // fetch_tax_category(frm);
        }
    },
    refresh: function(frm) {
        setTimeout(function() {
            cur_frm.fields_dict.shipping_address.get_query = function(doc) {
                return {
                    filters: {
                        'is_shipping_address': 1
                    }
                };
                /* return {
                    query: "frappe.contacts.doctype.address.address.address_query",
                    filters: {
                        "link_doctype": "Supplier",
                        "link_name": (cur_frm.doc.supplier || null)
                    }
                }; */
            };
        }, 1000);
    }
});

function fetch_tax_category(frm) {
    frappe.call({
        "method": "frappe.client.get",
        "args": {
            "doctype": "Address",
            "name": frm.doc.loading_address
        },
        "async": false,
        "callback": function(response) {
            var address = response.message;
            cur_frm.set_value("tax_category", address.tax_category_purchase);
        }
    });
    
}
