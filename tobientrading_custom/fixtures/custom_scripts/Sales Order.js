frappe.ui.form.on("Sales Order", {
    onload: function(frm) {
        if (frm.doc.name){
            $('button:contains("New Email")').on('click', function() {
               setTimeout(() => {
                   $('*[data-fieldname="subject"]').val("Your PO " + frm.doc.po_no + " (" + frm.doc.name + ")");
               },500);
            });

        }
    }
})