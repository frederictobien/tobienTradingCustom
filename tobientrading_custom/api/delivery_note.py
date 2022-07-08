from __future__ import unicode_literals
import frappe

@frappe.whitelist()
def get_customer_po(so):
    customer_po = frappe.db.get_value('Sales Order', {"name": so}, "po_no")
    return customer_po