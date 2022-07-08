frappe.ui.form.on("Opportunity", {
    onload: function(frm) {
        if (frm.doc.name){
            $('button:contains("New Email")').on('click', function() {
               setTimeout(() => {
                   $('*[data-fieldname="subject"]').val(frm.doc.name)
               },500);
            });

        }
    }
})