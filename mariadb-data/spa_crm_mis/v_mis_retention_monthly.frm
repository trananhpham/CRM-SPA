TYPE=VIEW
query=select `x`.`month_start` AS `month_start`,`x`.`total_customers` AS `total_customers`,`x`.`returning_customers` AS `returning_customers`,round(`x`.`returning_customers` / nullif(`x`.`total_customers`,0) * 100,2) AS `retention_rate_percent` from (select date_format(`s`.`session_date`,\'%Y-%m-01\') AS `month_start`,count(distinct `s`.`customer_id`) AS `total_customers`,count(distinct case when exists(select 1 from `spa_crm_mis`.`service_sessions` `s2` where `s2`.`customer_id` = `s`.`customer_id` and `s2`.`status` = \'COMPLETED\' and `s2`.`session_date` < str_to_date(date_format(`s`.`session_date`,\'%Y-%m-01\'),\'%Y-%m-%d\') limit 1) then `s`.`customer_id` end) AS `returning_customers` from `spa_crm_mis`.`service_sessions` `s` where `s`.`status` = \'COMPLETED\' group by date_format(`s`.`session_date`,\'%Y-%m-01\')) `x`
md5=e6b60c146900192202d70396784f0125
updatable=1
algorithm=0
definer_user=root
definer_host=localhost
suid=2
with_check_option=0
timestamp=0001782244009066001
create-version=2
source=SELECT\n    month_start,\n    total_customers,\n    returning_customers,\n    ROUND(returning_customers / NULLIF(total_customers, 0) * 100, 2) AS retention_rate_percent\nFROM (\n    SELECT\n        DATE_FORMAT(s.session_date, \'%Y-%m-01\') AS month_start,\n        COUNT(DISTINCT s.customer_id) AS total_customers,\n        COUNT(DISTINCT CASE\n            WHEN EXISTS (\n                SELECT 1\n                FROM service_sessions s2\n                WHERE s2.customer_id = s.customer_id\n                  AND s2.status = \'COMPLETED\'\n                  AND s2.session_date < STR_TO_DATE(DATE_FORMAT(s.session_date, \'%Y-%m-01\'), \'%Y-%m-%d\')\n            )\n            THEN s.customer_id\n        END) AS returning_customers\n    FROM service_sessions s\n    WHERE s.status = \'COMPLETED\'\n    GROUP BY DATE_FORMAT(s.session_date, \'%Y-%m-01\')\n) x
client_cs_name=utf8mb4
connection_cl_name=utf8mb4_uca1400_ai_ci
view_body_utf8=select `x`.`month_start` AS `month_start`,`x`.`total_customers` AS `total_customers`,`x`.`returning_customers` AS `returning_customers`,round(`x`.`returning_customers` / nullif(`x`.`total_customers`,0) * 100,2) AS `retention_rate_percent` from (select date_format(`s`.`session_date`,\'%Y-%m-01\') AS `month_start`,count(distinct `s`.`customer_id`) AS `total_customers`,count(distinct case when exists(select 1 from `spa_crm_mis`.`service_sessions` `s2` where `s2`.`customer_id` = `s`.`customer_id` and `s2`.`status` = \'COMPLETED\' and `s2`.`session_date` < str_to_date(date_format(`s`.`session_date`,\'%Y-%m-01\'),\'%Y-%m-%d\') limit 1) then `s`.`customer_id` end) AS `returning_customers` from `spa_crm_mis`.`service_sessions` `s` where `s`.`status` = \'COMPLETED\' group by date_format(`s`.`session_date`,\'%Y-%m-01\')) `x`
sql_path=CURRENT_SCHEMA
mariadb-version=120302
