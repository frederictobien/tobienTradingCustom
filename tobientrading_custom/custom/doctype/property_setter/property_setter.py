# Copyright (c) 2015, Frappe Technologies Pvt. Ltd. and Contributors
# MIT License. See license.txt

from __future__ import unicode_literals
import frappe
from frappe import _

from frappe.model.document import Document

not_allowed_fieldtype_change = ['naming_series']

class PropertySetter(Document):
	def autoname(self):
		self.name = self.doc_type + "-" \
			+ (self.field_name and (self.field_name + "-")  or "") \
			+ self.property

	def validate(self):
		self.validate_fieldtype_change()
		self.delete_property_setter()

		# clear cache
		frappe.clear_cache(doctype = self.doc_type)

	def validate_fieldtype_change(self):
		if self.field_name in not_allowed_fieldtype_change and \
			self.property == 'fieldtype':
			frappe.throw(_("Field type cannot be changed for {0}").format(self.field_name))

	def delete_property_setter(self):
		"""delete other property setters on this, if this is new"""
		if self.get('__islocal'):
			frappe.db.sql("""delete from `tabProperty Setter` where
				doctype_or_field = %(doctype_or_field)s
				and doc_type = %(doc_type)s
				and coalesce(field_name,'') = coalesce(%(field_name)s, '')
				and property = %(property)s""", self.get_valid_dict())

	def get_property_list(self, dt):
		return frappe.db.get_all('DocField',
			fields=['fieldname', 'label', 'fieldtype'],
			filters={
				'parent': dt,
				'fieldtype': ['not in', ('Section Break', 'Column Break', 'HTML', 'Read Only', 'Fold') + frappe.model.table_fields],
				'fieldname': ['!=', '']
			},
			order_by='label asc',
			as_dict=1
		)

	def get_setup_data(self):
		return {
			'doctypes': [d[0] for d in frappe.db.sql("select name from tabDocType")],
			'dt_properties': self.get_property_list('DocType'),
			'df_properties': self.get_property_list('DocField')
		}

	def get_field_ids(self):
		return frappe.db.sql("select name, fieldtype, label, fieldname from tabDocField where parent=%s", self.doc_type, as_dict = 1)

	def get_defaults(self):
		if not self.field_name:
			return frappe.db.sql("select * from `tabDocType` where name=%s", self.doc_type, as_dict = 1)[0]
		else:
			return frappe.db.sql("select * from `tabDocField` where fieldname=%s and parent=%s",
				(self.field_name, self.doc_type), as_dict = 1)[0]

	def on_update(self):
		if frappe.flags.in_patch:
			self.flags.validate_fields_for_doctype = False

		if not self.flags.ignore_validate and self.flags.validate_fields_for_doctype:
			from frappe.core.doctype.doctype.doctype import validate_fields_for_doctype
			validate_fields_for_doctype(self.doc_type)

def make_property_setter(doctype, fieldname, property, value, property_type, for_doctype = False,
		validate_fields_for_doctype=True):
	# WARNING: Ignores Permissions
	property_setter = frappe.get_doc({
		"doctype":"Property Setter",
		"doctype_or_field": for_doctype and "DocType" or "DocField",
		"doc_type": doctype,
		"field_name": fieldname,
		"property": property,
		"value": value,
		"property_type": property_type
	})
	property_setter.flags.ignore_permissions = True
	property_setter.flags.validate_fields_for_doctype = validate_fields_for_doctype
	property_setter.insert()
	return property_setter
