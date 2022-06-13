from __future__ import unicode_literals
import frappe

@frappe.whitelist()
def get_taxes_template():
    return frappe.db.sql("""Select name from `tabSales Taxes and Charges Template` 
        UNION SELECT name FROM `tabPurchase Taxes and Charges Template`""")