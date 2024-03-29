# -*- coding: utf-8 -*-
# Copyright (c) 2021, vanessa bualat and contributors
# For license information, please see license.txt

from __future__ import unicode_literals
# import frappe
from frappe.model.document import Document
import frappe

class SampleLotLetter(Document):
	pass


@frappe.whitelist()
def auto_fetch(customer):
    data = []
    address_name_shipping = ""
    address_name_billing = ""
    eori_shipping = None
    eori_billing = None
    address = frappe.db.get_list('Dynamic Link',
                              {"link_doctype": "Customer","parenttype": "Address","link_name": customer}, ["parent"])



    for i in address:
        address_type = frappe.db.get_value('Address', {"name": i["parent"]}, ["address_type", "eori_no"], as_dict=1)
        if address_type['address_type'] == "Shipping" or address_type == "Warehouse":
            address_name_shipping = i["parent"]
            eori_shipping = address_type['eori_no']
        elif address_type['address_type'] == "Billing":
            address_name_billing = i["parent"]
            eori_billing = address_type['eori_no']
        else:
            pass


    contact = frappe.db.get_value('Dynamic Link',
                                       {"link_doctype": "Customer", "parenttype": "Contact", "link_name": customer},
                                       ["parent"])

    data.append({"address_shipping": address_name_shipping if address_name_shipping else None, "contact": contact,
                 "address_billing": address_name_billing if address_name_billing else None,
                 "eori_no": eori_billing if eori_billing else eori_shipping})

    return data
