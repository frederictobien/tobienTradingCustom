# -*- coding: utf-8 -*-
# Copyright (c) 2023, libracore and contributors
# For license information, please see license.txt

from __future__ import unicode_literals
import frappe

@frappe.whitelist()
def get_activities_and_comments(ref_docname):
    activities = get_activities(ref_docname)
    
    html = frappe.render_template("tobientrading_custom/templates/activities_and_comments_template.html", {'activities': activities})
    
    return {"html": html, "activities": activities}

def get_activities(opportunity):
    sql_query = """
        SELECT * 
        FROM (
            SELECT
                "Event" AS `type", 
                `tabEvent`.`name` AS `name`,
                `tabEvent`.`subject` AS `subject`,
                `tabEvent`.`event_category` AS `event_category`,
                `tabEvent`.`starts_on` AS `starts_on`,
                `tabEvent`.`ends_on` AS `ends_on`,
                `tabUser`.`full_name` AS `employee_name`,
                `tabEvent`.`description` AS `description`,
                `tabEvent`.`creation` AS `creation`
            FROM `tabEvent`
            LEFT JOIN `tabEvent Participants` ON `tabEvent`.`name` = `tabEvent Participants`.`parent`
            LEFT JOIN `tabUser` ON `tabUser`.`owner` = `tabUser`.`name`
            WHERE `tabEvent Participants`.`reference_doctype` = 'Opportunity' 
              AND  `tabEvent Participants`.`reference_docname` = '{opportunity}' 
              AND  `tabEvent`.`status` ='Open' 
            UNION SELECT 
                "Comment" AS `type", 
                `tabComment`.`name` AS `name`,
                "" AS `subject`,
                NULL AS `event_category`,
                NULL AS `starts_on`,
                NULL AS `ends_on`,
                `tabUser`.`full_name` AS `employee_name`,
                `tabComment`.`content` AS `description`,
                `tabComment`.`creation` AS `creation`
            FROM `tabComment`
            LEFT JOIN `tabUser` ON `tabComment`.`comment_email` = `tabUser`.`name`
            WHERE `tabComment`.`reference_doctype` = 'Opportunity'
              AND  `tabComment`.`comment_type` = 'Comment' 
              AND  `tabComment`.`reference_name` = '{opportunity}'
            UNION SELECT 
                "Note" AS `type", 
                `tabCRM Note`.`name` AS `name`,
                "" AS `subject`,
                NULL AS `event_category`,
                NULL AS `starts_on`,
                NULL AS `ends_on`,
                `tabUser`.`full_name` AS `employee_name`,
                `tabCRM Note`.`note` AS `description`,
                `tabCRM Note`.`added_on` AS `creation`
            FROM `tabCRM Note`
            LEFT JOIN `tabUser` ON `tabCRM Note`.`owner` = `tabUser`.`name`
            WHERE `tabCRM Note`.`parenttype` = 'Opportunity'
              AND  `tabCRM Note`.`parent` = '{opportunity}'
        ) AS `raw`
        ORDER BY `raw`.`creation` DESC;""".format(opportunity=opportunity)
    return frappe.db.sql(sql_query, as_dict=True)
