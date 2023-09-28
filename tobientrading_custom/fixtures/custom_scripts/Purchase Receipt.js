frappe.ui.form.on("Purchase Receipt", {
    onload: function(frm) {
        if (frm.doc.name){
            $('button:contains("New Email")').on('click', function() {
               setTimeout(() => {
                   $('*[data-fieldname="subject"]').val(frm.doc.name)
               },500);
            });

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
            };
        }, 1000);
    }
});
