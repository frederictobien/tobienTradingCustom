# -*- coding: utf-8 -*-
# Copyright (c) 2023, libracore and contributors
# For license information, please see license.txt

from __future__ import unicode_literals
import frappe
import json

@frappe.whitelist()
def apply_origins_to_variants(template_item_code, origins):
    if type(origins) == str:
        origins = json.loads(origins)
        
    items = frappe.get_all("Item", filters={'variant_of': template_item_code}, fields=['name'])
    
    for i in items:
        item = frappe.get_doc("Item", i['name'])
        item.origins = []
        for o in origins:
            item.append("origins", {'country_of_origin': o})
        item.save()
        
    return
    
