TYPE=VIEW
query=select date_format(`ss`.`session_date`,\'%Y-%m-01\') AS `month_start`,`e`.`employee_id` AS `employee_id`,`e`.`full_name` AS `employee_name`,count(`ss`.`session_id`) AS `total_sessions`,sum(`ss`.`actual_price`) AS `total_service_revenue`,sum(`c`.`commission_amount`) AS `total_commission` from ((`spa_crm_mis`.`commissions` `c` join `spa_crm_mis`.`employees` `e` on(`c`.`employee_id` = `e`.`employee_id`)) join `spa_crm_mis`.`service_sessions` `ss` on(`c`.`session_id` = `ss`.`session_id`)) group by date_format(`ss`.`session_date`,\'%Y-%m-01\'),`e`.`employee_id`,`e`.`full_name`
md5=448cdcda2b333ce9237b96bb0deb3612
updatable=0
algorithm=0
definer_user=root
definer_host=localhost
suid=2
with_check_option=0
timestamp=0001782244009079713
create-version=2
source=SELECT\n    DATE_FORMAT(ss.session_date, \'%Y-%m-01\') AS month_start,\n    e.employee_id,\n    e.full_name AS employee_name,\n    COUNT(ss.session_id) AS total_sessions,\n    SUM(ss.actual_price) AS total_service_revenue,\n    SUM(c.commission_amount) AS total_commission\nFROM commissions c\nJOIN employees e ON c.employee_id = e.employee_id\nJOIN service_sessions ss ON c.session_id = ss.session_id\nGROUP BY\n    DATE_FORMAT(ss.session_date, \'%Y-%m-01\'),\n    e.employee_id,\n    e.full_name
client_cs_name=utf8mb4
connection_cl_name=utf8mb4_uca1400_ai_ci
view_body_utf8=select date_format(`ss`.`session_date`,\'%Y-%m-01\') AS `month_start`,`e`.`employee_id` AS `employee_id`,`e`.`full_name` AS `employee_name`,count(`ss`.`session_id`) AS `total_sessions`,sum(`ss`.`actual_price`) AS `total_service_revenue`,sum(`c`.`commission_amount`) AS `total_commission` from ((`spa_crm_mis`.`commissions` `c` join `spa_crm_mis`.`employees` `e` on(`c`.`employee_id` = `e`.`employee_id`)) join `spa_crm_mis`.`service_sessions` `ss` on(`c`.`session_id` = `ss`.`session_id`)) group by date_format(`ss`.`session_date`,\'%Y-%m-01\'),`e`.`employee_id`,`e`.`full_name`
sql_path=CURRENT_SCHEMA
mariadb-version=120302
