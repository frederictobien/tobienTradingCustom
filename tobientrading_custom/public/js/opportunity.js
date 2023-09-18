// Copyright (c) 2023, Frappe Technologies Pvt. Ltd. and Contributors
// License: GNU General Public License v3. See license.txt

frappe.ui.form.on("Opportunity", {
     refresh: function(frm) {
        render_activities_and_comments(frm);
    },
})

function render_activities_and_comments(frm) {
    frappe.call({
        method: "tobientrading_custom.tobientrading_custom.py.opportunity.get_activities_and_comments",
        args: {
            ref_docname: frm.doc.name
        },
        callback: (r) => {
			if (!r.exc) {
				cur_frm.set_df_property('custom_all_activities_html', 'options', r.message.html);
			}
        }
    });
}

