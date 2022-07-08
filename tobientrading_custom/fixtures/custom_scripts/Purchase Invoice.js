frappe.ui.form.on("Purchase Invoice", {
    onload: function(frm) {
        if (frm.doc.name){
            $('button:contains("New Email")').on('click', function() {
               setTimeout(() => {
                   $('*[data-fieldname="subject"]').val(frm.doc.bill_no + " ("+frm.doc.name+")");
               },500);
            });

        }
    }
})